import { createSlice } from '@reduxjs/toolkit';

// Import Async Thunks
import {
  loginUser,
  registerUser,
  updateUserProfile,
  getUserDetails,
} from '../asyncThunks/userThunks.js';

// Initial State
const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
  userDetails: localStorage.getItem('userDetails')
    ? JSON.parse(localStorage.getItem('userDetails'))
    : null,
  userLoginError: null,
  userRegisterError: null,
  userDetailsError: null,
  userUpdateProfileError: null,
  userLoginSuccess: false,
  userRegisterSuccess: false,
  userDetailsSuccess: false,
  userUpdateProfileSuccess: false,
  loading: false,
};

// Create Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserData: (state) => {
      state.userLoginError = null;
      state.userRegisterError = null;
      state.userLoginSuccess = false;
      state.userRegisterSuccess = false;
      state.userInfo = null;
      localStorage.removeItem('userInfo');
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
      });
  },
});

// Export Actions
export const { clearUserData } = userSlice.actions;

// Export Reducer
export default userSlice.reducer;
