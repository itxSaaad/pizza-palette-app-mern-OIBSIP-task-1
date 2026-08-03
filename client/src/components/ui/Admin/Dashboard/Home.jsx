import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useSelector } from 'react-redux';

// Import Constants
import { ORDER_STATUS } from '../../../../constants';

// Import Components
import Button from '../../Button';
import Card from '../../Card';
import Loader from '../../Loader';
import PizzaCreateModal from './Modals/PizzaCreateModal';
import StockCreateModal from './Modals/StockCreateModal';
import InventoryTable from './InventoryTable';

function Home() {
  const [isPizzaModalVisible, setIsPizzaModalVisible] = useState(false);
  const [isInventoryModalVisible, setIsInventoryModalVisible] = useState(false);

  const user = useSelector((state) => state.user);
  const { loading, userList } = user;

  const admin = useSelector((state) => state.admin);
  const { loading: adminLoading, adminUserList } = admin;

  const order = useSelector((state) => state.order);
  const { orderList, loading: orderLoading } = order;

  const inventory = useSelector((state) => state.inventory);
  const { inventoryList, loading: inventoryLoading } = inventory;

  const totalUsers = userList.length;
  const totalAdmins = adminUserList.length;

  const isCreatedThisMonth = (userDate) => {
    const userCreationDate = new Date(userDate);
    const today = new Date();
    return (
      userCreationDate.getMonth() === today.getMonth() &&
      userCreationDate.getFullYear() === today.getFullYear()
    );
  };

  const usersCreatedThisMonth = userList.filter((user) =>
    isCreatedThisMonth(user.createdAt)
  );

  const adminsCreatedThisMonth = adminUserList.filter((user) =>
    isCreatedThisMonth(user.createdAt)
  );

  const ordersReceived = orderList.filter(
    (order) => order.status === ORDER_STATUS.RECEIVED
  );
  const ordersInTheKitchen = orderList.filter(
    (order) => order.status === ORDER_STATUS.IN_KITCHEN
  );
  const ordersSentForDelivery = orderList.filter(
    (order) => order.status === ORDER_STATUS.OUT_FOR_DELIVERY
  );
  const ordersDelivered = orderList.filter(
    (order) => order.status === ORDER_STATUS.DELIVERED
  );

  const CardList = [
    { title: 'Orders Received', count: ordersReceived.length },
    { title: 'Orders In The Kitchen', count: ordersInTheKitchen.length },
    { title: 'Orders Sent For Delivery', count: ordersSentForDelivery.length },
    { title: 'Orders Delivered', count: ordersDelivered.length },
    { title: 'Total Users', count: totalUsers },
    { title: 'Total Admins', count: totalAdmins },
    { title: 'Users Created This Month', count: usersCreatedThisMonth.length },
    { title: 'Admins Created This Month', count: adminsCreatedThisMonth.length },
  ];

  return (
    <>
      <div className="w-full flex flex-col items-center justify-center p-4">
        <div className="w-full flex flex-col items-center justify-center">
          <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="secondary"
              className="w-full rounded-pill font-bold inline-flex items-center justify-center"
              onClick={() => setIsPizzaModalVisible(true)}
            >
              <FaPlus className="mr-1" />
              Create New Pizza
            </Button>
            <Button
              variant="secondary"
              className="w-full rounded-pill font-bold inline-flex items-center justify-center"
              onClick={() => setIsInventoryModalVisible(true)}
            >
              <FaPlus className="mr-1" />
              Add New Stock
            </Button>
          </div>
          {loading || adminLoading || orderLoading || inventoryLoading ? (
            <div className="w-full flex flex-col items-center justify-center mt-10">
              <Loader />
            </div>
          ) : (
            <>
              {inventoryList ? (
                <>
                  <div>
                    {Object.entries(inventoryList).map(
                      ([category, items]) =>
                        items.some((item) => item.quantity < item.threshold) && (
                          <div key={category}>
                            <h1 className="text-lg font-bold text-white bg-error-600 rounded-t-card py-1 px-2">
                              Low Stock Alert!
                            </h1>
                            <ul className="w-full flex flex-col items-center justify-center p-2 bg-error-500 rounded-b-card shadow-card border border-error-400 list-disc list-inside">
                              {items
                                .filter((item) => item.quantity < item.threshold)
                                .map((item) => (
                                  <li
                                    key={item.id}
                                    className="text-md text-white list-item"
                                  >
                                    <span className="font-bold mr-1">
                                      {item.item}
                                    </span>
                                    is low in stock. Current quantity:
                                    <span className="font-bold mx-1">
                                      {item.quantity}
                                    </span>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )
                    )}
                  </div>
                  <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 text-center">
                    {Object.entries(inventoryList).map(([category, items]) => (
                      <InventoryTable key={category} title={category} items={items} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="w-full flex flex-col items-center justify-center mt-10">
                  <h1 className="text-2xl font-bold text-primary-600">
                    No Stock Available
                  </h1>
                </div>
              )}
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 text-center">
                {CardList.map((card, index) => (
                  <Card key={index}>
                    <h1 className="text-xl font-bold text-primary-700">
                      {card.title}
                    </h1>
                    <h1 className="text-3xl font-bold text-primary-600">
                      {card.count}
                    </h1>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      {isPizzaModalVisible && (
        <PizzaCreateModal onClose={() => setIsPizzaModalVisible(false)} />
      )}
      {isInventoryModalVisible && (
        <StockCreateModal onClose={() => setIsInventoryModalVisible(false)} />
      )}
    </>
  );
}

export default Home;
