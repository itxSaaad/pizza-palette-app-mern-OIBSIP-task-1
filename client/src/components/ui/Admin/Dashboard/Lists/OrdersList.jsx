import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

// Import Constants
import { ORDER_STATUS } from '../../../../../constants';

// Import Thunks
import {
  deleteOrderById,
  listOrders,
  updateOrderById,
  updateOrderPaymentStatus,
} from '../../../../../redux/asyncThunks/orderThunks';

// Import Hooks
import { useEntityListActions } from '../../../../../hooks/useEntityListActions';

// Import Components
import Card from '../../../Card';
import ConfirmDialog from '../../../ConfirmDialog';
import Loader from '../../../Loader';
import Message from '../../../Message';
import Table from '../Table';

function OrdersList() {
  const orderColumns = [
    '_id',
    'user',
    'status',
    'paymentStatus',
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

  const { handleDeleteRequest, confirmDialogProps } = useEntityListActions({
    deleteThunk: deleteOrderById,
    refreshThunk: () => listOrders({}),
    entityName: 'order',
  });

  const ordersReceived =
    orderList && orderList.filter((order) => order.status === ORDER_STATUS.RECEIVED);
  const ordersInTheKitchen =
    orderList && orderList.filter((order) => order.status === ORDER_STATUS.IN_KITCHEN);
  const ordersSentForDelivery =
    orderList &&
    orderList.filter((order) => order.status === ORDER_STATUS.OUT_FOR_DELIVERY);
  const ordersDelivered =
    orderList && orderList.filter((order) => order.status === ORDER_STATUS.DELIVERED);

  const successMessageDelete = orderDeleteByIdSuccess && {
    status: '200',
    message: 'Order Deleted Successfully!',
  };

  const handleUpdate = (id, selectedValue, updateType = 'status') => {
    if (updateType === 'payment') {
      dispatch(
        updateOrderPaymentStatus({ orderId: id, paymentStatus: selectedValue })
      ).then(() => dispatch(listOrders({})));
    } else {
      dispatch(updateOrderById({ id, status: selectedValue })).then(() =>
        dispatch(listOrders({}))
      );
    }
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
      <h2 className="font-display text-h2 text-neutral-900 my-2">All Orders</h2>
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
                    <h1 className="text-3xl text-center font-bold border-b-2 border-primary-900 p-1 my-2 text-neutral-900">
                      Received Orders
                    </h1>
                    <Table
                      data={ordersReceived}
                      columns={orderColumns}
                      handleDelete={handleDeleteRequest}
                      handleChange={handleUpdate}
                    />
                  </div>
                ) : (
                  <Card className="text-center mb-4">
                    <p className="text-lg font-semibold text-neutral-800">
                      No Orders Received Yet..
                    </p>
                  </Card>
                )}
                {ordersInTheKitchen.length > 0 ? (
                  <div className="mb-4">
                    <h1 className="text-3xl text-center font-bold border-b-2 border-primary-900 p-1 my-2 text-neutral-900">
                      Orders In The Kitchen
                    </h1>
                    <Table
                      data={ordersInTheKitchen}
                      columns={orderColumns}
                      handleDelete={handleDeleteRequest}
                      handleChange={handleUpdate}
                    />
                  </div>
                ) : (
                  <Card className="text-center mb-4">
                    <p className="text-lg font-semibold text-neutral-800">
                      No Orders In The Kitchen..
                    </p>
                  </Card>
                )}
                {ordersSentForDelivery.length > 0 ? (
                  <div className="mb-4">
                    <h1 className="text-3xl text-center font-bold border-b-2 border-primary-900 p-1 my-2 text-neutral-900">
                      Orders Sent For Delivery
                    </h1>
                    <Table
                      data={ordersSentForDelivery}
                      columns={orderColumns}
                      handleDelete={handleDeleteRequest}
                      handleChange={handleUpdate}
                    />
                  </div>
                ) : (
                  <Card className="text-center mb-4">
                    <p className="text-lg font-semibold text-neutral-800">
                      No Orders Sent For Delivery..
                    </p>
                  </Card>
                )}
                {ordersDelivered.length > 0 ? (
                  <div className="mb-4">
                    <h1 className="text-3xl text-center font-bold border-b-2 border-primary-900 p-1 my-2 text-neutral-900">
                      Orders Delivered
                    </h1>
                    <Table
                      data={ordersDelivered}
                      columns={orderColumns}
                      handleDelete={handleDeleteRequest}
                      handleChange={handleUpdate}
                    />
                  </div>
                ) : (
                  <Card className="text-center mb-4">
                    <p className="text-lg font-semibold text-neutral-800">
                      No Orders Delivered..
                    </p>
                  </Card>
                )}
              </>
            ) : (
              <Card className="text-center">
                <p className="text-lg font-semibold text-neutral-800">
                  No Orders Found..
                </p>
              </Card>
            )}
          </div>
        </>
      )}
      <ConfirmDialog {...confirmDialogProps} />
    </div>
  );
}

export default OrdersList;
