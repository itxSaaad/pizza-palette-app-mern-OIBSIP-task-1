import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Import Actions
import {
  createRazorPayOrder,
  savePaymentMethod,
} from '../../../redux/slices/cartSlice';

// Import Components
import Button from '../Button';
import Loader from '../Loader';
import Message from '../Message';

function PaymentStep({ setCurrentStep }) {
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const {
    shippingAddress,
    cartItems,
    orderGetRazorPayOrderDetails,
    orderGetRazorPayOrderIdError,
    orderGetRazorPayOrderIdSuccess,
  } = cart;

  const order = useSelector((state) => state.order);
  const { loading } = order;

  const [paymentMethod, setPaymentMethod] = useState(cart.paymentMethod || '');

  useEffect(() => {
    if (!shippingAddress) {
      setCurrentStep('Shipping');
    }
  }, [shippingAddress, setCurrentStep]);

  const submitHandler = (e) => {
    e.preventDefault();

    const amount =
      cartItems &&
      Math.round(
        (
          cartItems.reduce((acc, item) => acc + item.price * item.qty, 0) +
          (cartItems.reduce((acc, item) => acc + item.price * item.qty, 0) > 100
            ? 0
            : 10) +
          Number(
            (
              0.15 *
              cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
            ).toFixed(2)
          )
        ).toFixed(2)
      );

    dispatch(savePaymentMethod(paymentMethod));
    dispatch(createRazorPayOrder({ amount, currency: 'USD' }));
  };

  useEffect(() => {
    if (orderGetRazorPayOrderIdSuccess && orderGetRazorPayOrderDetails) {
      setCurrentStep('Place Order');
    }
  }, [
    orderGetRazorPayOrderIdSuccess,
    orderGetRazorPayOrderDetails,
    setCurrentStep,
  ]);
  return (
    <form onSubmit={submitHandler} className="w-full p-4">
      <p className="text-center text-black text-xl leading-relaxed">
        Payment
        <br />
        <span className="text-sm text-orange-500">Select Payment Method</span>
      </p>
      {loading ? (
        <Loader />
      ) : cartItems && cartItems.length > 0 ? (
        <>
          {orderGetRazorPayOrderIdError && (
            <Message>{orderGetRazorPayOrderIdError}</Message>
          )}
          <div className="flex flex-col items-center justify-center mt-4">
            <div className="flex items-center justify-center">
              <input
                type="radio"
                id="razorpay"
                value="Razorpay"
                name="paymentMethod"
                required
                checked={paymentMethod === 'Razorpay'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              <label
                htmlFor="razorpay"
                className="text-orange-500 font-semibold text-lg"
              >
                Razorpay
              </label>
            </div>
          </div>
          <Button
            variant="outline"
            type="submit"
            disabled={!paymentMethod || !cartItems}
            className="w-full sm:w-1/3 rounded-full mt-4 disabled:cursor-not-allowed"
          >
            Continue
          </Button>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center w-full border border-orange-300 rounded-2xl p-4">
          <p className="text-center text-orange-500 text-xl leading-relaxed">
            Can&apos;t Place Order Without Order Items
          </p>
        </div>
      )}
    </form>
  );
}

PaymentStep.propTypes = {
  setCurrentStep: PropTypes.func.isRequired,
};

export default PaymentStep;
