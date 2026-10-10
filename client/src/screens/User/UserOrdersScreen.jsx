import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Import Thunks
import { listOrdersByUserId } from '../../redux/asyncThunks/orderThunks';
import { getUserDetails } from '../../redux/asyncThunks/userThunks';

// Import Components
import Loader from '../../components/ui/Loader';
import UserOrdersTable from '../../components/ui/UserOrdersTable';
import Message from '../../components/ui/Message';
import VerificationModal from '../../components/ui/Auth/VerificationModal';

function UserOrdersScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  const { loading, userInfo, userDetails } = user;

  const admin = useSelector((state) => state.admin);
  const { adminUserInfo } = admin;

  const order = useSelector((state) => state.order);
  const {
    loading: orderLoading,
    orderListByUserId,
    orderListByUserIdPagination,
    orderListByUserIdError,
  } = order;

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else if (adminUserInfo) {
      navigate('/admin/dashboard');
    } else {
      dispatch(getUserDetails({}));
      dispatch(listOrdersByUserId({ page }));
    }
  }, [dispatch, navigate, userInfo, adminUserInfo, page]);

  useEffect(() => {
    if (userDetails && !userDetails.isVerified) {
      setModalVisible(true);
    }
  }, [userDetails]);

  return (
    <>
      <section className="min-h-screen flex flex-col justify-center items-center px-10 sm:px-16 bg-neutral-50">
        {loading || orderLoading ? (
          <Loader />
        ) : orderListByUserIdError ? (
          <Message>{orderListByUserIdError}</Message>
        ) : (
          <>
            {orderListByUserId.length > 0 ? (
              <>
                <h1 className="font-display text-h1 text-primary-600 mb-8">My Orders</h1>
                <UserOrdersTable
                  orders={orderListByUserId}
                  pagination={orderListByUserIdPagination}
                  onPageChange={setPage}
                />
              </>
            ) : (
              <div className="font-display text-h2 text-primary-600 text-center">
                No Orders Found!
              </div>
            )}
          </>
        )}
      </section>
      {modalVisible && <VerificationModal onClose={() => setModalVisible(false)} />}
    </>
  );
}

export default UserOrdersScreen;
