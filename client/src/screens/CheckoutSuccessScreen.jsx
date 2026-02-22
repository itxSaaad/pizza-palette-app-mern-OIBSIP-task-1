import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { clearCartData } from '../redux/slices/cartSlice';
import Button from '../components/ui/Button';

function CheckoutSuccessScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Clear cart after successful payment
    dispatch(clearCartData());
  }, [dispatch]);

  useEffect(() => {
    // If we have an orderId, redirect to order details after countdown
    if (orderId) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate(`/my-orders/${orderId}`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [orderId, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-orange-200">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <FaCheckCircle className="text-green-500 text-6xl mb-4 mx-auto" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-4">Your order has been placed and payment confirmed.</p>
        
        {orderId ? (
          <>
            <p className="text-sm text-gray-500 mb-4">Order ID: {orderId}</p>
            <div className="flex items-center justify-center gap-2 text-orange-600 mb-6">
              <FaSpinner className="animate-spin" />
              <p className="text-sm">Redirecting to order details in {countdown}s...</p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate(`/my-orders/${orderId}`)}
              className="rounded-full w-full"
            >
              View Order Details Now
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6">Session ID: {sessionId}</p>
            <Button
              variant="outline"
              onClick={() => navigate('/my-orders')}
              className="rounded-full w-full"
            >
              View My Orders
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default CheckoutSuccessScreen;
