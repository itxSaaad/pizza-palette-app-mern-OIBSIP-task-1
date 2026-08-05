import { createSlice } from '@reduxjs/toolkit';

// Import Async Thunks
import {
  listAdminUsers,
  updateAdminProfile,
  updateAdminUserById,
  deleteAdminUserById,
  getAdminUserDetails,
  getAdminUserDetailsById,
} from '../asyncThunks/adminThunks';
import { login, bootstrapFirstAdmin } from '../asyncThunks/authThunks';
import {
  sendAdminInvite,
  listAdminInvites,
  revokeAdminInvite,
  acceptAdminInvite,
} from '../asyncThunks/inviteThunks';

// Initial State
const initialState = {
  adminUserInfo: localStorage.getItem('adminUserInfo')
    ? JSON.parse(localStorage.getItem('adminUserInfo'))
    : null,
  adminUserDetails: localStorage.getItem('adminUserDetails')
    ? JSON.parse(localStorage.getItem('adminUserDetails'))
    : null,
  adminUserList: [],
  adminUserListsError: null,
  adminUserDetailsError: null,
  adminUserUpdateProfileError: null,
  adminUserDetailsByIdError: null,
  adminUserUpdateProfileByIdError: null,
  adminUserDeleteByIdError: null,
  adminUserListsSuccess: false,
  adminUserDetailsSuccess: false,
  adminUserUpdateProfileSuccess: false,
  adminUserDetailsByIdSuccess: false,
  adminUserUpdateProfileByIdSuccess: false,
  adminUserDeleteByIdSuccess: false,

  // Invites (invite-only admin/manager creation)
  adminInviteList: [],
  adminInviteListError: null,
  adminInviteListSuccess: false,
  adminSendInviteError: null,
  adminSendInviteSuccess: false,
  adminRevokeInviteError: null,
  adminRevokeInviteSuccess: false,

  loading: false,
};

// Create Slice
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminUserData: (state) => {
      localStorage.removeItem('adminUserInfo');
      localStorage.removeItem('adminUserDetails');
      state.adminUserInfo = null;
      state.adminUserDetails = null;
      state.adminUserList = [];
      state.adminUserListsError = null;
      state.adminUserDetailsError = null;
      state.adminUserUpdateProfileError = null;
      state.adminUserDetailsByIdError = null;
      state.adminUserUpdateProfileByIdError = null;
      state.adminUserDeleteByIdError = null;
      state.adminUserListsSuccess = false;
      state.adminUserDetailsSuccess = false;
      state.adminUserUpdateProfileSuccess = false;
      state.adminUserDetailsByIdSuccess = false;
      state.adminUserUpdateProfileByIdSuccess = false;
      state.adminUserDeleteByIdSuccess = false;
      state.adminInviteList = [];
      state.adminInviteListError = null;
      state.adminInviteListSuccess = false;
      state.adminSendInviteError = null;
      state.adminSendInviteSuccess = false;
      state.adminRevokeInviteError = null;
      state.adminRevokeInviteSuccess = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Populate adminUserInfo from any flow that authenticates an admin/manager.
      .addCase(login.fulfilled, (state, action) => {
        if (action.payload.type !== 'admin') return;
        state.adminUserInfo = action.payload;
        localStorage.setItem('adminUserInfo', JSON.stringify(action.payload));
      })
      .addCase(bootstrapFirstAdmin.fulfilled, (state, action) => {
        state.adminUserInfo = action.payload;
        localStorage.setItem('adminUserInfo', JSON.stringify(action.payload));
      })
      .addCase(acceptAdminInvite.fulfilled, (state, action) => {
        state.adminUserInfo = action.payload;
        localStorage.setItem('adminUserInfo', JSON.stringify(action.payload));
      })
      .addCase(listAdminUsers.pending, (state) => {
        state.loading = true;
        state.adminUserListsError = null;
        state.adminUserListsSuccess = false;
      })
      .addCase(listAdminUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.adminUserList = action.payload;
        state.adminUserListsSuccess = true;
      })
      .addCase(listAdminUsers.rejected, (state, action) => {
        state.loading = false;
        state.adminUserListsError = action.payload;
      })
      .addCase(getAdminUserDetails.pending, (state) => {
        state.loading = true;
        state.adminUserDetailsError = null;
        state.adminUserDetailsSuccess = false;
      })
      .addCase(getAdminUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.adminUserDetails = action.payload;
        localStorage.setItem('adminUserDetails', JSON.stringify(action.payload));
        state.adminUserDetailsSuccess = true;
      })
      .addCase(getAdminUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.adminUserDetailsError = action.payload;
      })
      .addCase(updateAdminProfile.pending, (state) => {
        state.loading = true;
        state.adminUserUpdateProfileError = null;
        state.adminUserUpdateProfileSuccess = false;
      })
      .addCase(updateAdminProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.adminUserInfo = action.payload;
        localStorage.setItem('adminUserInfo', JSON.stringify(action.payload));
        localStorage.setItem('adminUserDetails', JSON.stringify(action.payload));
        state.adminUserUpdateProfileSuccess = true;
      })
      .addCase(updateAdminProfile.rejected, (state, action) => {
        state.loading = false;
        state.adminUserUpdateProfileError = action.payload;
      })
      .addCase(getAdminUserDetailsById.pending, (state) => {
        state.loading = true;
        state.adminUserDetailsByIdError = null;
        state.adminUserDetailsByIdSuccess = false;
      })
      .addCase(getAdminUserDetailsById.fulfilled, (state, action) => {
        state.loading = false;
        state.adminUserDetails = action.payload;
        state.adminUserDetailsByIdSuccess = true;
      })

      .addCase(getAdminUserDetailsById.rejected, (state, action) => {
        state.loading = false;
        state.adminUserDetailsByIdError = action.payload;
      })
      .addCase(updateAdminUserById.pending, (state) => {
        state.loading = true;
        state.adminUserUpdateProfileByIdError = null;
        state.adminUserUpdateProfileByIdSuccess = false;
      })
      .addCase(updateAdminUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.adminUserDetails = action.payload;
        state.adminUserUpdateProfileByIdSuccess = true;
      })
      .addCase(updateAdminUserById.rejected, (state, action) => {
        state.loading = false;
        state.adminUserUpdateProfileByIdError = action.payload;
      })
      .addCase(deleteAdminUserById.pending, (state) => {
        state.loading = true;
        state.adminUserDeleteByIdError = null;
        state.adminUserDeleteByIdSuccess = false;
      })
      .addCase(deleteAdminUserById.fulfilled, (state) => {
        state.loading = false;
        state.adminUserDeleteByIdSuccess = true;
      })
      .addCase(deleteAdminUserById.rejected, (state, action) => {
        state.loading = false;
        state.adminUserDeleteByIdError = action.payload;
      })
      .addCase(sendAdminInvite.pending, (state) => {
        state.loading = true;
        state.adminSendInviteError = null;
        state.adminSendInviteSuccess = false;
      })
      .addCase(sendAdminInvite.fulfilled, (state) => {
        state.loading = false;
        state.adminSendInviteSuccess = true;
      })
      .addCase(sendAdminInvite.rejected, (state, action) => {
        state.loading = false;
        state.adminSendInviteError = action.payload;
      })
      .addCase(listAdminInvites.pending, (state) => {
        state.loading = true;
        state.adminInviteListError = null;
        state.adminInviteListSuccess = false;
      })
      .addCase(listAdminInvites.fulfilled, (state, action) => {
        state.loading = false;
        state.adminInviteList = action.payload;
        state.adminInviteListSuccess = true;
      })
      .addCase(listAdminInvites.rejected, (state, action) => {
        state.loading = false;
        state.adminInviteListError = action.payload;
      })
      .addCase(revokeAdminInvite.pending, (state) => {
        state.loading = true;
        state.adminRevokeInviteError = null;
        state.adminRevokeInviteSuccess = false;
      })
      .addCase(revokeAdminInvite.fulfilled, (state, action) => {
        state.loading = false;
        state.adminInviteList = state.adminInviteList.filter(
          (invite) => invite._id !== action.payload
        );
        state.adminRevokeInviteSuccess = true;
      })
      .addCase(revokeAdminInvite.rejected, (state, action) => {
        state.loading = false;
        state.adminRevokeInviteError = action.payload;
      });
  },
});

// Export Actions
export const { clearAdminUserData } = adminSlice.actions;

// Export Reducer
export default adminSlice.reducer;
