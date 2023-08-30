import { useSelector } from 'react-redux';

// Import Components
import Loader from '../../Loader';

function Home() {
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
      value: totalUsers,
    },
    {
      title: 'Total Admins',
      value: totalAdmins,
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
    <div className="w-full flex flex-col items-center justify-center p-4">
      {loading || adminLoading ? (
        <Loader />
      ) : (
        <div className="w-full flex flex-row items-center justify-center space-x-5">
          <table className="bg-orange-700 sm:w-1/3 table-auto border-collapse border-2 border-orange-700 rounded-lg text-left overflow-hidden whitespace-no-wrap">
            <thead className="bg-orange-700 h-10 uppercase font-bold">
              <tr>
                <th className="border border-orange-500 px-4 py-2 sm:px-2 sm:py-1">
                  Title
                </th>
                <th className="border border-orange-500 px-4 py-2 sm:px-2 sm:py-1">
                  Count
                </th>
              </tr>
            </thead>
            <tbody className="bg-orange-600 text-orange-100">
              {CardList.map((card, index) => (
                <tr key={index}>
                  <td className="border border-orange-500 px-4 py-2 sm:px-2 sm:py-1">
                    {card.title}
                  </td>
                  <td className="border border-orange-500 px-4 py-2 sm:px-2 sm:py-1">
                    {card.count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>Create New Pizza</div>
        </div>
      )}
    </div>
  );
}

export default Home;
