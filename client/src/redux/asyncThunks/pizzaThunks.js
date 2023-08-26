import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create Async Thunks

// Fetch All Pizzas
export const fetchAllPizzas = createAsyncThunk(
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
