import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Import Thunks
import {
  listAdminInvites,
  sendAdminInvite,
  revokeAdminInvite,
} from '../../../../../redux/asyncThunks/inviteThunks';

// Import Hooks
import { useEntityListActions } from '../../../../../hooks/useEntityListActions';

// Import Constants
import { USER_ROLES } from '../../../../../constants';

// Import Components
import Button from '../../../Button';
import Card from '../../../Card';
import ConfirmDialog from '../../../ConfirmDialog';
import Input from '../../../Input';
import Loader from '../../../Loader';
import Message from '../../../Message';
import Table from '../Table';

const inviteColumns = ['email', 'role', 'invitedBy', 'expiresAt'];

function InvitesList() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(USER_ROLES.MANAGER);

  const dispatch = useDispatch();

  const {
    loading,
    adminInviteList,
    adminInviteListError,
    adminSendInviteError,
    adminSendInviteSuccess,
    adminRevokeInviteError,
    adminRevokeInviteSuccess,
  } = useSelector((state) => state.admin);

  const { handleDeleteRequest, confirmDialogProps } = useEntityListActions({
    deleteThunk: revokeAdminInvite,
    refreshThunk: () => listAdminInvites(),
    entityName: 'invite',
  });

  useEffect(() => {
    dispatch(listAdminInvites());
  }, [dispatch]);

  const handleSendInvite = (e) => {
    e.preventDefault();
    dispatch(sendAdminInvite({ email, role })).then(() => {
      setEmail('');
      dispatch(listAdminInvites());
    });
  };

  const successMessage = adminSendInviteSuccess && {
    status: '201',
    message: 'Invite sent successfully!',
  };

  const revokedMessage = adminRevokeInviteSuccess && {
    status: '200',
    message: 'Invite revoked successfully!',
  };

  return (
    <div className="w-full p-4">
      <h2 className="font-display text-h2 text-neutral-900 my-2">Admin Invites</h2>

      <Card className="mb-4">
        <form onSubmit={handleSendInvite} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <Input
              name="email"
              type="email"
              value={email}
              placeholder="Enter email to invite"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <select
            className="bg-primary-700 text-primary-50 rounded-control p-2 min-h-[44px]"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value={USER_ROLES.MANAGER}>Manager</option>
            <option value={USER_ROLES.ADMIN}>Admin</option>
          </select>
          <Button type="submit" variant="primary" className="rounded-control">
            Send Invite
          </Button>
        </form>
      </Card>

      {loading ? (
        <Loader />
      ) : (
        <>
          {(adminInviteListError || adminSendInviteError || adminRevokeInviteError) && (
            <Message>
              {adminInviteListError || adminSendInviteError || adminRevokeInviteError}
            </Message>
          )}
          {(successMessage || revokedMessage) && (
            <Message>{successMessage || revokedMessage}</Message>
          )}
          <div className="mt-4">
            {adminInviteList.length > 0 ? (
              <Table
                data={adminInviteList}
                columns={inviteColumns}
                handleDelete={handleDeleteRequest}
              />
            ) : (
              <Card className="text-center">
                <p className="text-lg font-semibold text-neutral-800">No Pending Invites</p>
              </Card>
            )}
          </div>
        </>
      )}
      <ConfirmDialog {...confirmDialogProps} />
    </div>
  );
}

export default InvitesList;
