import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

// Import Thunks
import {
  deleteOrderById,
  listOrders,
  updateOrderById,
} from '../../../../../redux/asyncThunks/orderThunks';

// Import Components
import Loader from '../../../Loader';
import Message from '../../../Message';
import Table from '../Table';

function OrdersList() {
  const orderColumns = [
    '_id',
    'user',
    'status',
    'salesTax',
    'deliveryCharges',
    'totalPrice',
    'orderItems',
    'deliveredAt',
  ];

  const dispatch = useDispatch();

  const order = useSelector((state) => state.order);
  const {
    loading,
    orderList,
    orderListError,
    orderDeleteByIdError,
    orderDeleteByIdSuccess,
    orderUpdateByIdError,
    orderUpdateByIdSuccess,
  } = order;

  const ordersReceived =
    orderList && orderList.filter((order) => order.status === 'Received');
  const ordersInTheKitchen =
    orderList && orderList.filter((order) => order.status === 'In the Kitchen');
  const ordersSentForDelivery =
    orderList &&
    orderList.filter((order) => order.status === 'Sent for Delivery');
  const ordersDelivered =
    orderList && orderList.filter((order) => order.status === 'Delivered');

  const handleDelete = (id) => {
    dispatch(deleteOrderById(id)).then(() => dispatch(listOrders({})));
  };

  const successMessageDelete = orderDeleteByIdSuccess && {
    status: '200',
    message: 'Order Deleted Successfully!',
  };

  const handleUpdate = (id, selectedStatus) => {
    dispatch(
      updateOrderById({
        id,
        status: selectedStatus,
      })
    ).then(() => dispatch(listOrders({})));
  };

  const successMessageUpdate = orderUpdateByIdSuccess && {
    status: '200',
    message: 'Order Updated Successfully!',
  };

  useEffect(() => {
    if (!orderList) {
      dispatch(listOrders({}));
    }
  }, [dispatch, orderList]);

  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-bold my-2">All Orders</h2>
      {loading ? (
        <Loader />
      ) : (
        <>
          {(orderListError || orderDeleteByIdError || orderUpdateByIdError) && (
            <Message>
              {orderListError || orderDeleteByIdError || orderUpdateByIdError}
            </Message>
          )}
          {(successMessageDelete || successMessageUpdate) && (
            <Message>{successMessageDelete || successMessageUpdate}</Message>
          )}
          <div className="mt-4">
            {orderList.length > 0 ? (
              <>
                {ordersReceived.length > 0 ? (
                  <div className="mb-4">
                    <h1 className="text-3xl text-center font-bold border-b-2 border-orange-900 p-1 my-2">
                      Received Orders
                    </h1>
                    <Table
                      data={ordersReceived}
                      columns={orderColumns}
                      handleDelete={handleDelete}
                      handleChange={handleUpdate}
                    />
                  </div>
                ) : (
                  <h2 className="text-white text-xl text-center rounded-md border-2 border-orange-400 font-semibold mb-2 p-4">
                    No Orders Received Yet..
                  </h2>
                )}
                {ordersInTheKitchen.length > 0 ? (
                  <div className="mb-4">
                    <h1 className="text-3xl text-center font-bold border-b-2 border-orange-900 p-1 my-2">
                      Orders In The Kitchen
                    </h1>

                    <Table
                      data={ordersInTheKitchen}
                      columns={orderColumns}
                      handleDelete={handleDelete}
                      handleChange={handleUpdate}
                    />
                  </div>
                ) : (
                  <h2 className="text-white text-xl text-center rounded-md border-2 border-orange-400 font-semibold mb-2 p-4">
                    No Orders In The Kitchen..
                  </h2>
                )}
                {ordersSentForDelivery.length > 0 ? (
                  <div className="mb-4">
                    <h1 className="text-3xl text-center font-bold border-b-2 border-orange-900 p-1 my-2">
                      Orders Sent For Delivery
                    </h1>

                    <Table
                      data={ordersSentForDelivery}
                      columns={orderColumns}
                      handleDelete={handleDelete}
                      handleChange={handleUpdate}
                    />
                  </div>
                ) : (
                  <h2 className="text-white text-xl text-center rounded-md border-2 border-orange-400 font-semibold mb-2 p-4">
                    No Orders Sent For Delivery..
                  </h2>
                )}
                {ordersDelivered.length > 0 ? (
                  <div className="mb-4">
                    <h1 className="text-3xl text-center font-bold border-b-2 border-orange-900 p-1 my-2">
                      Orders Delivered
                    </h1>

                    <Table
                      data={ordersDelivered}
                      columns={orderColumns}
                      handleDelete={handleDelete}
                      handleChange={handleUpdate}
                    />
                  </div>
                ) : (
                  <h2 className="text-white text-xl text-center rounded-md border-2 border-orange-400 font-semibold mb-2 p-4">
                    No Orders Delivered..
                  </h2>
                )}
              </>
            ) : (
              <h2 className="text-white text-xl text-center rounded-md border-2 border-orange-400 font-semibold mb-2 p-4">
                No Orders Found..
              </h2>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default OrdersList;
