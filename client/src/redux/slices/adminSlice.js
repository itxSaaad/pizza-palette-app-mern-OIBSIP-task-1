import { createSlice } from '@reduxjs/toolkit';

// Import Async Thunks
import { loginAdmin, registerAdmin } from '../asyncThunks/adminThunks';

// Initial State
const initialState = {
  adminUserInfo: localStorage.getItem('adminUserInfo')
    ? JSON.parse(localStorage.getItem('adminUserInfo'))
    : null,
  adminUserLoginError: null,
  adminUserRegisterError: null,
  adminUserLoginSuccess: false,
  adminUserRegisterSuccess: false,
  loading: false,
};

// Create Slice
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminUserData: (state) => {
      localStorage.removeItem('adminUserInfo');
      state.adminUserInfo = null;
      state.adminUserLoginError = null;
      state.adminUserRegisterError = null;
      state.adminUserLoginSuccess = false;
      state.adminUserRegisterSuccess = false;
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
      });
  },
});

// Export Actions
export const { clearAdminUserData } = adminSlice.actions;

// Export Reducer
export default adminSlice.reducer;
