import { createSlice } from '@reduxjs/toolkit';

// Import Async Thunks
import {
  deleteUserById,
  forgotPassword,
  getUserDetails,
  getUserDetailsById,
  listUsers,
  loginUser,
  registerUser,
  resetPassword,
  updateUserProfile,
  updateUserProfileById,
  verifyEmail,
} from '../asyncThunks/userThunks.js';

// Initial State
const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
  userDetails: localStorage.getItem('userDetails')
    ? JSON.parse(localStorage.getItem('userDetails'))
    : null,
  userList: [],
  userLoginError: null,
  userRegisterError: null,
  userDetailsError: null,
  userUpdateProfileError: null,
  userListError: null,
  userVerifyEmailError: null,
  userForgotPasswordError: null,
  userPasswordResetEmail: null,
  userPasswordResetOTP: null,
  userResetPasswordError: null,
  userDetailsByIdError: null,
  userUpdateProfileByIdError: null,
  userDeleteByIdError: null,
  userLoginSuccess: false,
  userRegisterSuccess: false,
  userDetailsSuccess: false,
  userUpdateProfileSuccess: false,
  userListSuccess: false,
  userVerifyEmailSuccess: false,
  userForgotPasswordSuccess: false,
  userResetPasswordSuccess: false,
  userDetailsByIdSuccess: false,
  userUpdateProfileByIdSuccess: false,
  userDeleteByIdSuccess: false,
  loading: false,
};

// Create Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setPasswordResetEmail: (state, action) => {
      state.userPasswordResetEmail = action.payload;
    },
    setPasswordResetOTP: (state, action) => {
      state.userPasswordResetOTP = action.payload;
    },
    clearUserData: (state) => {
      localStorage.removeItem('userInfo');
      localStorage.removeItem('userDetails');
      state.userInfo = null;
      state.userDetails = null;
      state.userList = [];
      state.userPasswordResetEmail = null;
      state.userLoginError = null;
      state.userRegisterError = null;
      state.userDetailsError = null;
      state.userUpdateProfileError = null;
      state.userListError = null;
      state.userVerifyEmailError = null;
      state.userForgotPasswordError = null;
      state.userResetPasswordError = null;
      state.userDetailsByIdError = null;
      state.userUpdateProfileByIdError = null;
      state.userDeleteByIdError = null;
      state.userLoginSuccess = false;
      state.userRegisterSuccess = false;
      state.userDetailsSuccess = false;
      state.userUpdateProfileSuccess = false;
      state.userListSuccess = false;
      state.userVerifyEmailSuccess = false;
      state.userForgotPasswordSuccess = false;
      state.userResetPasswordSuccess = false;
      state.userDetailsByIdSuccess = false;
      state.userUpdateProfileByIdSuccess = false;
      state.userDeleteByIdSuccess = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.userLoginError = null;
        state.userLoginSuccess = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        localStorage.setItem('userInfo', JSON.stringify(action.payload));
        state.userLoginSuccess = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.userLoginError = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.userRegisterError = null;
        state.userRegisterSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        localStorage.setItem('userInfo', JSON.stringify(action.payload));
        state.userRegisterSuccess = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.userRegisterError = action.payload;
      })
      .addCase(getUserDetails.pending, (state) => {
        state.loading = true;
        state.userDetailsError = null;
        state.userDetailsSuccess = false;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.userDetails = action.payload;
        localStorage.setItem('userDetails', JSON.stringify(action.payload));
        state.userDetailsSuccess = true;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.userDetailsError = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.userUpdateProfileError = null;
        state.userUpdateProfileSuccess = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        localStorage.setItem('userInfo', JSON.stringify(action.payload));
        localStorage.setItem('userDetails', JSON.stringify(action.payload));
        state.userUpdateProfileSuccess = true;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.userUpdateProfileError = action.payload;
      })
      .addCase(listUsers.pending, (state) => {
        state.loading = true;
        state.userListError = null;
        state.userListSuccess = false;
      })
      .addCase(listUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.userList = action.payload;
        state.userListSuccess = true;
      })

      .addCase(listUsers.rejected, (state, action) => {
        state.loading = false;
        state.userListError = action.payload;
      })
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.userVerifyEmailError = null;
        state.userVerifyEmailSuccess = false;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.loading = false;
        state.userVerifyEmailSuccess = true;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.userVerifyEmailError = action.payload;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.userForgotPasswordError = null;
        state.userForgotPasswordSuccess = false;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.userForgotPasswordSuccess = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.userForgotPasswordError = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.userResetPasswordError = null;
        state.userResetPasswordSuccess = false;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.userResetPasswordSuccess = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.userResetPasswordError = action.payload;
      })
      .addCase(getUserDetailsById.pending, (state) => {
        state.loading = true;
        state.userDetailsByIdError = null;
        state.userDetailsByIdSuccess = false;
      })
      .addCase(getUserDetailsById.fulfilled, (state, action) => {
        state.loading = false;
        state.userDetails = action.payload;
        localStorage.setItem('userDetails', JSON.stringify(action.payload));
        state.userDetailsByIdSuccess = true;
      })
      .addCase(getUserDetailsById.rejected, (state, action) => {
        state.loading = false;
        state.userDetailsByIdError = action.payload;
      })
      .addCase(updateUserProfileById.pending, (state) => {
        state.loading = true;
        state.userUpdateProfileByIdError = null;
        state.userUpdateProfileByIdSuccess = false;
      })
      .addCase(updateUserProfileById.fulfilled, (state) => {
        state.loading = false;
        state.userUpdateProfileByIdSuccess = true;
      })
      .addCase(updateUserProfileById.rejected, (state, action) => {
        state.loading = false;
        state.userUpdateProfileByIdError = action.payload;
      })
      .addCase(deleteUserById.pending, (state) => {
        state.loading = true;
        state.userDeleteByIdError = null;
        state.userDeleteByIdSuccess = false;
      })
      .addCase(deleteUserById.fulfilled, (state) => {
        state.loading = false;
        state.userDeleteByIdSuccess = true;
      })
      .addCase(deleteUserById.rejected, (state, action) => {
        state.loading = false;
        state.userDeleteByIdError = action.payload;
      });
  },
});

// Export Actions
export const { clearUserData, setPasswordResetEmail, setPasswordResetOTP } =
  userSlice.actions;

// Export Reducer
export default userSlice.reducer;
