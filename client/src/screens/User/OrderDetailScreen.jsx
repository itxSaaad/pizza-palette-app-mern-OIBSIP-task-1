import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaArrowLeft } from 'react-icons/fa';

// Import Constants
import { getPizzaSizeLabel } from '../../constants';

// Import Thunks
import { getOrderById } from '../../redux/asyncThunks/orderThunks';

// Import Components
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import Message from '../../components/ui/Message';
import Button from '../../components/ui/Button';

function OrderDetailScreen() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const order = useSelector((state) => state.order);
  const { loading, orderInfo, orderDetailsByIdError } = order;
  const orderDetails = orderInfo;

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderById(orderId));
    }
  }, [dispatch, orderId]);

  if (loading) {
    return (
      <section className="min-h-screen flex flex-col justify-center items-center bg-neutral-50">
        <Loader />
        <p className="text-neutral-700 mt-4">Loading order details...</p>
      </section>
    );
  }

  if (orderDetailsByIdError) {
    return (
      <section className="min-h-screen flex flex-col justify-center items-center bg-neutral-50 px-4">
        <Card className="max-w-md w-full" padding="lg">
          <Message variant="error">{orderDetailsByIdError}</Message>
          <div className="text-center mt-6">
            <Link to="/my-orders">
              <Button variant="primary">
                <FaArrowLeft className="inline mr-2" />
                Back to Orders
              </Button>
            </Link>
          </div>
        </Card>
      </section>
    );
  }

  if (!orderDetails) {
    return null;
  }

  return (
    <section className="min-h-screen bg-neutral-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate('/my-orders')}
            className="flex items-center text-primary-600 hover:text-primary-700 mb-4 min-h-[44px]"
          >
            <FaArrowLeft className="mr-2" />
            Back to My Orders
          </button>
          <h1 className="font-display text-h2 text-neutral-900">Order Details</h1>
          <p className="text-neutral-600">Order ID: {orderDetails._id}</p>
        </div>

        {/* Order Status Card */}
        <Card className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">Order Status</h2>
                <div className="mt-1">
                  <Badge.OrderStatus status={orderDetails.status} />
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-600">Ordered On</p>
              <p className="text-neutral-900 font-medium">
                {new Date(orderDetails.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </Card>

        {/* Order Items */}
        <Card className="mb-6">
          <h2 className="text-xl font-bold text-neutral-900 mb-4">Order Items</h2>
          <div className="space-y-4">
            {orderDetails.orderItems &&
              orderDetails.orderItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-neutral-200 pb-4 last:border-0"
                >
                  <div className="flex items-center flex-1">
                    <img
                      src={item.pizza?.imageUrl || '/placeholder-pizza.png'}
                      alt={item.pizza?.name || 'Pizza'}
                      className="w-16 h-16 object-cover rounded-control mr-4"
                    />
                    <div>
                      <h3 className="font-semibold text-neutral-900">
                        {item.pizza?.name || 'Pizza'}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        Size: {getPizzaSizeLabel(item.size)} | Qty: {item.qty}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-600">${item.price}</p>
                  </div>
                </div>
              ))}
          </div>
        </Card>

        {/* Delivery Information */}
        <Card className="mb-6">
          <h2 className="text-xl font-bold text-neutral-900 mb-4">Delivery Information</h2>
          <div className="space-y-2">
            <p className="text-neutral-700">
              <span className="font-semibold">Address:</span>{' '}
              {orderDetails.deliveryAddress?.address}
            </p>
            <p className="text-neutral-700">
              <span className="font-semibold">City:</span> {orderDetails.deliveryAddress?.city}
            </p>
            <p className="text-neutral-700">
              <span className="font-semibold">Postal Code:</span>{' '}
              {orderDetails.deliveryAddress?.postalCode}
            </p>
            <p className="text-neutral-700">
              <span className="font-semibold">Country:</span>{' '}
              {orderDetails.deliveryAddress?.country}
            </p>
            <p className="text-neutral-700">
              <span className="font-semibold">Phone:</span>{' '}
              {orderDetails.deliveryAddress?.phoneNumber}
            </p>
          </div>
        </Card>

        {/* Payment & Price Summary */}
        <Card>
          <h2 className="text-xl font-bold text-neutral-900 mb-4">Payment Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-neutral-700">
              <span>Subtotal:</span>
              <span>
                ${orderDetails.totalPrice - orderDetails.salesTax - orderDetails.deliveryCharges}
              </span>
            </div>
            <div className="flex justify-between text-neutral-700">
              <span>Sales Tax:</span>
              <span>${orderDetails.salesTax}</span>
            </div>
            <div className="flex justify-between text-neutral-700">
              <span>Delivery Charges:</span>
              <span>${orderDetails.deliveryCharges}</span>
            </div>
            <div className="border-t border-neutral-200 pt-2 mt-2">
              <div className="flex justify-between text-lg font-bold text-neutral-900">
                <span>Total:</span>
                <span className="text-primary-600">${orderDetails.totalPrice}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-200">
              <p className="text-neutral-700">
                <span className="font-semibold">Payment Method:</span>{' '}
                {orderDetails.payment?.method}
              </p>
              <p className="text-neutral-700">
                <span className="font-semibold">Payment Status:</span>{' '}
                <span
                  className={
                    orderDetails.isPaid
                      ? 'text-accent-green-600 font-semibold'
                      : 'text-accent-gold-600 font-semibold'
                  }
                >
                  {orderDetails.isPaid ? 'Paid' : 'Pending'}
                </span>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

export default OrderDetailScreen;
