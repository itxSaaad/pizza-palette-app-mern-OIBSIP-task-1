import { createSlice } from '@reduxjs/toolkit';

// Import Async Thunks
import {
  login,
  forgotPassword,
  resetPassword,
  getSetupStatus,
  bootstrapFirstAdmin,
} from '../asyncThunks/authThunks';
import { acceptAdminInvite } from '../asyncThunks/inviteThunks';

// Holds state for the flows shared across account types: unified login,
// forgot/reset password, first-admin setup, and invite acceptance.
// userSlice/adminSlice separately listen to `login`/`bootstrapFirstAdmin`/
// `acceptAdminInvite` to populate userInfo/adminUserInfo once the account
// type is known from the response.
const initialState = {
  loading: false,
  loginError: null,
  loginSuccess: false,

  forgotPasswordError: null,
  forgotPasswordSuccess: false,
  passwordResetEmail: null,
  passwordResetOTP: null,

  resetPasswordError: null,
  resetPasswordSuccess: false,

  setupStatus: null,
  setupStatusError: null,

  bootstrapError: null,
  bootstrapSuccess: false,

  acceptInviteError: null,
  acceptInviteSuccess: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setPasswordResetEmail: (state, action) => {
      state.passwordResetEmail = action.payload;
    },
    setPasswordResetOTP: (state, action) => {
      state.passwordResetOTP = action.payload;
    },
    clearAuthState: (state) => {
      state.loginError = null;
      state.loginSuccess = false;
      state.forgotPasswordError = null;
      state.forgotPasswordSuccess = false;
      state.passwordResetEmail = null;
      state.passwordResetOTP = null;
      state.resetPasswordError = null;
      state.resetPasswordSuccess = false;
      state.bootstrapError = null;
      state.bootstrapSuccess = false;
      state.acceptInviteError = null;
      state.acceptInviteSuccess = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.loginError = null;
        state.loginSuccess = false;
      })
      .addCase(login.fulfilled, (state) => {
        state.loading = false;
        state.loginSuccess = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.loginError = action.payload;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.forgotPasswordError = null;
        state.forgotPasswordSuccess = false;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.forgotPasswordSuccess = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.forgotPasswordError = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.resetPasswordError = null;
        state.resetPasswordSuccess = false;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.resetPasswordSuccess = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.resetPasswordError = action.payload;
      })
      .addCase(getSetupStatus.pending, (state) => {
        state.loading = true;
        state.setupStatusError = null;
      })
      .addCase(getSetupStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.setupStatus = action.payload;
      })
      .addCase(getSetupStatus.rejected, (state, action) => {
        state.loading = false;
        state.setupStatusError = action.payload;
      })
      .addCase(bootstrapFirstAdmin.pending, (state) => {
        state.loading = true;
        state.bootstrapError = null;
        state.bootstrapSuccess = false;
      })
      .addCase(bootstrapFirstAdmin.fulfilled, (state) => {
        state.loading = false;
        state.bootstrapSuccess = true;
      })
      .addCase(bootstrapFirstAdmin.rejected, (state, action) => {
        state.loading = false;
        state.bootstrapError = action.payload;
      })
      .addCase(acceptAdminInvite.pending, (state) => {
        state.loading = true;
        state.acceptInviteError = null;
        state.acceptInviteSuccess = false;
      })
      .addCase(acceptAdminInvite.fulfilled, (state) => {
        state.loading = false;
        state.acceptInviteSuccess = true;
      })
      .addCase(acceptAdminInvite.rejected, (state, action) => {
        state.loading = false;
        state.acceptInviteError = action.payload;
      });
  },
});

export const { setPasswordResetEmail, setPasswordResetOTP, clearAuthState } = authSlice.actions;

export default authSlice.reducer;
