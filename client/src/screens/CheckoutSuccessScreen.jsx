import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { FaCheckCircle, FaExclamationCircle, FaSpinner } from 'react-icons/fa';
import { clearCartData } from '../redux/slices/cartSlice';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

function CheckoutSuccessScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');
  const token = useSelector((state) => state.user.userInfo?.token);
  const [paymentStatus, setPaymentStatus] = useState('checking');
  const [checkError, setCheckError] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!orderId || !token) {
      setPaymentStatus('unavailable');
      return undefined;
    }

    let cancelled = false;
    let attempts = 0;
    const checkPayment = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (cancelled) return;
        const status = data.data?.payment?.status;
        if (status === 'success' || status === 'paid') {
          setPaymentStatus('paid');
          return;
        }
        if (status === 'failed') {
          setPaymentStatus('failed');
          return;
        }
      } catch {
        if (!cancelled) setCheckError(true);
      }

      attempts += 1;
      if (!cancelled && attempts < 10) {
        window.setTimeout(checkPayment, 1500);
      } else if (!cancelled) {
        setPaymentStatus('pending');
      }
    };

    checkPayment();
    return () => {
      cancelled = true;
    };
  }, [orderId, token]);

  useEffect(() => {
    if (paymentStatus === 'paid') dispatch(clearCartData());
  }, [dispatch, paymentStatus]);

  useEffect(() => {
    if (orderId && paymentStatus === 'paid') {
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
  }, [orderId, navigate, paymentStatus]);

  const isPaid = paymentStatus === 'paid';
  const isFailed = paymentStatus === 'failed';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-neutral-50">
      <Card className="max-w-md w-full text-center" padding="lg">
        {isPaid ? (
          <FaCheckCircle className="text-accent-green-500 text-6xl mb-4 mx-auto" />
        ) : isFailed ? (
          <FaExclamationCircle className="text-error-400 text-6xl mb-4 mx-auto" />
        ) : (
          <FaSpinner className="text-primary-600 text-5xl mb-4 mx-auto animate-spin" />
        )}
        <h1 className="font-display text-h2 text-neutral-900 mb-2">
          {isPaid ? 'Payment Successful!' : isFailed ? 'Payment Not Completed' : 'Confirming Your Payment'}
        </h1>
        <p className="text-neutral-600 mb-4">
          {isPaid
            ? 'Your payment is confirmed and your order is being prepared.'
            : isFailed
              ? 'We could not confirm this payment. Your order details are available below.'
              : checkError
                ? 'We are still checking the order status. You can safely return to your orders.'
                : 'Stripe has returned you to the store. We are waiting for secure payment confirmation.'}
        </p>

        {orderId ? (
          <>
            <p className="text-sm text-neutral-500 mb-4">Order ID: {orderId}</p>
            {isPaid && (
              <div className="flex items-center justify-center gap-2 text-primary-600 mb-6">
                <FaSpinner className="animate-spin" />
                <p className="text-sm">Redirecting to order details in {countdown}s...</p>
              </div>
            )}
            <Button
              variant="outline"
              onClick={() => navigate(`/my-orders/${orderId}`)}
              className="rounded-pill w-full"
            >
              View Order Details Now
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm text-neutral-500 mb-6">Session ID: {sessionId}</p>
            <Button
              variant="outline"
              onClick={() => navigate('/my-orders')}
              className="rounded-pill w-full"
            >
              View My Orders
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}

export default CheckoutSuccessScreen;
