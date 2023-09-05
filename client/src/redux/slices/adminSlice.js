import { createSlice } from '@reduxjs/toolkit';

// Import Async Thunks
import {
  loginAdmin,
  registerAdmin,
  listAdminUsers,
  updateAdminProfile,
  updateAdminUserById,
  deleteAdminUserById,
  getAdminUserDetails,
  getAdminUserDetailsById,
} from '../asyncThunks/adminThunks';

// Initial State
const initialState = {
  adminUserInfo: localStorage.getItem('adminUserInfo')
    ? JSON.parse(localStorage.getItem('adminUserInfo'))
    : null,
  adminUserDetails: localStorage.getItem('adminUserDetails')
    ? JSON.parse(localStorage.getItem('adminUserDetails'))
    : null,
  adminUserList: [],
  adminUserLoginError: null,
  adminUserRegisterError: null,
  adminUserListsError: null,
  adminUserDetailsError: null,
  adminUserUpdateProfileError: null,
  adminUserDetailsByIdError: null,
  adminUserUpdateProfileByIdError: null,
  adminUserDeleteByIdError: null,
  adminUserLoginSuccess: false,
  adminUserRegisterSuccess: false,
  adminUserListsSuccess: false,
  adminUserDetailsSuccess: false,
  adminUserUpdateProfileSuccess: false,
  adminUserDetailsByIdSuccess: false,
  adminUserUpdateProfileByIdSuccess: false,
  adminUserDeleteByIdSuccess: false,
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
      state.adminUserLoginError = null;
      state.adminUserRegisterError = null;
      state.adminUserListsError = null;
      state.adminUserDetailsError = null;
      state.adminUserUpdateProfileError = null;
      state.adminUserDetailsByIdError = null;
      state.adminUserUpdateProfileByIdError = null;
      state.adminUserDeleteByIdError = null;
      state.adminUserLoginSuccess = false;
      state.adminUserRegisterSuccess = false;
      state.adminUserListsSuccess = false;
      state.adminUserDetailsSuccess = false;
      state.adminUserUpdateProfileSuccess = false;
      state.adminUserDetailsByIdSuccess = false;
      state.adminUserUpdateProfileByIdSuccess = false;
      state.adminUserDeleteByIdSuccess = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.adminUserLoginError = null;
        state.adminUserLoginSuccess = false;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.adminUserInfo = action.payload;
        localStorage.setItem('adminUserInfo', JSON.stringify(action.payload));
        state.adminUserLoginSuccess = true;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.adminUserLoginError = action.payload;
      })
      .addCase(registerAdmin.pending, (state) => {
        state.loading = true;
        state.adminUserRegisterError = null;
        state.adminUserRegisterSuccess = false;
      })
      .addCase(registerAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.adminUserInfo = action.payload;
        localStorage.setItem('adminUserInfo', JSON.stringify(action.payload));
        state.adminUserRegisterSuccess = true;
      })
      .addCase(registerAdmin.rejected, (state, action) => {
        state.loading = false;
        state.adminUserRegisterError = action.payload;
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
        localStorage.setItem(
          'adminUserDetails',
          JSON.stringify(action.payload)
        );
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
        localStorage.setItem(
          'adminUserDetails',
          JSON.stringify(action.payload)
        );
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
      });
  },
});

// Export Actions
export const { clearAdminUserData } = adminSlice.actions;

// Export Reducer
export default adminSlice.reducer;
