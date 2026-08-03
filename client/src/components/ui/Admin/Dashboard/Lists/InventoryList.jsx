import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Import Thunks
import {
  listInventory,
  deleteStockById,
} from '../../../../../redux/asyncThunks/inventoryThunks';

// Import Hooks
import { useEntityListActions } from '../../../../../hooks/useEntityListActions';

// Import Components
import Card from '../../../Card';
import ConfirmDialog from '../../../ConfirmDialog';
import Loader from '../../../Loader';
import Message from '../../../Message';
import Table from '../Table';

function InventoryList() {
  const inventoryColumns = ['_id', 'item', 'price', 'threshold', 'quantity'];

  const dispatch = useDispatch();

  const inventory = useSelector((state) => state.inventory);
  const {
    loading,
    inventoryList,
    inventoryListError,
    inventoryDeleteByIdError,
    inventoryDeleteByIdSuccess,
  } = inventory;

  const { handleDeleteRequest, confirmDialogProps } = useEntityListActions({
    deleteThunk: deleteStockById,
    refreshThunk: () => listInventory({}),
    entityName: 'stock item',
  });

  const handleChange = () => {
    // No editable field is currently wired for inventory rows.
  };

  const successMessageDelete = inventoryDeleteByIdSuccess && {
    status: '200',
    message: 'Inventory Item Deleted Successfully!',
  };

  useEffect(() => {
    if (!inventoryList) {
      dispatch(listInventory({}));
    }
  }, [dispatch, inventoryList]);

  return (
    <div className="w-full p-4">
      <h2 className="font-display text-h2 text-neutral-900 my-2">All Stocks</h2>
      {loading ? (
        <Loader />
      ) : (
        <>
          {(inventoryListError || inventoryDeleteByIdError) && (
            <Message>{inventoryListError || inventoryDeleteByIdError}</Message>
          )}
          {successMessageDelete && <Message>{successMessageDelete}</Message>}
          <div className="mt-4">
            {inventoryList ? (
              <>
                <div className="mb-4">
                  <h1 className="text-3xl text-center font-bold border-b-2 border-primary-900 p-1 my-2 text-neutral-900">
                    All Bases
                  </h1>
                  <Table
                    data={inventoryList.bases}
                    columns={inventoryColumns}
                    handleDelete={handleDeleteRequest}
                    handleChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <h1 className="text-3xl text-center font-bold border-b-2 border-primary-900 p-1 my-2 text-neutral-900">
                    All Cheeses
                  </h1>
                  <Table
                    data={inventoryList.cheeses}
                    columns={inventoryColumns}
                    handleDelete={handleDeleteRequest}
                    handleChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <h1 className="text-3xl text-center font-bold border-b-2 border-primary-900 p-1 my-2 text-neutral-900">
                    All Sauces
                  </h1>
                  <Table
                    data={inventoryList.sauces}
                    columns={inventoryColumns}
                    handleDelete={handleDeleteRequest}
                    handleChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <h1 className="text-3xl text-center font-bold border-b-2 border-primary-900 p-1 my-2 text-neutral-900">
                    All Veggies
                  </h1>
                  <Table
                    data={inventoryList.veggies}
                    columns={inventoryColumns}
                    handleDelete={handleDeleteRequest}
                    handleChange={handleChange}
                  />
                </div>
              </>
            ) : (
              <Card className="text-center">
                <p className="text-xl font-semibold text-neutral-800">
                  No Stock Found..
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

export default InventoryList;
