import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Import Constants
import { PAYMENT_STATUS } from '../../../constants';

// Import Thunks
import { createOrder } from '../../../redux/asyncThunks/orderThunks';
import { clearCartData, createStripeCheckoutSession } from '../../../redux/slices/cartSlice';

// Import Components
import Button from '../Button';
import Loader from '../Loader';
import Message from '../Message';

function PlaceOrderStep({ setCurrentStep }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress, paymentMethod, cartItems, stripeCheckoutUrl, stripeCheckoutError } =
    cart;

  const order = useSelector((state) => state.order);
  const { loading, orderInfo, orderCreateSuccess, orderCreateError } = order;

  const orderSummary = [
    {
      name: 'Items Price',
      value: cartItems && cartItems.reduce((acc, item) => acc + item.price * item.qty, 0),
    },
    {
      name: 'Delivery Charges',
      value:
        cartItems && cartItems.reduce((acc, item) => acc + item.price * item.qty, 0) > 100 ? 0 : 10,
    },
    {
      name: 'Sales Tax',
      value:
        cartItems &&
        Number((0.15 * cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)).toFixed(2)),
    },
    {
      name: 'Total',
      value:
        cartItems &&
        Math.round(
          (
            cartItems.reduce((acc, item) => acc + item.price * item.qty, 0) +
            (cartItems.reduce((acc, item) => acc + item.price * item.qty, 0) > 100 ? 0 : 10) +
            Number(
              (0.15 * cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)).toFixed(2)
            )
          ).toFixed(2)
        ),
    },
  ];

  const handlePlaceOrder = () => {
    if (paymentMethod === 'cod') {
      dispatch(
        createOrder({
          orderItems: cartItems,
          deliveryAddress: shippingAddress,
          salesTax: orderSummary[2].value,
          deliveryCharges: orderSummary[1].value,
          totalPrice: orderSummary[3].value,
          payment: {
            method: 'cod',
            status: PAYMENT_STATUS.PENDING,
          },
        })
      );
    } else if (paymentMethod === 'stripe') {
      dispatch(
        createStripeCheckoutSession({
          orderItems: cartItems,
          deliveryAddress: shippingAddress,
          salesTax: orderSummary[2].value,
          deliveryCharges: orderSummary[1].value,
          totalPrice: orderSummary[3].value,
        })
      );
    }
  };

  useEffect(() => {
    if (orderCreateSuccess && orderInfo && orderInfo._id) {
      dispatch(clearCartData());
      navigate(`/my-orders/${orderInfo._id}`);
      setCurrentStep('Shipping');
    }
  }, [dispatch, navigate, orderCreateSuccess, orderInfo, setCurrentStep]);

  useEffect(() => {
    if (stripeCheckoutUrl) {
      window.location.href = stripeCheckoutUrl;
    }
  }, [stripeCheckoutUrl]);

  return (
    <div className="flex flex-col justify-between items-center mb-4">
      <h1 className="text-center text-neutral-900 text-xl leading-relaxed">Place Order</h1>
      {orderCreateError && <Message>{orderCreateError}</Message>}
      <>
        {loading ? (
          <Loader />
        ) : cartItems && cartItems.length > 0 ? (
          <div className="w-full flex flex-col items-center justify-center border border-primary-200 rounded-card p-4 mt-2 space-y-4 md:flex-row md:space-y-0 md:space-x-6">
            <div className="flex flex-col items-start justify-between w-full md:w-2/3">
              <div className="flex flex-col items-start justify-between w-full py-2">
                <h2 className="text-center text-neutral-900 text-xl leading-relaxed">
                  Shipping Address
                </h2>

                <p className="text-primary-600 text-md leading-relaxed">
                  <span className="text-neutral-900 text-md leading-relaxed mr-2">Phone:</span>
                  {shippingAddress.phoneNumber}
                </p>

                <p className="text-primary-600 text-md leading-relaxed">
                  <span className="text-neutral-900 text-md leading-relaxed mr-2">Address:</span>
                  {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                  {shippingAddress.country}
                </p>
              </div>
              <div className="flex flex-col items-start justify-between w-full md:w-2/3 border-y border-y-primary-200 py-2">
                <h2 className="text-center text-neutral-900 text-xl leading-relaxed">
                  Payment Method
                </h2>
                <p className="text-primary-600 text-md leading-relaxed">
                  <span className="text-neutral-900 text-md leading-relaxed mr-2">Method:</span>
                  {paymentMethod}
                </p>
              </div>
              <div className="flex flex-col items-start justify-between w-full md:2/3 py-2">
                <h2 className="text-center text-neutral-900 text-xl leading-relaxed">
                  Order Items
                </h2>

                <div className="flex flex-col items-start justify-between w-full space-y-2">
                  {cartItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex flex-col sm:flex-row items-center justify-between w-full space-x-5 border-b border-primary-200 py-2"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 rounded-card object-cover"
                      />
                      <div className="flex flex-col sm:flex-row items-center justify-between w-full">
                        <div>
                          <p className="text-primary-600 text-md leading-relaxed">{item.name}</p>
                          <p className="text-neutral-700">
                            Price: ${item.price} | Size:{' '}
                            {item.size.charAt(0).toUpperCase() + item.size.slice(1)}
                          </p>
                        </div>
                        <p className="text-neutral-900 text-md leading-relaxed">
                          {item.qty} x ${item.price}= ${item.price * item.qty}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-between border-2 border-primary-200 rounded-card p-4 sm:w-1/3">
              <h2 className="text-center text-neutral-900 text-xl leading-relaxed">
                Order Summary
              </h2>
              <div className="w-full flex flex-col items-center justify-between my-2 space-y-1">
                {orderSummary.map((item) => (
                  <div
                    key={item.name}
                    className="flex flex-row items-center justify-between w-full border-t border-primary-200"
                  >
                    <p className="text-neutral-900 text-md leading-relaxed">{item.name}</p>
                    <p className="text-neutral-900 text-md leading-relaxed">${item.value}</p>
                  </div>
                ))}
              </div>
              {stripeCheckoutError && <Message>{stripeCheckoutError}</Message>}
              <Button
                variant="outline"
                type="button"
                className="w-full rounded-pill mt-2"
                onClick={handlePlaceOrder}
                disabled={loading || !paymentMethod}
              >
                {paymentMethod === 'stripe' ? 'Proceed to Payment' : 'Place Order'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full">
            <p className="text-center text-primary-600 text-xl leading-relaxed">
              Can&apos;t Place Order Without Order Items
            </p>
          </div>
        )}
      </>
    </div>
  );
}

PlaceOrderStep.propTypes = {
  setCurrentStep: PropTypes.func.isRequired,
};

export default PlaceOrderStep;
