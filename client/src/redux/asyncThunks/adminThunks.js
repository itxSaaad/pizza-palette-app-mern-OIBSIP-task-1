import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { extractErrorMessage } from '../../utils/errorUtils';

// Create Thunks
// Login/first-admin-setup live in authThunks.js (shared with customers);
// invite-based admin creation lives in inviteThunks.js.

// Admin Update Profile
export const updateAdminProfile = createAsyncThunk(
  'admin/updateProfile',
  async ({ name, email, password, confirmPassword }, { rejectWithValue, getState }) => {
    try {
      const {
        admin: { adminUserInfo },
      } = getState();

      const config = {
        headers: {
          'Content-Type': 'application/json',

          Authorization: `Bearer ${adminUserInfo.token}`,
        },
      };

      const { data } = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/admin/profile`,
        { name, email, password, confirmPassword },
        config
      );

      return data.data || data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Admin User Details
export const getAdminUserDetails = createAsyncThunk(
  'admin/userDetails',
  async (_, { rejectWithValue, getState }) => {
    try {
      const {
        admin: { adminUserInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${adminUserInfo.token}`,
        },
      };

      const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/admin/profile`, config);

      return data.data || data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Admin List Users
export const listAdminUsers = createAsyncThunk(
  'admin/listUsers',
  async (_, { rejectWithValue, getState }) => {
    try {
      const {
        admin: { adminUserInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${adminUserInfo.token}`,
        },
      };

      const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/admin`, config);

      return data.data || data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Admin USer Details By ID
export const getAdminUserDetailsById = createAsyncThunk(
  'admin/userDetailsById',
  async (id, { rejectWithValue, getState }) => {
    try {
      const {
        admin: { adminUserInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${adminUserInfo.token}`,
        },
      };

      const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/admin/${id}`, config);

      return data.data || data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Admin Update User By ID
export const updateAdminUserById = createAsyncThunk(
  'admin/updateUserById',
  async ({ id, name, email, role, permissions, isApproved }, { rejectWithValue, getState }) => {
    try {
      const {
        admin: { adminUserInfo },
      } = getState();

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminUserInfo.token}`,
        },
      };

      const { data } = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/admin/${id}`,
        { name, email, role, permissions, isApproved },
        config
      );

      return data.data || data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Admin Delete User By ID
export const deleteAdminUserById = createAsyncThunk(
  'admin/deleteUserById',
  async (id, { rejectWithValue, getState }) => {
    try {
      const {
        admin: { adminUserInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${adminUserInfo.token}`,
        },
      };

      const { data } = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/admin/${id}`, config);

      return data.data || data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);
