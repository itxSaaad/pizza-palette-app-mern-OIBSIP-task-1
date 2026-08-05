import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Import Thunks
import { listInventory, deleteStockById } from '../../../../../redux/asyncThunks/inventoryThunks';

// Import Hooks
import { useEntityListActions } from '../../../../../hooks/useEntityListActions';

// Import Components
import ConfirmDialog from '../../../ConfirmDialog';
import AdminListLayout from '../AdminListLayout';
import GroupedTableSection from '../GroupedTableSection';

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

  // inventoryList starts as [] in Redux (truthy) before the fetch resolves;
  // the real payload is an object keyed by ingredient type, so an array
  // means "not loaded yet" and must not be read as {bases, cheeses, ...}.
  const inventoryLoaded = Boolean(inventoryList) && !Array.isArray(inventoryList);

  const groups = inventoryLoaded
    ? [
        { label: 'All Bases', data: inventoryList.bases },
        { label: 'All Cheeses', data: inventoryList.cheeses },
        { label: 'All Sauces', data: inventoryList.sauces },
        { label: 'All Veggies', data: inventoryList.veggies },
      ]
    : [];

  useEffect(() => {
    if (!inventoryLoaded) {
      dispatch(listInventory({}));
    }
  }, [dispatch, inventoryLoaded]);

  return (
    <>
      <AdminListLayout
        title="All Stocks"
        loading={loading}
        error={inventoryListError || inventoryDeleteByIdError}
        successMessage={successMessageDelete}
        isEmpty={!inventoryLoaded}
        emptyLabel="No Stock Found.."
      >
        <GroupedTableSection
          groups={groups}
          columns={inventoryColumns}
          handleDelete={handleDeleteRequest}
          handleChange={handleChange}
        />
      </AdminListLayout>
      <ConfirmDialog {...confirmDialogProps} />
    </>
  );
}

export default InventoryList;
