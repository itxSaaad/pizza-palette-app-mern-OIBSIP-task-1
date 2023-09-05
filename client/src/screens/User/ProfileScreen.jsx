import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Import Thunks
import { listOrdersByUserId } from '../../redux/asyncThunks/orderThunks';
import { getUserDetails } from '../../redux/asyncThunks/userThunks';

// Import Components
import VerficationModal from '../../components/ui/Auth/VerficationModal';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import Message from '../../components/ui/Message';
import EditProfileForm from '../../components/ui/Profile/EditProfileForm';
import Profile from '../../components/ui/Profile/Profile';
import UserOrdersTable from '../../components/ui/UserOrdersTable';

function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  const {
    loading,
    userDetails,
    userDetailsError,
    userInfo,
    userUpdateProfileSuccess,
  } = user;

  const order = useSelector((state) => state.order);
  const {
    loading: orderLoading,
    orderListByUserId,
    orderListByUserIdError,
  } = order;

  const successMessage = userUpdateProfileSuccess && {
    status: '200',
    message: 'Updated Successfully!',
  };

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      dispatch(getUserDetails({}));
      dispatch(listOrdersByUserId(userInfo._id));
    }
  }, [dispatch, navigate, userInfo]);

  useEffect(() => {
    if (userDetails && !userDetails.isVerified) {
      setModalVisible(true);
    }
  }, [userDetails]);

  useEffect(() => {
    if (userUpdateProfileSuccess) {
      dispatch(getUserDetails({}));
    }
  }, [dispatch, userUpdateProfileSuccess]);

  return (
    <>
      <section className="min-h-screen flex flex-col sm:flex-row justify-center items-center pt-16 px-5 sm:px-16 space-y-5 sm:space-y-0 sm:space-x-5">
        {loading || orderLoading ? (
          <Loader />
        ) : userDetailsError || orderListByUserIdError ? (
          <Message>{userDetailsError || orderListByUserIdError}</Message>
        ) : (
          userDetails && (
            <>
              <div className="flex flex-col justify-center items-center p-4 rounded-2xl w-full sm:w-1/3 border border-orange-300">
                <h2 className="text-2xl font-bold">
                  {isEditing ? 'Edit Profile' : 'Your Profile'}
                </h2>
                {isEditing ? (
                  <EditProfileForm setIsEditing={setIsEditing} />
                ) : (
                  <>
                    {successMessage && <Message>{successMessage}</Message>}
                    <Profile user={userDetails} />
                  </>
                )}
                {!isEditing && (
                  <Button
                    variant="primary"
                    className="rounded-lg"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
              <div className="flex flex-col justify-center items-center w-full sm:w-2/3">
                {orderListByUserId.length > 0 ? (
                  <>
                    <h1 className="text-2xl font-bold text-center mb-4">
                      My Orders
                    </h1>
                    <UserOrdersTable orders={orderListByUserId} />
                  </>
                ) : (
                  <div className="w-full text-4xl text-center font-bold text-orange-600 border-2 border-orange-500 rounded-2xl p-4">
                    No Orders Found!
                  </div>
                )}
              </div>
            </>
          )
        )}
      </section>
      {modalVisible && (
        <VerficationModal onClose={() => setModalVisible(false)} />
      )}
    </>
  );
}

export default ProfileScreen;
