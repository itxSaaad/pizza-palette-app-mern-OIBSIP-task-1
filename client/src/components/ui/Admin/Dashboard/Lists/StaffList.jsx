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
import Card from '../../../Card';
import ConfirmDialog from '../../../ConfirmDialog';
import Loader from '../../../Loader';
import Message from '../../../Message';
import Table from '../Table';

function StaffList() {
  const adminUserColumns = [
    '_id',
    'name',
    'email',
    'role',
    'permissions',
    'isApproved',
  ];

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

  useEffect(() => {
    if (!adminUserList) {
      dispatch(listAdminUsers({}));
    }
  }, [dispatch, adminUserList]);

  return (
    <div className="w-full p-4">
      <h2 className="font-display text-h2 text-neutral-900 my-2">All Staff</h2>
      {loading ? (
        <Loader />
      ) : (
        <>
          {(adminUserListError ||
            adminUserDeleteByIdError ||
            adminUserUpdateProfileByIdError) && (
            <Message>
              {adminUserListError ||
                adminUserDeleteByIdError ||
                adminUserUpdateProfileByIdError}
            </Message>
          )}
          {(successMessageDelete || successMessageUpdate) && (
            <Message>{successMessageDelete || successMessageUpdate}</Message>
          )}
          <div className="mt-4">
            {adminUserList.length > 0 ? (
              <Table
                data={adminUserList}
                columns={adminUserColumns}
                handleDelete={handleDeleteRequest}
                handleChange={handleChange}
              />
            ) : (
              <Card className="text-center">
                <p className="text-lg font-semibold text-neutral-800">
                  No Staff Found..
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

export default StaffList;
