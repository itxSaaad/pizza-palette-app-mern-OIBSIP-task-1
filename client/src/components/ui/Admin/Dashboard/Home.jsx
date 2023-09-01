import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useSelector } from 'react-redux';

// Import Components
import Button from '../../Button';
import Loader from '../../Loader';
import PizzaCreateModal from './Modals/PizzaCreateModal';
import UpdateInventoryModal from './Modals/UpdateInventoryModal';

function Home() {
  const [isPizzaModalVisible, setIsPizzaModalVisible] = useState(false);
  const [isInventoryModalVisible, setIsInventoryModalVisible] = useState(false);

  const user = useSelector((state) => state.user);
  const { loading, userList } = user;

  const admin = useSelector((state) => state.admin);
  const { loading: adminLoading, adminUserList } = admin;

  const totalUsers = userList.length;
  const totalAdmins = adminUserList.length;

  // Function to check if a user was created today
  const isCreatedToday = (userDate) => {
    const userCreationDate = new Date(userDate);
    const today = new Date();
    return (
      userCreationDate.getDate() === today.getDate() &&
      userCreationDate.getMonth() === today.getMonth() &&
      userCreationDate.getFullYear() === today.getFullYear()
    );
  };

  // Function to check if a user was created this week
  const isCreatedThisWeek = (userDate) => {
    const userCreationDate = new Date(userDate);
    const today = new Date();
    return (
      today.getTime() - userCreationDate.getTime() < 7 * 24 * 60 * 60 * 1000 &&
      today.getDay() >= userCreationDate.getDay()
    );
  };

  // Function to check if a user was created this month
  const isCreatedThisMonth = (userDate) => {
    const userCreationDate = new Date(userDate);
    const today = new Date();
    return (
      userCreationDate.getMonth() === today.getMonth() &&
      userCreationDate.getFullYear() === today.getFullYear()
    );
  };

  // Filter users based on creation date
  const usersCreatedToday = userList.filter((user) =>
    isCreatedToday(user.createdAt)
  );
  const usersCreatedThisWeek = userList.filter((user) =>
    isCreatedThisWeek(user.createdAt)
  );
  const usersCreatedThisMonth = userList.filter((user) =>
    isCreatedThisMonth(user.createdAt)
  );

  // Filter admins based on creation date
  const adminsCreatedToday = adminUserList.filter((user) =>
    isCreatedToday(user.createdAt)
  );
  const adminsCreatedThisWeek = adminUserList.filter((user) =>
    isCreatedThisWeek(user.createdAt)
  );
  const adminsCreatedThisMonth = adminUserList.filter((user) =>
    isCreatedThisMonth(user.createdAt)
  );

  // Filter orders based on creation date
  // Filter Orders based on Status
  // const ordersRecieved = orderList.filter(
  //   (order) => order.status === 'Recieved'
  // );
  // const ordersInTheKitchen = orderList.filter(
  //   (order) => order.status === 'In The Kitchen'
  // );
  // const ordersSentForDelivery = orderList.filter(
  //   (order) => order.status === 'Sent For Delivery'
  // );
  // const ordersDelivered = orderList.filter(
  //   (order) => order.status === 'Delivered'
  // );

  const CardList = [
    {
      title: 'Total Users',
      count: totalUsers,
    },
    {
      title: 'Total Admins',
      count: totalAdmins,
    },
    {
      title: 'Users Created Today',
      count: usersCreatedToday.length,
    },
    {
      title: 'Users Created This Week',
      count: usersCreatedThisWeek.length,
    },
    {
      title: 'Users Created This Month',
      count: usersCreatedThisMonth.length,
    },
    {
      title: 'Admins Created Today',
      count: adminsCreatedToday.length,
    },
    {
      title: 'Admins Created This Week',
      count: adminsCreatedThisWeek.length,
    },
    {
      title: 'Admins Created This Month',
      count: adminsCreatedThisMonth.length,
    },
  ];

  return (
    <>
      <div className="w-full flex flex-col items-center justify-center p-4">
        <div className="w-full flex flex-col items-center justify-center">
          <div className="w-full flex flex-row items-center justify-center space-x-5">
            <Button
              variant="secondary"
              className="w-full rounded-full font-bold inline-flex items-center justify-center"
              onClick={() => {
                setIsPizzaModalVisible(true);
              }}
            >
              <FaPlus className="mr-1" />
              Create New Pizza
            </Button>
            <Button
              variant="secondary"
              className="w-full rounded-full font-bold inline-flex items-center justify-center"
              onClick={() => {
                setIsInventoryModalVisible(true);
              }}
            >
              <FaPlus className="mr-1" />
              Add New Stock
            </Button>
          </div>
          {loading || adminLoading ? (
            <div className="w-full flex flex-col items-center justify-center mt-10">
              <Loader />
            </div>
          ) : (
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 text-center">
              {CardList.map((card, index) => (
                <div
                  key={index}
                  className="w-full flex flex-col items-center justify-center p-2 bg-white rounded-lg shadow-md"
                >
                  <h1 className="text-xl font-bold text-orange-700">
                    {card.title}
                  </h1>
                  <h1 className="text-3xl font-bold text-orange-600">
                    {card.count}
                  </h1>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {isPizzaModalVisible && (
        <PizzaCreateModal
          onClose={() => {
            setIsPizzaModalVisible(false);
          }}
        />
      )}
      {isInventoryModalVisible && (
        <UpdateInventoryModal
          onClose={() => {
            setIsInventoryModalVisible(false);
          }}
        />
      )}
    </>
  );
}

export default Home;
