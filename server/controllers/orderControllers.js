const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

// Import Utils
const { updateInventoryQuantity } = require('../utils/inventoryUtils');
const { parsePaginationParams, parseSortParams, buildPaginationResponse } = require('../utils/paginationUtils');
const { executeInventoryDeductions, checkInventoryAvailability, rollbackInventoryDeductions } = require('../utils/inventoryDeductionUtils');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { ERROR_CODES } = require('../constants/errorCodes');
const { ORDER_STATUS, PAYMENT_STATUS, STRIPE_EVENTS } = require('../constants');

// Initialize Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Import Schemas
const Order = require('../schemas/orderSchema');
const Pizza = require('../schemas/pizzaSchema');
const User = require('../schemas/userSchema');
const sendEmail = require('../middlewares/nodemailerMiddleware');

// Initialize Controllers

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private

const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, deliveryAddress, salesTax, deliveryCharges, totalPrice, payment } = req.body;

  // Transform orderItems to have the correct structure for inventory checks
  // Frontend sends items with _id field, but inventory utils expect pizza field
  const transformedOrderItems = orderItems.map((item) => ({
    pizza: item._id,
    qty: item.qty,
    size: item.size,
    price: item.price,
    name: item.name,
  }));

  // Check inventory availability before creating order
  const inventoryCheck = await checkInventoryAvailability(transformedOrderItems);
  
  if (!inventoryCheck.available) {
    res.status(400);
    throw new Error(
      `Insufficient inventory: ${JSON.stringify(inventoryCheck.insufficientItems)}`
    );
  }

  // Create the order
  const order = new Order({
    user: req.user._id,
    orderItems: transformedOrderItems.map((item) => ({
      pizza: item.pizza,
      size: item.size,
      qty: item.qty,
      price: item.price,
    })),
    deliveryAddress,
    salesTax,
    deliveryCharges,
    totalPrice,
    payment: {
      method: payment.method,
      status: payment.method === 'cod' ? PAYMENT_STATUS.PENDING : payment.status,
      ...(payment.stripeSessionId && { stripeSessionId: payment.stripeSessionId }),
      ...(payment.stripePaymentIntentId && { stripePaymentIntentId: payment.stripePaymentIntentId })
    },
  });

  const createdOrder = await order.save();

  // Deduct inventory for the order
  let inventoryDeducted = false;
  try {
    const deductionResult = await executeInventoryDeductions(transformedOrderItems);
    
    if (!deductionResult.success) {
      // Rollback order creation
      await Order.findByIdAndDelete(createdOrder._id);
      res.status(400);
      throw new Error(deductionResult.message);
    }
    
    inventoryDeducted = true;
    console.log(`Inventory deducted for order ${createdOrder._id}`);
  } catch (error) {
    // Rollback order if inventory deduction fails
    await Order.findByIdAndDelete(createdOrder._id);
    throw error;
  }

  // Send Email Notification to User
  const user = await User.findById(req.user._id);
  if (user && user.email) {
    const emailBody = `
      Thank you for your order!<br><br>
      Your order has been successfully created.<br><br>
      <b>Order Details:</b><br>
      <ul>
        ${orderItems
          .map((item) => `<li>${item.qty} x ${item.name}</li>`)
          .join('')}
      </ul>
      <b>Total Price:</b> $${totalPrice}<br>
      <b>Delivery Address:</b> ${deliveryAddress.address}, ${deliveryAddress.city}, ${
      deliveryAddress.postalCode
    }, ${deliveryAddress.country}<br><br>
      We will notify you once your order is out for delivery.<br><br>
      Thank you for choosing Pizza Palette!
    `;
    
    const orderUrl = `${process.env.FRONTEND_URL}/my-orders/${createdOrder._id}`;

    await sendEmail({
      to: user.email,
      subject: 'Order Confirmation',
      templateOptions: {
        title: 'Order Confirmation',
        greeting: `Hi ${user.name || ''},`,
        message: emailBody,
        actionUrl: orderUrl,
        actionText: 'View Order Details'
      },
    }).catch(err => {
      console.error('Email sending failed:', err);
    });
  }

  res.status(201).json(
    ApiResponse.success(
      createdOrder,
      'Order Created Successfully!',
      201
    )
  );
});

// @desc    Get Orders by User Id
// @route   GET /api/orders/user
// @access  Private

const getOrdersByUserId = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePaginationParams(req.query);
  const sort = parseSortParams(req.query, '-createdAt');
  
  const filter = { user: req.user._id };
  if (req.query.status) {
    filter.status = req.query.status;
  }

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('orderItems.pizza', 'name price imageUrl')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-__v'),
    Order.countDocuments(filter)
  ]);

  res.status(200).json(buildPaginationResponse(orders, total, page, limit));
});

// @desc    Get all Orders
// @route   GET /api/orders
// @access  Admin

const getAllOrders = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePaginationParams(req.query);
  const sort = parseSortParams(req.query, '-createdAt');
  
  // Build filter
  const filter = {};
  if (req.query.status) {
    filter.status = req.query.status;
  }
  if (req.query.userId) {
    filter.user = req.query.userId;
  }

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('user', 'name email')
      .populate('orderItems.pizza', 'name price')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-__v'),
    Order.countDocuments(filter)
  ]);

  res.status(200).json(buildPaginationResponse(orders, total, page, limit));
});

// @desc    Get Order by Id
// @route   GET /api/orders/:id
// @access  Private/Admin

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email phoneNumber')
    .populate('orderItems.pizza', 'name description price imageUrl')
    .select('-__v');

  if (!order) {
    throw ApiError.notFound('Order not found', ERROR_CODES.ORDER_NOT_FOUND);
  }

  // Allow users to view their own orders, admins can view any order
  if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('You can only view your own orders', ERROR_CODES.AUTHORIZATION_ERROR);
  }

  res.status(200).json(ApiResponse.success(order, 'Order retrieved successfully'));
});

// @desc    Update Order by Id
// @route   PUT /api/orders/:id
// @access  Admin

const updateOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order Not Found!');
  }

  const oldStatus = order.status;
  const newStatus = req.body.status || order.status;
  
  order.status = newStatus;

  if (newStatus === ORDER_STATUS.DELIVERED) {
    order.deliveredAt = Date.now();
  } else {
    order.deliveredAt = undefined;
  }

  const updatedOrder = await order.save();

  // Send email notification if status changed
  if (oldStatus !== newStatus && order.user) {
    const statusMessages = {
      [ORDER_STATUS.RECEIVED]: {
        subject: 'Order Received',
        title: 'Order Received',
        message: `Your order #${order._id} has been received and is being reviewed.`
      },
      [ORDER_STATUS.IN_KITCHEN]: {
        subject: 'Order Being Prepared',
        title: 'Order in Kitchen',
        message: `Good news! Your order #${order._id} is now being prepared in our kitchen.`
      },
      [ORDER_STATUS.OUT_FOR_DELIVERY]: {
        subject: 'Order On The Way',
        title: 'Out for Delivery',
        message: `Your order #${order._id} is on its way! Our delivery person will reach you soon.`
      },
      [ORDER_STATUS.DELIVERED]: {
        subject: 'Order Delivered',
        title: 'Bon Appétit!',
        message: `Your order #${order._id} has been delivered. We hope you enjoy your meal!`
      },
      [ORDER_STATUS.CANCELLED]: {
        subject: 'Order Cancelled',
        title: 'Order Cancelled',
        message: `Your order #${order._id} has been cancelled. If you have any questions, please contact our support.`
      }
    };

    const statusInfo = statusMessages[newStatus] || {
      subject: 'Order Status Updated',
      title: 'Order Update',
      message: `Your order #${order._id} status has been updated to: ${newStatus}`
    };

    const orderTrackingUrl = `${process.env.FRONTEND_URL}/my-orders/${order._id}`;
    
    try {
      await sendEmail({
        to: order.user.email,
        subject: `🍕 ${statusInfo.subject} - Pizza Palette`,
        templateOptions: {
          title: statusInfo.title,
          greeting: `Hi ${order.user.name || 'Valued Customer'},`,
          message: `
            <div style="padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
              <p style="font-size: 16px; line-height: 1.6;">${statusInfo.message}</p>
              <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
              <p style="font-size: 14px; color: #666;">
                <strong>Order Total:</strong> ₹${order.totalPrice}<br>
                <strong>Payment Status:</strong> ${order.isPaid ? 'Paid' : 'Pending'}<br>
                <strong>Delivery Address:</strong> ${order.deliveryAddress.address}, ${order.deliveryAddress.city}
              </p>
            </div>
            <p style="margin-top: 20px; font-size: 14px;">
              Thank you for choosing Pizza Palette!
            </p>
          `,
          actionUrl: orderTrackingUrl,
          actionText: 'Track Your Order'
        }
      });
      console.log(`Status update email sent for order ${order._id} (${oldStatus} → ${newStatus})`);
    } catch (emailError) {
      console.error(`Failed to send status update email:`, emailError);
    }
  }

  res.status(200).json({
    updatedOrder,
    message: 'Order Updated Successfully!',
    emailSent: oldStatus !== newStatus
  });
});

// @desc    Delete Order by Id
// @route   DELETE /api/orders/:id
// @access  Admin

const deleteOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);

  if (order) {
    res.status(200).json({
      message: 'Order Deleted Successfully!',
    });
  } else {
    res.status(404);
    throw new Error('Order Not Found!');
  }
});

// @desc Create Stripe Checkout Session
// @route POST /api/orders/create-checkout-session
// @access Private
const createStripeCheckoutSession = asyncHandler(async (req, res) => {
  const { orderItems, deliveryAddress, salesTax, deliveryCharges, totalPrice } = req.body;

  // Transform orderItems to have the correct structure for inventory checks
  const transformedOrderItems = orderItems.map((item) => ({
    pizza: item._id,
    qty: item.qty,
    size: item.size,
    price: item.price,
    name: item.name,
  }));

  // Check inventory availability before creating order
  const inventoryCheck = await checkInventoryAvailability(transformedOrderItems);
  
  if (!inventoryCheck.available) {
    throw ApiError.insufficientInventory(
      'Insufficient inventory for one or more items',
      inventoryCheck.insufficientItems
    );
  }

  // Create the order first with pending payment status
  const order = new Order({
    user: req.user._id,
    orderItems: transformedOrderItems.map((item) => ({
      pizza: item.pizza,
      size: item.size,
      qty: item.qty,
      price: item.price,
    })),
    deliveryAddress,
    salesTax,
    deliveryCharges,
    totalPrice,
    payment: {
      method: 'stripe',
      status: PAYMENT_STATUS.PENDING,
    },
  });

  const createdOrder = await order.save();

  // Deduct inventory for the order
  try {
    const deductionResult = await executeInventoryDeductions(transformedOrderItems);
    
    if (!deductionResult.success) {
      // Rollback order creation
      await Order.findByIdAndDelete(createdOrder._id);
      throw ApiError.insufficientInventory(deductionResult.message);
    }
    
    console.log(`Inventory deducted for order ${createdOrder._id}`);
  } catch (error) {
    // Rollback order if inventory deduction fails
    await Order.findByIdAndDelete(createdOrder._id);
    throw error;
  }

  try {
    // Create line items for Stripe
    const lineItems = orderItems.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: `${item.size} pizza`,
          images: item.imageUrl ? [item.imageUrl] : []
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.qty,
    }));

    // Add delivery charges if applicable
    if (deliveryCharges > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Delivery Charges',
          },
          unit_amount: Math.round(deliveryCharges * 100),
        },
        quantity: 1,
      });
    }

    // Add sales tax
    if (salesTax > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Sales Tax',
          },
          unit_amount: Math.round(salesTax * 100),
        },
        quantity: 1,
      });
    }

    // Create Stripe checkout session with minimal metadata (just order ID)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${createdOrder._id}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel?order_id=${createdOrder._id}`,
      customer_email: req.user.email,
      metadata: {
        userId: req.user._id.toString(),
        orderId: createdOrder._id.toString(), // Only pass order ID (much smaller)
      }
    });

    return res.json(ApiResponse.success({
      sessionId: session.id,
      url: session.url,
      orderId: createdOrder._id, // Return order ID to frontend
    }, 'Stripe checkout session created successfully'));
  } catch (error) {
    console.error('Stripe Checkout Session Error:', error);
    // If Stripe session creation fails, we should keep the order but mark it as failed
    // Or delete it - depending on business logic. For now, let's update its status
    await Order.findByIdAndUpdate(createdOrder._id, {
      'payment.status': PAYMENT_STATUS.FAILED
    });
    throw ApiError.paymentError('Failed to create checkout session. Please try again.');
  }
});

// @desc Handle Stripe Webhook
// @route POST /api/orders/stripe-webhook
// @access Public (Stripe)
const handleStripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case STRIPE_EVENTS.CHECKOUT_COMPLETED:
      const session = event.data.object;
      
      try {
        // Find existing order by ID from metadata
        const order = await Order.findById(session.metadata.orderId);
        
        if (!order) {
          console.error(`Order not found for Stripe session: ${session.id}, orderId: ${session.metadata.orderId}`);
          break;
        }
        
        // Update payment details
        order.payment.stripeSessionId = session.id;
        order.payment.stripePaymentIntentId = session.payment_intent;
        order.payment.status = PAYMENT_STATUS.SUCCESS;
        
        await order.save();
        
        // Send confirmation email
        const user = await User.findById(order.user);
        if (user && user.email) {
          const emailBody = `
            Thank you for your payment!<br><br>
            Your order has been successfully paid and confirmed.<br><br>
            <b>Order Details:</b><br>
            <b>Order ID:</b> ${order._id}<br>
            <b>Total Amount:</b> $${order.totalPrice}<br><br>
            We will notify you once your order is out for delivery.<br><br>
            Thank you for choosing Pizza Palette!
          `;
          
          const orderUrl = `${process.env.FRONTEND_URL}/my-orders/${order._id}`;
          await sendEmail({
            to: user.email,
            subject: 'Payment Confirmed - Order Confirmation',
            templateOptions: {
              title: 'Payment Confirmed',
              greeting: `Hi ${user.name || ''},`,
              message: emailBody,
              actionUrl: orderUrl,
              actionText: 'View Order Details'
            },
          }).catch(err => {
            console.error('Email sending failed:', err);
          });
        }
        
        console.log(`Payment confirmed for order: ${order._id}`);
      } catch (error) {
        console.error('Error processing Stripe webhook:', error);
      }
      break;

    case STRIPE_EVENTS.PAYMENT_FAILED:
      const failedSession = event.data.object;
      try {
        // Update order status to failed if we have the order ID
        if (failedSession.metadata.orderId) {
          await Order.findByIdAndUpdate(failedSession.metadata.orderId, {
            'payment.status': PAYMENT_STATUS.FAILED
          });
          console.log(`Payment failed for order: ${failedSession.metadata.orderId}`);
        }
      } catch (error) {
        console.error('Error handling payment failure:', error);
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// @desc Update Order Payment Status (for COD orders)
// @route PATCH /api/orders/:id/payment-status
// @access Private/Admin
const updateOrderPaymentStatus = asyncHandler(async (req, res) => {
  const { paymentStatus } = req.body;
  
  if (!paymentStatus) {
    throw ApiError.validation('Payment status is required');
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    throw ApiError.notFound('Order not found');
  }

  // Only allow updating payment status for COD orders
  if (order.payment.method !== 'cod') {
    throw ApiError.validation('Payment status can only be updated for COD orders');
  }

  order.payment.status = paymentStatus;
  const updatedOrder = await order.save();

  // Send email notification if payment is marked as paid
  if (paymentStatus === PAYMENT_STATUS.PAID) {
    const user = await User.findById(order.user);
    if (user && user.email) {
      await sendEmail({
        to: user.email,
        subject: 'Payment Received',
        templateOptions: {
          title: 'Payment Received',
          greeting: `Hi ${user.name || ''},`,
          message: `We have received your cash payment for order ${order._id}. Thank you!`,
        },
      });
    }
  }

  return res.json(ApiResponse.success(updatedOrder, 'Payment status updated successfully'));
});

// Export Controllers

module.exports = {
  createOrder,
  createStripeCheckoutSession,
  handleStripeWebhook,
  updateOrderPaymentStatus,
  getOrdersByUserId,
  getAllOrders,
  getOrderById,
  updateOrderById,
  deleteOrderById
};
