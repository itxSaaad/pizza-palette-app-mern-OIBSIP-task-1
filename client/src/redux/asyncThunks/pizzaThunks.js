import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

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
          Authorization: `Bearer ${
            adminUserInfo ? adminUserInfo.token : userInfo.token
          }`,
        },
      };

      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/pizzas`,
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

// Fetch All Pizzas
export const listPizzas = createAsyncThunk(
  'pizza/listPizzas',
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
  'pizza/getPizzaById',
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
