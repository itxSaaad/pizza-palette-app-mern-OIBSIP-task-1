import { createSlice } from '@reduxjs/toolkit';

// Import Thunks
import {
  deletePizzaById,
  getPizzaById,
  listPizzas,
  updatePizzaById,
} from '../asyncThunks/pizzaThunks';

// Initial State
const initialState = {
  pizzaInfo: null,
  pizzaList: [],
  pizzaListError: null,
  pizzaGetByIdError: null,
  pizzaUpdateByIdError: null,
  pizzaDeleteByIdError: null,
  pizzaListSuccess: false,
  pizzaGetByIdSuccess: false,
  pizzaUpdateByIdSuccess: false,
  pizzaDeleteByIdSuccess: false,
  loading: false,
};

// Create Slice
const pizzaSlice = createSlice({
  name: 'pizza',
  initialState,
  reducers: {
    clearPizzaData: (state) => {
      state.pizzaInfo = null;
      state.pizzaListError = null;
      state.pizzaGetByIdError = null;
      state.pizzaUpdateByIdError = null;
      state.pizzaDeleteByIdError = null;
      state.pizzaListSuccess = false;
      state.pizzaGetByIdSuccess = false;
      state.pizzaUpdateByIdSuccess = false;
      state.pizzaDeleteByIdSuccess = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listPizzas.pending, (state) => {
        state.loading = true;
        state.pizzaListError = null;
        state.pizzaListSuccess = false;
      })
      .addCase(listPizzas.fulfilled, (state, action) => {
        state.loading = false;
        state.pizzaList = action.payload;
        state.pizzaListSuccess = true;
      })
      .addCase(listPizzas.rejected, (state, action) => {
        state.loading = false;
        state.pizzaListError = action.payload;
      })
      .addCase(getPizzaById.pending, (state) => {
        state.loading = true;
        state.pizzaGetByIdError = null;
        state.pizzaGetByIdSuccess = false;
      })
      .addCase(getPizzaById.fulfilled, (state, action) => {
        state.loading = false;
        state.pizzaInfo = action.payload;
        state.pizzaGetByIdSuccess = true;
      })
      .addCase(getPizzaById.rejected, (state, action) => {
        state.loading = false;
        state.pizzaGetByIdError = action.payload;
      })
      .addCase(updatePizzaById.pending, (state) => {
        state.loading = true;
        state.pizzaUpdateByIdError = null;
        state.pizzaUpdateByIdSuccess = false;
      })
      .addCase(updatePizzaById.fulfilled, (state, action) => {
        state.loading = false;
        state.pizzaInfo = action.payload;
        state.pizzaUpdateByIdSuccess = true;
      })
      .addCase(updatePizzaById.rejected, (state, action) => {
        state.loading = false;
        state.pizzaUpdateByIdError = action.payload;
      })
      .addCase(deletePizzaById.pending, (state) => {
        state.loading = true;
        state.pizzaDeleteByIdError = null;
        state.pizzaDeleteByIdSuccess = false;
      })
      .addCase(deletePizzaById.fulfilled, (state) => {
        state.loading = false;
        state.pizzaDeleteByIdSuccess = true;
      })
      .addCase(deletePizzaById.rejected, (state, action) => {
        state.loading = false;
        state.pizzaDeleteByIdError = action.payload;
      });
  },
});

// Export Actions
export const { clearPizzaData } = pizzaSlice.actions;

// Export Reducer
export default pizzaSlice.reducer;
