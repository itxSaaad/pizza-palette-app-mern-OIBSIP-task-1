import { createSlice } from '@reduxjs/toolkit';

// Import Thunks
import { fetchAllPizzas } from '../asyncThunks/pizzaThunks';

// Initial State
const initialState = {
  pizzaList: [],
  pizzaListError: null,
  pizzaListSuccess: false,
  loading: false,
};

// Create Slice
const pizzaSlice = createSlice({
  name: 'pizza',
  initialState,
  reducers: {
    clearPizzaData: (state) => {
      state.pizzaList = [];
      state.pizzaListError = null;
      state.pizzaListSuccess = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPizzas.pending, (state) => {
        state.loading = true;
        state.pizzaListError = null;
        state.pizzaListSuccess = false;
      })
      .addCase(fetchAllPizzas.fulfilled, (state, action) => {
        state.loading = false;
        state.pizzaList = action.payload;
        state.pizzaListSuccess = true;
      })
      .addCase(fetchAllPizzas.rejected, (state, action) => {
        state.loading = false;
        state.pizzaListError = action.payload;
      });
  },
});

// Export Actions
export const { clearPizzaData } = pizzaSlice.actions;

// Export Reducer
export default pizzaSlice.reducer;
