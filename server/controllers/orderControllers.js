const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const RazorPay = require('razorpay');

// Import Utils
const { updateInventoryQuantity } = require('../utils/inventoryUtils');

// Import Schemas
const Order = require('../schemas/orderSchema');
const Pizza = require('../schemas/pizzaSchema');

// Initialize Controllers

// @desc Create Razorpay Order
// @route POST /api/orders/checkout
// @access Private

const createRazorpayOrder = asyncHandler(async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const instance = new RazorPay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100,
      currency,
      receipt: new mongoose.Types.ObjectId().toString(),
      payment_capture: 1,
    };

    const order = await instance.orders.create(options);

    if (order) {
      res.status(200).json(order);
    } else {
      res.status(500);
      throw new Error('Order Creation Failed!');
    }
  } catch (error) {
    console.error(error);
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private

const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    deliveryAddress,
    salesTax,
    deliveryCharges,
    totalPrice,
    payment,
  } = req.body;

  if (!orderItems && !Array.isArray(orderItems) && orderItems.length === 0) {
    res.status(400);
    throw new Error('No Order Items');
  } else {
    if (
      !deliveryAddress ||
      (!deliveryAddress.phoneNumber &&
        !deliveryAddress.address &&
        !deliveryAddress.city &&
        !deliveryAddress.postalCode &&
        !deliveryAddress.country)
    ) {
      res.status(400);
      throw new Error('No Delivery Address');
    } else {
      if (isNaN(totalPrice) || totalPrice <= 0) {
        res.status(400);
        throw new Error('Invalid Total Price');
      } else {
        if (deliveryCharges < 0) {
          res.status(400);
          throw new Error('Invalid Delivery Charges');
        } else {
          if (salesTax < 0) {
            res.status(400);
            throw new Error('Invalid Sales Tax');
          } else {
            if (!payment || !['stripe', 'razorpay'].includes(payment.method)) {
              res.status(400);
              throw new Error('Invalid Payment Method');
            } else {
              if (
                payment.method === 'stripe' &&
                !payment.stripePaymentIntentId
              ) {
                res.status(400);
                throw new Error('Invalid Stripe Payment Intent Id');
              } else {
                if (payment.method === 'razorpay' && !payment.razorpayOrderId) {
                  res.status(400);
                  throw new Error('Invalid Razorpay Order Id');
                } else {
                  // Iterate through orderItems to deduct items from inventory
                  for (const orderItem of orderItems) {
                    const pizza = await Pizza.findById(orderItem._id);
                    if (!pizza) {
                      res.status(404).json({ message: 'Pizza Not Found!' });
                      return;
                    }

                    await updateInventoryQuantity(pizza, orderItem.qty);
                  }

                  const order = new Order({
                    user: req.user._id,
                    orderItems: orderItems.map((orderItem) => ({
                      pizza: orderItem._id,
                      qty: orderItem.qty,
                      price: orderItem.price,
                    })),
                    deliveryAddress,
                    salesTax,
                    deliveryCharges,
                    totalPrice,
                    payment,
                  });

                  const createdOrder = await order.save();

                  if (createdOrder) {
                    res.status(200).json({
                      createdOrder,
                      message: 'Order Created Successfully!',
                    });
                  } else {
                    res.status(500);
                    throw new Error('Order Creation Failed!');
                  }
                }
              }
            }
          }
        }
      }
    }
  }
});

// @desc    Get Orders by User Id
// @route   GET /api/orders/user
// @access  Private

const getOrdersByUserId = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });

  if (orders) {
    res.status(200).json(orders);
  } else {
    res.status(404);
    throw new Error('Orders Not Found!');
  }
});

// @desc    Get all Orders
// @route   GET /api/orders
// @access  Admin

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({});

  if (orders) {
    res.status(200).json(orders);
  } else {
    res.status(404);
    throw new Error('Orders Not Found!');
  }
});

// @desc    Get Order by Id
// @route   GET /api/orders/:id
// @access  Private/Admin

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error('Order Not Found!');
  }
});

// @desc    Update Order by Id
// @route   PUT /api/orders/:id
// @access  Admin

const updateOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = req.body.status || order.status;

    if (order.status === 'Delivered') {
      order.deliveredAt = Date.now();
    } else {
      order.deliveredAt = undefined;
    }

    const updatedOrder = await order.save();

    if (updatedOrder) {
      res.status(200).json({
        updatedOrder,
        message: 'Order Updated Successfully!',
      });
    } else {
      res.status(500);
      throw new Error('Order Update Failed!');
    }
  } else {
    res.status(404);
    throw new Error('Order Not Found!');
  }
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

// Export Controllers
module.exports = {
  createRazorpayOrder,
  createOrder,
  getOrdersByUserId,
  getAllOrders,
  getOrderById,
  updateOrderById,
  deleteOrderById,
};
