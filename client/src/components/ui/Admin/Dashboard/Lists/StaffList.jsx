import { useDispatch, useSelector } from 'react-redux';

import Loader from '../../../Loader';
import Message from '../../../Message';
import Table from '../Table';

// import {
//   deleteUser,
//   listUsers,
//   updateProfileByAdmin,
// } from '../../../redux/thunks/userThunks';

function StaffList() {
  const userColumns = [
    '_id',
    'name',
    'email',
    'role',
    'permissions',
    'isApproved',
  ];

  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const {
    loading,
    adminUserList,
    adminUserListError,
    adminUserDeleteError,
    // adminUpdateProfileToIsApprovedError,
    adminUserDeleteSuccess,
    // adminUpdateProfileToIsApprovedSuccess,
  } = user;

  const handleDelete = (id) => {
    // dispatch(deleteUser(id)).then(() => dispatch(listUsers({})));
  };

  // const successMessageUpdate = adminUpdateProfileToIsApprovedSuccess && {
  //   status: '200',
  //   message: 'User Updated Successfully!',
  // };

  const successMessageDelete = adminUserDeleteSuccess && {
    status: '200',
    message: 'User Deleted Successfully!',
  };

  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-bold my-2">All Staff</h2>
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* {(adminUserListError ||
            adminUpdateProfileToIsApprovedError ||
            adminUserDeleteError) && (
            <Message>
              {adminUserListError ||
                adminUpdateProfileToIsApprovedError ||
                adminUserDeleteError}
            </Message>
          )} */}
          {/* {(successMessageUpdate || successMessageDelete) && (
            <Message>{successMessageUpdate || successMessageDelete}</Message>
          )} */}
          <div className="mt-4">
            {adminUserList.length > 0 ? (
              <Table
                data={adminUserList}
                columns={userColumns}
                handleDelete={handleDelete}
              />
            ) : (
              <h2 className="text-white text-xl text-center rounded-md border-2 border-orange-400 font-semibold mb-2 p-4 hidden md:block">
                No Users Found..
              </h2>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default StaffList;
