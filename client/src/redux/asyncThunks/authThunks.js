import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { extractErrorMessage } from '../../utils/errorUtils';

// Single login entry point for both customers and admin/manager accounts.
// The response includes `type: 'user' | 'admin'`, which userSlice/adminSlice
// use to decide whether the payload belongs to them.
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };

      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/auth/login`,
        { email, password },
        config
      );

      return data.data || data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Forgot Password (customer or admin/manager)
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async ({ email }, { rejectWithValue }) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };

      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/auth/forgotpassword`,
        { email },
        config
      );

      return data.data || data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Reset Password (customer or admin/manager)
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ email, resetToken, newPassword, confirmNewPassword }, { rejectWithValue }) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };

      const { data } = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/auth/resetpassword`,
        { email, resetToken, newPassword, confirmNewPassword },
        config
      );

      return data.data || data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Reports whether any admin account exists yet, driving the one-time setup wizard.
export const getSetupStatus = createAsyncThunk(
  'auth/getSetupStatus',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/admin/setup-status`);

      return data.data || data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Create the very first admin account. Only succeeds while no admin exists yet.
export const bootstrapFirstAdmin = createAsyncThunk(
  'auth/bootstrapFirstAdmin',
  async ({ name, email, password, confirmPassword }, { rejectWithValue }) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };

      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/admin/setup`,
        { name, email, password, confirmPassword },
        config
      );

      return data.data || data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);
