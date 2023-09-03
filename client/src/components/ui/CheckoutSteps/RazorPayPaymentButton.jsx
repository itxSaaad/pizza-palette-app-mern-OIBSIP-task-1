import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Import Actions
import { setRazorPayPaymentDetails } from '../../../redux/slices/cartSlice';

// Import Components
import Button from '../Button';
import Logo from '/android-chrome-512x512.png';

function RazorPayPaymentButton({ amount, orderId }) {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const { userInfo } = user;

  useEffect(() => {
    const loadRazorpayScript = () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        // Razorpay script is loaded, you can now create rzp1 object here

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: amount,
          currency: 'USD',
          name: userInfo.name,
          description: 'Order Payment',
          image: Logo,
          order_id: orderId,
          handler: function (response) {
            dispatch(
              setRazorPayPaymentDetails({
                razorPayPaymentId: response.razorpay_payment_id,
                razorPayOrderId: response.razorpay_order_id,
                razorPaySignature: response.razorpay_signature,
              })
            );
          },
          prefill: {
            name: userInfo.name,
            email: userInfo.email,
            contact: userInfo.phone,
          },
          notes: {
            address: 'Razorpay Corporate Office',
          },
          theme: {
            color: '#61dafb',
          },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response) {
          alert(response.error.code);
          alert(response.error.description);
          alert(response.error.source);
          alert(response.error.step);
          alert(response.error.reason);
          alert(response.error.metadata.order_id);
          alert(response.error.metadata.payment_id);
        });

        window.rzp1 = rzp1;
      };
      document.body.appendChild(script);
    };

    loadRazorpayScript();
  }, [
    amount,
    dispatch,
    orderId,
    userInfo.email,
    userInfo.name,
    userInfo.phone,
  ]);

  return (
    <Button
      variant="outline"
      type="button"
      className="w-full rounded-full mt-2"
      id="rzp-button1"
      onClick={() => {
        if (window.rzp1) {
          window.rzp1.open();
        }
      }}
    >
      Pay Now
    </Button>
  );
}

RazorPayPaymentButton.propTypes = {
  amount: PropTypes.number.isRequired,
  orderId: PropTypes.string.isRequired,
};

export default RazorPayPaymentButton;
