import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Import Thunks
import {
  deleteAdminUserById,
  listAdminUsers,
} from '../../../../../redux/asyncThunks/adminThunks';

// Import Components
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

  const handleDelete = (id) => {
    dispatch(deleteAdminUserById(id)).then(() => dispatch(listAdminUsers({})));
  };

  const handleChange = (id) => {
    dispatch(
      listAdminUsers({
        id,
        isApproved: !adminUserList.find((user) => user._id === id).isApproved,
      })
    );
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
      <h2 className="text-2xl font-bold my-2">All Staff</h2>
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
          {successMessageDelete ||
            (successMessageUpdate && (
              <Message>{successMessageDelete || successMessageUpdate}</Message>
            ))}
          <div className="mt-4">
            {adminUserList.length > 0 ? (
              <Table
                data={adminUserList}
                columns={adminUserColumns}
                handleDelete={handleDelete}
                handleChange={handleChange}
              />
            ) : (
              <h2 className="text-white text-xl text-center rounded-md border-2 border-orange-400 font-semibold mb-2 p-4">
                No Staff Found..
              </h2>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default StaffList;
