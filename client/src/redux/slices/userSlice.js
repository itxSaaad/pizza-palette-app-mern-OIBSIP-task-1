import { createSlice } from '@reduxjs/toolkit';

// Import Async Thunks
import { loginUser, registerUser } from '../asyncThunks/userThunks.js';

// Initial State
const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
  userLoginError: null,
  userRegisterError: null,
  userLoginSuccess: false,
  userRegisterSuccess: false,
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
      });
  },
});

// Export Actions
export const { clearUserData } = userSlice.actions;

// Export Reducer
export default userSlice.reducer;
