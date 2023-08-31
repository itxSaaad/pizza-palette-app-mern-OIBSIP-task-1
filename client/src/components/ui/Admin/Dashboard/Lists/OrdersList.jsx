import { useDispatch, useSelector } from 'react-redux';

// Import Thunks
import {
  deleteOrderById,
  listOrders,
} from '../../../../../redux/asyncThunks/orderThunks';

// Import Components
import Loader from '../../../Loader';
import Message from '../../../Message';
import Table from '../Table';

function OrdersList() {
  const orderColumns = ['_id', 'name', 'price', 'size'];

  const dispatch = useDispatch();

  const order = useSelector((state) => state.order);
  const {
    loading,
    orderList,
    orderListError,
    orderDeleteByIdError,
    orderDeleteByIdSuccess,
  } = order;

  const handleDelete = (id) => {
    dispatch(deleteOrderById(id)).then(() => dispatch(listOrders({})));
  };

  const successMessageDelete = orderDeleteByIdSuccess && {
    status: '200',
    message: 'order Deleted Successfully!',
  };

  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-bold my-2">All Orders</h2>
      {loading ? (
        <Loader />
      ) : (
        <>
          {(orderListError || orderDeleteByIdError) && (
            <Message>{orderListError || orderDeleteByIdError}</Message>
          )}
          {successMessageDelete && <Message>{successMessageDelete}</Message>}
          <div className="mt-4">
            {orderList && orderList.length > 0 ? (
              <Table
                data={orderList}
                columns={orderColumns}
                handleDelete={handleDelete}
              />
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
