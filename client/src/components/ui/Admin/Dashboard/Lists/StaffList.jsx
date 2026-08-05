import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Import Thunks
import {
  deleteAdminUserById,
  listAdminUsers,
  updateAdminUserById,
} from '../../../../../redux/asyncThunks/adminThunks';

// Import Hooks
import { useEntityListActions } from '../../../../../hooks/useEntityListActions';

// Import Components
import ConfirmDialog from '../../../ConfirmDialog';
import AdminListLayout from '../AdminListLayout';
import Table from '../Table';

function StaffList() {
  const adminUserColumns = ['_id', 'name', 'email', 'role', 'permissions', 'isApproved'];

  const dispatch = useDispatch();

  const admin = useSelector((state) => state.admin);
  const {
    loading,
    adminUserList,
    adminUserListError,
    adminUserDeleteByIdError,
    adminUserUpdateProfileByIdError,
    adminUserUpdateProfileByIdSuccess,
    adminUserDeleteByIdSuccess,
  } = admin;

  const { handleDeleteRequest, confirmDialogProps } = useEntityListActions({
    deleteThunk: deleteAdminUserById,
    refreshThunk: () => listAdminUsers({}),
    entityName: 'staff member',
  });

  const handleChange = (id) => {
    const targetUser = adminUserList.find((user) => user._id === id);
    dispatch(
      updateAdminUserById({
        id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
        permissions: targetUser.permissions,
        isApproved: !targetUser.isApproved,
      })
    ).then(() => dispatch(listAdminUsers({})));
  };

  const successMessageUpdate = adminUserUpdateProfileByIdSuccess && {
    status: '200',
    message: 'User Updated Successfully!',
  };

  const successMessageDelete = adminUserDeleteByIdSuccess && {
    status: '200',
    message: 'User Deleted Successfully!',
  };

  const columnRenderers = {
    isApproved: (row, onChange) => (
      <input
        type="checkbox"
        className="w-5 h-5 accent-primary-500"
        checked={row.isApproved}
        onChange={() => onChange(row._id)}
      />
    ),
  };

  useEffect(() => {
    if (!adminUserList) {
      dispatch(listAdminUsers({}));
    }
  }, [dispatch, adminUserList]);

  return (
    <>
      <AdminListLayout
        title="All Staff"
        loading={loading}
        error={adminUserListError || adminUserDeleteByIdError || adminUserUpdateProfileByIdError}
        successMessage={successMessageDelete || successMessageUpdate}
        isEmpty={adminUserList.length === 0}
        emptyLabel="No Staff Found.."
      >
        <Table
          data={adminUserList}
          columns={adminUserColumns}
          handleDelete={handleDeleteRequest}
          handleChange={handleChange}
          columnRenderers={columnRenderers}
        />
      </AdminListLayout>
      <ConfirmDialog {...confirmDialogProps} />
    </>
  );
}

export default StaffList;
