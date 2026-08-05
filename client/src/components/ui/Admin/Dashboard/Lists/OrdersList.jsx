import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

// Import Constants
import { ORDER_STATUS, PAYMENT_STATUS } from '../../../../../constants';

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
import ConfirmDialog from '../../../ConfirmDialog';
import AdminListLayout from '../AdminListLayout';
import GroupedTableSection from '../GroupedTableSection';

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

  const groups = [
    {
      label: 'Received Orders',
      data: orderList ? orderList.filter((o) => o.status === ORDER_STATUS.RECEIVED) : [],
      emptyLabel: 'No Orders Received Yet..',
    },
    {
      label: 'Orders In The Kitchen',
      data: orderList ? orderList.filter((o) => o.status === ORDER_STATUS.IN_KITCHEN) : [],
      emptyLabel: 'No Orders In The Kitchen..',
    },
    {
      label: 'Orders Sent For Delivery',
      data: orderList ? orderList.filter((o) => o.status === ORDER_STATUS.OUT_FOR_DELIVERY) : [],
      emptyLabel: 'No Orders Sent For Delivery..',
    },
    {
      label: 'Orders Delivered',
      data: orderList ? orderList.filter((o) => o.status === ORDER_STATUS.DELIVERED) : [],
      emptyLabel: 'No Orders Delivered..',
    },
  ];

  const successMessageDelete = orderDeleteByIdSuccess && {
    status: '200',
    message: 'Order Deleted Successfully!',
  };

  const handleUpdate = (id, selectedValue, updateType = 'status') => {
    if (updateType === 'payment') {
      dispatch(updateOrderPaymentStatus({ orderId: id, paymentStatus: selectedValue })).then(() =>
        dispatch(listOrders({}))
      );
    } else {
      dispatch(updateOrderById({ id, status: selectedValue })).then(() => dispatch(listOrders({})));
    }
  };

  const successMessageUpdate = orderUpdateByIdSuccess && {
    status: '200',
    message: 'Order Updated Successfully!',
  };

  const columnRenderers = {
    status: (row, onChange) => (
      <select
        className="bg-primary-700 text-primary-50 rounded-control p-2 min-h-[44px]"
        value={row.status}
        onChange={(e) => onChange(row._id, e.target.value)}
      >
        <option value={ORDER_STATUS.RECEIVED}>{ORDER_STATUS.RECEIVED}</option>
        <option value={ORDER_STATUS.IN_KITCHEN}>{ORDER_STATUS.IN_KITCHEN}</option>
        <option value={ORDER_STATUS.OUT_FOR_DELIVERY}>{ORDER_STATUS.OUT_FOR_DELIVERY}</option>
        <option value={ORDER_STATUS.DELIVERED}>{ORDER_STATUS.DELIVERED}</option>
      </select>
    ),
    paymentStatus: (row, onChange) => (
      <div className="flex flex-col items-center">
        <select
          className="bg-primary-700 text-primary-50 rounded-control p-2 min-h-[44px]"
          value={row.payment?.status}
          onChange={(e) => onChange(row._id, e.target.value, 'payment')}
          disabled={row.payment?.method !== 'cod'}
        >
          <option value={PAYMENT_STATUS.PENDING}>Pending</option>
          <option value={PAYMENT_STATUS.PAID}>Paid</option>
          <option value={PAYMENT_STATUS.FAILED}>Failed</option>
        </select>
        {row.payment?.method !== 'cod' && (
          <span className="text-xs text-primary-200 block mt-1">(Only COD editable)</span>
        )}
      </div>
    ),
    orderItems: (row) => (
      <table className="bg-primary-700 w-full table-auto border-collapse border-2 border-primary-700 rounded-control text-center overflow-hidden">
        <thead>
          <tr>
            <th>Pizza</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {row.orderItems.map((item) => (
            <tr key={item._id}>
              <td className="border border-primary-500 px-4 py-2 sm:px-2 sm:py-1">
                {typeof item.pizza === 'object'
                  ? item.pizza?.name || item.pizza?._id || '—'
                  : item.pizza}
              </td>
              <td className="border border-primary-500 px-4 py-2 sm:px-2 sm:py-1">{item.qty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ),
  };

  useEffect(() => {
    if (!orderList) {
      dispatch(listOrders({}));
    }
  }, [dispatch, orderList]);

  return (
    <>
      <AdminListLayout
        title="All Orders"
        loading={loading}
        error={orderListError || orderDeleteByIdError || orderUpdateByIdError}
        successMessage={successMessageDelete || successMessageUpdate}
        isEmpty={!orderList || orderList.length === 0}
        emptyLabel="No Orders Found.."
      >
        <GroupedTableSection
          groups={groups}
          columns={orderColumns}
          handleDelete={handleDeleteRequest}
          handleChange={handleUpdate}
          columnRenderers={columnRenderers}
        />
      </AdminListLayout>
      <ConfirmDialog {...confirmDialogProps} />
    </>
  );
}

export default OrdersList;
