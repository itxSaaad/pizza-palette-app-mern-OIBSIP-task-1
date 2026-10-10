import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { extractErrorMessage } from '../../utils/errorUtils';

// Create Async Thunks

// Create Pizza
export const createPizza = createAsyncThunk(
  'pizza/createPizza',
  async (pizzaData, { rejectWithValue, getState }) => {
    try {
      const {
        admin: { adminUserInfo },
        user: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${adminUserInfo ? adminUserInfo.token : userInfo.token}`,
        },
      };

      const endpoint = adminUserInfo ? '/pizzas/admin' : '/pizzas';

      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}${endpoint}`,
        {
          name: pizzaData.name,
          description: pizzaData.description,
          bases: pizzaData.bases,
          sauces: pizzaData.sauces,
          cheeses: pizzaData.cheeses,
          veggies: pizzaData.veggies,
          price: pizzaData.price,
          size: pizzaData.size,
          imageUrl: pizzaData.imageUrl,
        },
        config
      );

      return data.data || data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Fetch All Pizzas
export const listPizzas = createAsyncThunk('pizza/listPizzas', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/pizzas`);

    return data.data || data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

// Fetch only the public menu catalog. Filtering happens on the API before
// pagination so user-created custom pizzas cannot push menu items onto a page
// the public screens never request.
export const listMenuPizzas = createAsyncThunk(
  'pizza/listMenuPizzas',
  async ({ page = 1, limit = 12, minPrice, maxPrice, sortBy, sortOrder } = {}, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/pizzas`, {
        params: { createdBy: 'admin', page, limit, minPrice, maxPrice, sortBy, sortOrder },
      });

      return {
        items: Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [],
        pagination: data.pagination || { page, limit, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false },
        query: { page, limit, minPrice, maxPrice, sortBy, sortOrder },
      };
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Fetch Single Pizza
export const getPizzaById = createAsyncThunk(
  'pizza/getPizzaById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/pizzas/${id}`);

      return data.data || data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Update Pizza By Id
export const updatePizzaById = createAsyncThunk(
  'pizza/updatePizzaById',
  async (
    { id, name, description, base, sauces, cheeses, veggies, price, size, imageUrl },
    { rejectWithValue, getState }
  ) => {
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
        `${import.meta.env.VITE_SERVER_URL}/pizzas/${id}`,
        {
          name,
          description,
          base,
          sauces,
          cheeses,
          veggies,
          price,
          size,
          imageUrl,
        },
        config
      );

      return data.data || data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Delete Pizza By Id
export const deletePizzaById = createAsyncThunk(
  'pizza/deletePizzaById',
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

      const { data } = await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/pizzas/${id}`,
        config
      );

      return data.data || data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);
