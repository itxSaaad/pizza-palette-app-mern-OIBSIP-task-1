import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Loader from '../../components/ui/Loader';
import UserOrdersTable from '../../components/ui/UserOrdersTable';

function UserOrdersScreen() {
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
  const { loading, userInfo } = user;

  const admin = useSelector((state) => state.admin);
  const { adminUserInfo } = admin;

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
    if (adminUserInfo) {
      navigate('/admin/dashboard');
    }
  }, [userInfo, adminUserInfo, navigate]);

  return (
    <section className="min-h-screen flex flex-col justify-center items-center pt-14 px-10 sm:px-16">
      {loading ? (
        <Loader />
      ) : (
        <>
          <h1 className="text-4xl font-bold text-orange-600 mb-8">My Orders</h1>
          <UserOrdersTable orders={orders} />
        </>
      )}
    </section>
  );
}

export default UserOrdersScreen;
