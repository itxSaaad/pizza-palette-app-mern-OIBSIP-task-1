import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Import Thunks
import { listOrdersByUserId } from '../../redux/asyncThunks/orderThunks';
import { getUserDetails } from '../../redux/asyncThunks/userThunks';

// Import Components
import VerificationModal from '../../components/ui/Auth/VerificationModal';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
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
  const { loading, userDetails, userDetailsError, userInfo, userUpdateProfileSuccess } = user;

  const order = useSelector((state) => state.order);
  const { loading: orderLoading, orderListByUserId, orderListByUserIdError } = order;

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
      <section className="min-h-screen flex flex-col sm:flex-row justify-center items-center px-5 sm:px-16 space-y-5 sm:space-y-0 sm:space-x-5 bg-neutral-50">
        {loading || orderLoading ? (
          <Loader />
        ) : userDetailsError || orderListByUserIdError ? (
          <Message>{userDetailsError || orderListByUserIdError}</Message>
        ) : (
          userDetails && (
            <>
              <Card className="flex flex-col justify-center items-center w-full sm:w-1/3">
                <h2 className="font-display text-h3 text-neutral-900">
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
                    className="rounded-control mt-2"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    Edit Profile
                  </Button>
                )}
              </Card>
              <div className="flex flex-col justify-center items-center w-full sm:w-2/3">
                {orderListByUserId.length > 0 ? (
                  <>
                    <h1 className="font-display text-h2 text-center mb-4 text-primary-600">
                      My Orders
                    </h1>
                    <UserOrdersTable orders={orderListByUserId} />
                  </>
                ) : (
                  <Card className="w-full text-center">
                    <p className="text-2xl font-bold text-primary-600">No Orders Found!</p>
                  </Card>
                )}
              </div>
            </>
          )
        )}
      </section>
      {modalVisible && <VerificationModal onClose={() => setModalVisible(false)} />}
    </>
  );
}

export default ProfileScreen;
