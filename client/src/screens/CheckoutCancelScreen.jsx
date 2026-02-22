import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';
import Button from '../components/ui/Button';

function CheckoutCancelScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-orange-200">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <FaTimesCircle className="text-red-500 text-6xl mb-4 mx-auto" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Cancelled</h1>
        <p className="text-gray-600 mb-4">
          Your payment was cancelled, but your order has been created with pending payment status.
        </p>
        
        {orderId && (
          <p className="text-sm text-gray-500 mb-6">
            Order ID: {orderId}
            <br />
            <span className="text-xs text-orange-600">
              You can view this order in "My Orders" or retry payment.
            </span>
          </p>
        )}
        
        <div className="flex flex-col gap-3 w-full">
          {orderId && (
            <Button
              variant="primary"
              onClick={() => navigate(`/my-orders/${orderId}`)}
              className="rounded-full w-full"
            >
              View Order Details
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => navigate('/checkout')}
            className="rounded-full w-full"
          >
            Try Payment Again
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="rounded-full w-full"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutCancelScreen;
