import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Import Components
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import Message from '../components/ui/Message';
import EditProfileForm from '../components/ui/Profile/EditProfileForm';
import Profile from '../components/ui/Profile/Profile';
import UserOrdersTable from '../components/ui/UserOrdersTable';

// Import Actions
import { getUserDetails } from '../redux/asyncThunks/userThunks';

function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);

  const orders = [
    {
      id: 1,
      name: 'John Doe',
      status: 'Sent for Delivery',
      totalPrice: 200,
      date: '2021-05-01',
    },
    {
      id: 2,
      name: 'John Doe',
      status: 'Recieved',
      totalPrice: 400,
      date: '2021-05-01',
    },
    {
      id: 3,
      name: 'John Doe',
      status: 'In the Kitchen',
      totalPrice: 290,
      date: '2021-05-02',
    },
    {
      id: 4,
      name: 'John Doe',
      status: 'Delivered',
      totalPrice: 100,
      date: '2021-05-01',
    },
  ];

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

  const successMessage = userUpdateProfileSuccess && {
    status: '200',
    message: 'Updated Successfully!',
  };

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    if (userInfo && !userDetails) {
      dispatch(getUserDetails({}));
    }
  }, [dispatch, userInfo, userDetails]);

  return (
    <section className="min-h-screen flex flex-col sm:flex-row justify-center items-center pt-16 px-5 sm:px-16 space-y-5 sm:space-y-0 sm:space-x-5">
      {loading ? (
        <Loader />
      ) : userDetailsError ? (
        <Message>{userDetailsError}</Message>
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
              <h1 className="text-2xl font-bold text-center mb-4">My Orders</h1>
              <UserOrdersTable orders={orders} />
            </div>
          </>
        )
      )}
    </section>
  );
}

export default ProfileScreen;
