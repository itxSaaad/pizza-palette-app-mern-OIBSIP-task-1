import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { extractErrorMessage } from '../../utils/errorUtils';

// Send an admin/manager invite (admin role only)
export const sendAdminInvite = createAsyncThunk(
  'invite/send',
  async ({ email, role }, { rejectWithValue, getState }) => {
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

      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/admin/invites`,
        { email, role },
        config
      );

      return data.data || data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// List pending invites
export const listAdminInvites = createAsyncThunk(
  'invite/list',
  async (_, { rejectWithValue, getState }) => {
    try {
      const {
        admin: { adminUserInfo },
      } = getState();

      const config = {
        headers: { Authorization: `Bearer ${adminUserInfo.token}` },
      };

      const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/admin/invites`, config);

      return data.data || data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Revoke a pending invite
export const revokeAdminInvite = createAsyncThunk(
  'invite/revoke',
  async (id, { rejectWithValue, getState }) => {
    try {
      const {
        admin: { adminUserInfo },
      } = getState();

      const config = {
        headers: { Authorization: `Bearer ${adminUserInfo.token}` },
      };

      await axios.delete(`${import.meta.env.VITE_SERVER_URL}/admin/invites/${id}`, config);

      return id;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Accept an invite and create the admin/manager account (public)
export const acceptAdminInvite = createAsyncThunk(
  'invite/accept',
  async ({ token, name, password, confirmPassword }, { rejectWithValue }) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };

      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/admin/invites/accept`,
        { token, name, password, confirmPassword },
        config
      );

      return data.data || data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);
