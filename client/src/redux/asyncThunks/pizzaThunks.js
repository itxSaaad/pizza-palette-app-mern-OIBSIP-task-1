import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create Async Thunks

// Fetch All Pizzas
export const listPizzas = createAsyncThunk(
  'pizza/fetchAllPizzas',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/pizzas`
      );

      return data;
    } catch (error) {
      return rejectWithValue({
        status: error.response && error.response.status,
        message:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  }
);

// Fetch Single Pizza
export const getPizzaById = createAsyncThunk(
  'pizza/fetchSinglePizza',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/pizzas/${id}`
      );

      return data;
    } catch (error) {
      return rejectWithValue({
        status: error.response && error.response.status,
        message:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  }
);

// Update Pizza By Id
export const updatePizzaById = createAsyncThunk(
  'pizza/updatePizzaById',
  async (
    {
      id,
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

      return data;
    } catch (error) {
      return rejectWithValue({
        status: error.response && error.response.status,
        message:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
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

      return data;
    } catch (error) {
      return rejectWithValue({
        status: error.response && error.response.status,
        message:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  }
);
