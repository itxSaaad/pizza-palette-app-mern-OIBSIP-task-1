import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaArrowLeft, FaCheckCircle, FaClock, FaTruck, FaBoxOpen } from 'react-icons/fa';

// Import Constants
import { ORDER_STATUS, getOrderStatusColor, getPizzaSizeLabel } from '../../constants';

// Import Thunks
import { getOrderById } from '../../redux/asyncThunks/orderThunks';

// Import Components
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

  const getStatusIcon = (status) => {
    switch (status) {
      case ORDER_STATUS.RECEIVED:
        return <FaBoxOpen className="text-blue-500" />;
      case ORDER_STATUS.IN_KITCHEN:
        return <FaClock className="text-yellow-500" />;
      case ORDER_STATUS.OUT_FOR_DELIVERY:
        return <FaTruck className="text-purple-500" />;
      case ORDER_STATUS.DELIVERED:
        return <FaCheckCircle className="text-green-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen flex flex-col justify-center items-center bg-orange-200">
        <Loader />
        <p className="text-gray-700 mt-4">Loading order details...</p>
      </section>
    );
  }

  if (orderDetailsByIdError) {
    return (
      <section className="min-h-screen flex flex-col justify-center items-center bg-orange-200 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
          <Message variant="error">{orderDetailsByIdError}</Message>
          <div className="text-center mt-6">
            <Link to="/my-orders">
              <Button variant="primary">
                <FaArrowLeft className="inline mr-2" />
                Back to Orders
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (!orderDetails) {
    return null;
  }

  return (
    <section className="min-h-screen bg-orange-200 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/my-orders')}
            className="flex items-center text-orange-600 hover:text-orange-700 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to My Orders
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Order Details</h1>
          <p className="text-gray-600">Order ID: {orderDetails._id}</p>
        </div>

        {/* Order Status Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-3xl mr-4">
                {getStatusIcon(orderDetails.status)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Order Status</h2>
                <p className={`text-lg font-semibold ${getOrderStatusColor(orderDetails.status)}`}>
                  {orderDetails.status}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Ordered On</p>
              <p className="text-gray-800 font-medium">
                {new Date(orderDetails.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Order Items</h2>
          <div className="space-y-4">
            {orderDetails.orderItems && orderDetails.orderItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b border-gray-200 pb-4 last:border-0"
              >
                <div className="flex items-center flex-1">
                  <img
                    src={item.pizza?.imageUrl || '/placeholder-pizza.png'}
                    alt={item.pizza?.name || 'Pizza'}
                    className="w-16 h-16 object-cover rounded-lg mr-4"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {item.pizza?.name || 'Pizza'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Size: {getPizzaSizeLabel(item.size)} | Qty: {item.qty}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-500">${item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Information */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Delivery Information</h2>
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-semibold">Address:</span> {orderDetails.deliveryAddress?.address}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">City:</span> {orderDetails.deliveryAddress?.city}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Postal Code:</span> {orderDetails.deliveryAddress?.postalCode}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Country:</span> {orderDetails.deliveryAddress?.country}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Phone:</span> {orderDetails.deliveryAddress?.phoneNumber}
            </p>
          </div>
        </div>

        {/* Payment & Price Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal:</span>
              <span>${orderDetails.totalPrice - orderDetails.salesTax - orderDetails.deliveryCharges}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Sales Tax:</span>
              <span>${orderDetails.salesTax}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Delivery Charges:</span>
              <span>${orderDetails.deliveryCharges}</span>
            </div>
            <div className="border-t border-gray-300 pt-2 mt-2">
              <div className="flex justify-between text-lg font-bold text-gray-800">
                <span>Total:</span>
                <span className="text-orange-500">${orderDetails.totalPrice}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-gray-700">
                <span className="font-semibold">Payment Method:</span> {orderDetails.payment?.method}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Payment Status:</span>{' '}
                <span className={orderDetails.isPaid ? 'text-green-600 font-semibold' : 'text-yellow-600 font-semibold'}>
                  {orderDetails.isPaid ? 'Paid' : 'Pending'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OrderDetailScreen;
