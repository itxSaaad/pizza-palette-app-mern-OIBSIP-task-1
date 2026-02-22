import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { extractErrorMessage } from '../../utils/errorUtils';

// Create THunks

// Order Create
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData, { getState, rejectWithValue }) => {
    try {
      const {
        user: { userInfo },
      } = getState();

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/orders`,
        {
          orderItems: orderData.orderItems,
          deliveryAddress: orderData.deliveryAddress,
          salesTax: orderData.salesTax,
          deliveryCharges: orderData.deliveryCharges,
          totalPrice: orderData.totalPrice,
          payment: orderData.payment,
        },
        config
      );

      return data.data || data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Order List By User Id
export const listOrdersByUserId = createAsyncThunk(
  'order/listOrdersByUserId',
  async (_, { getState, rejectWithValue }) => {
    try {
      const {
        user: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/orders/user`, config);

      return data.data || data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Order List (Admin)
export const listOrders = createAsyncThunk(
  'order/listOrders',
  async (_, { getState, rejectWithValue }) => {
    try {
      const {
        admin: { adminUserInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${adminUserInfo.token}`,
        },
      };

      const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/orders`, config);

      return data.data || data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Order Details By Id (Admin)
export const getOrderById = createAsyncThunk(
  'order/getOrderById',
  async (id, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const userToken = state.user?.userInfo?.token;
      const adminToken = state.admin?.adminUserInfo?.token;
      
      // Use admin token if available, otherwise use user token
      const token = adminToken || userToken;
      
      if (!token) {
        return rejectWithValue({
          message: 'Authentication required. Please log in.',
          code: 'UNAUTHORIZED'
        });
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/orders/${id}`, config);

      return data.data || data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Order Update by Id (Admin)
export const updateOrderById = createAsyncThunk(
  'order/updateOrderById',
  async ({ id, status }, { getState, rejectWithValue }) => {
    try {
      const {
        admin: { adminUserInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${adminUserInfo.token}`,
        },
      };

      const { data } = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/orders/${id}`,
        { status },
        config
      );

      return data.data || data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Order Delete by Id (Admin)
export const deleteOrderById = createAsyncThunk(
  'order/deleteOrderById',
  async (id, { getState, rejectWithValue }) => {
    try {
      const {
        admin: { adminUserInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${adminUserInfo.token}`,
        },
      };

      const { data } = await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/orders/${id}`,
        config
      );

      return data.data || data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Update Order Payment Status (Admin - for COD orders)
export const updateOrderPaymentStatus = createAsyncThunk(
  'order/updatePaymentStatus',
  async ({ orderId, paymentStatus }, { rejectWithValue, getState }) => {
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

      const { data } = await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/orders/${orderId}/payment-status`,
        { paymentStatus },
        config
      );

      return data.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);
