import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Import Thunks
import { listOrdersByUserId } from '../../redux/asyncThunks/orderThunks';

// Import Components
import Loader from '../../components/ui/Loader';
import UserOrdersTable from '../../components/ui/UserOrdersTable';
import Message from '../../components/ui/Message';

function UserOrdersScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  const { loading, userInfo } = user;

  const admin = useSelector((state) => state.admin);
  const { adminUserInfo } = admin;

  const order = useSelector((state) => state.order);
  const {
    loading: orderLoading,
    orderListByUserId,
    orderListByUserIdError,
  } = order;

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
    if (adminUserInfo) {
      navigate('/admin/dashboard');
    }
    if (userInfo && !orderListByUserId) {
      dispatch(listOrdersByUserId(userInfo._id));
    }
  }, [dispatch, navigate, userInfo, adminUserInfo, orderListByUserId]);
  return (
    <section className="min-h-screen flex flex-col justify-center items-center pt-14 px-10 sm:px-16">
      {loading || orderLoading ? (
        <Loader />
      ) : orderListByUserIdError ? (
        <Message>{orderListByUserIdError}</Message>
      ) : (
        <>
          {orderListByUserId.length > 0 ? (
            <>
              <h1 className="text-4xl font-bold text-orange-600 mb-8">
                My Orders
              </h1>
              <UserOrdersTable orders={orderListByUserId} />
            </>
          ) : (
            <div className="text-4xl font-bold text-orange-600">
              No Orders Found!
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default UserOrdersScreen;
