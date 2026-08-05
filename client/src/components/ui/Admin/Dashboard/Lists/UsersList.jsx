import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Import Thunks
import { deleteUserById, listUsers } from '../../../../../redux/asyncThunks/userThunks';

// Import Hooks
import { useEntityListActions } from '../../../../../hooks/useEntityListActions';

// Import Components
import ConfirmDialog from '../../../ConfirmDialog';
import AdminListLayout from '../AdminListLayout';
import Table from '../Table';

function UsersList() {
  const userColumns = ['_id', 'name', 'email', 'numberOfOrders', 'isVerified'];

  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const { loading, userList, userListError, userDeleteByIdError, userDeleteByIdSuccess } = user;

  const { handleDeleteRequest, confirmDialogProps } = useEntityListActions({
    deleteThunk: deleteUserById,
    refreshThunk: () => listUsers({}),
    entityName: 'user',
  });

  const successMessageDelete = userDeleteByIdSuccess && {
    status: '200',
    message: 'User Deleted Successfully!',
  };

  const columnRenderers = {
    numberOfOrders: (row) => row.orders.length,
    isVerified: (row) => (row.isVerified ? 'Verified' : 'Not Verified'),
  };

  useEffect(() => {
    if (!userList) {
      dispatch(listUsers({}));
    }
  }, [dispatch, userList]);

  return (
    <>
      <AdminListLayout
        title="All Users"
        loading={loading}
        error={userListError || userDeleteByIdError}
        successMessage={successMessageDelete}
        isEmpty={userList.length === 0}
        emptyLabel="No Users Found.."
      >
        <Table
          data={userList}
          columns={userColumns}
          handleDelete={handleDeleteRequest}
          columnRenderers={columnRenderers}
        />
      </AdminListLayout>
      <ConfirmDialog {...confirmDialogProps} />
    </>
  );
}

export default UsersList;
