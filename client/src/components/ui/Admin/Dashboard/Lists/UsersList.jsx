import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Import Thunks
import {
  deleteUserById,
  listUsers,
} from '../../../../../redux/asyncThunks/userThunks';

// Import Components
import Loader from '../../../Loader';
import Message from '../../../Message';
import Table from '../Table';

function UsersList() {
  const userColumns = ['_id', 'name', 'email', 'numberOfOrders', 'isVerified'];

  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const {
    loading,
    userList,
    userListError,
    userDeleteByIdError,
    userDeleteByIdSuccess,
  } = user;

  const handleDelete = (id) => {
    dispatch(deleteUserById(id)).then(() => dispatch(listUsers({})));
  };

  const successMessageDelete = userDeleteByIdSuccess && {
    status: '200',
    message: 'User Deleted Successfully!',
  };

  useEffect(() => {
    if (!userList) {
      dispatch(listUsers({}));
    }
  }, [dispatch, userList]);

  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-bold my-2">All Users</h2>
      {loading ? (
        <Loader />
      ) : (
        <>
          {(userListError || userDeleteByIdError) && (
            <Message>{userListError || userDeleteByIdError}</Message>
          )}
          {successMessageDelete && <Message>{successMessageDelete}</Message>}
          <div className="mt-4">
            {userList.length > 0 ? (
              <Table
                data={userList}
                columns={userColumns}
                handleDelete={handleDelete}
              />
            ) : (
              <h2 className="text-white text-xl text-center rounded-md border-2 border-orange-400 font-semibold mb-2 p-4">
                No Users Found..
              </h2>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default UsersList;
