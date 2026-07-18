import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

function CheckoutCancelScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-neutral-50">
      <Card className="max-w-md w-full text-center" padding="lg">
        <FaTimesCircle className="text-error-500 text-6xl mb-4 mx-auto" />
        <h1 className="font-display text-h2 text-neutral-900 mb-2">Payment Cancelled</h1>
        <p className="text-neutral-600 mb-4">
          Your payment was cancelled, but your order has been created with pending payment status.
        </p>

        {orderId && (
          <p className="text-sm text-neutral-500 mb-6">
            Order ID: {orderId}
            <br />
            <span className="text-xs text-primary-600">
              You can view this order in &quot;My Orders&quot; or retry payment.
            </span>
          </p>
        )}

        <div className="flex flex-col gap-3 w-full">
          {orderId && (
            <Button
              variant="primary"
              onClick={() => navigate(`/my-orders/${orderId}`)}
              className="rounded-pill w-full"
            >
              View Order Details
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => navigate('/checkout')}
            className="rounded-pill w-full"
          >
            Try Payment Again
          </Button>
          <Button variant="outline" onClick={() => navigate('/')} className="rounded-pill w-full">
            Back to Home
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default CheckoutCancelScreen;
