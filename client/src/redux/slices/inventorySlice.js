import { createSlice } from '@reduxjs/toolkit';

// Import Thunks
import {
  createStock,
  listInventory,
  updateStockById,
  deleteStockById,
  getStockById,
} from '../asyncThunks/inventoryThunks';

// Initial State
const initialState = {
  inventoryList: [],
  stockDetails: {},
  inventoryListError: null,
  inventoryCreateStockError: null,
  inventoryGetStockByIdError: null,
  inventoryUpdateStockByIdError: null,
  inventoryDeleteStockByIdError: null,
  inventoryListSuccess: false,
  inventoryCreateStockSuccess: false,
  inventoryGetStockByIdSuccess: false,
  inventoryUpdateStockByIdSuccess: false,
  inventoryDeleteStockByIdSuccess: false,
  loading: false,
};

// Inventory Slice
const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    clearInventoryData(state) {
      state.inventoryList = [];
      state.stockDetails = {};
      state.inventoryListError = null;
      state.inventoryCreateStockError = null;
      state.inventoryGetStockByIdError = null;
      state.inventoryUpdateStockByIdError = null;
      state.inventoryDeleteStockByIdError = null;
      state.inventoryListSuccess = false;
      state.inventoryCreateStockSuccess = false;
      state.inventoryGetStockByIdSuccess = false;
      state.inventoryUpdateStockByIdSuccess = false;
      state.inventoryDeleteStockByIdSuccess = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createStock.pending, (state) => {
        state.loading = true;
        state.inventoryCreateStockSuccess = false;
        state.inventoryCreateStockError = null;
      })
      .addCase(createStock.fulfilled, (state, action) => {
        state.loading = false;
        state.stockDetails = action.payload;
        state.inventoryCreateStockSuccess = true;
        state.inventoryCreateStockError = null;
      })
      .addCase(createStock.rejected, (state, action) => {
        state.loading = false;
        state.inventoryCreateStockSuccess = false;
        state.inventoryCreateStockError = action.payload;
      })
      .addCase(listInventory.pending, (state) => {
        state.loading = true;
        state.inventoryListSuccess = false;
        state.inventoryListError = null;
      })
      .addCase(listInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.inventoryList = action.payload;
        state.inventoryListSuccess = true;
        state.inventoryListError = null;
      })
      .addCase(listInventory.rejected, (state, action) => {
        state.loading = false;
        state.inventoryListSuccess = false;
        state.inventoryListError = action.payload;
      })
      .addCase(getStockById.pending, (state) => {
        state.loading = true;
        state.inventoryGetStockByIdSuccess = false;
        state.inventoryGetStockByIdError = null;
      })
      .addCase(getStockById.fulfilled, (state, action) => {
        state.loading = false;
        state.stockDetails = action.payload;
        state.inventoryGetStockByIdSuccess = true;
        state.inventoryGetStockByIdError = null;
      })
      .addCase(getStockById.rejected, (state, action) => {
        state.loading = false;
        state.inventoryGetStockByIdSuccess = false;
        state.inventoryGetStockByIdError = action.payload;
      })
      .addCase(updateStockById.pending, (state) => {
        state.loading = true;
        state.inventoryUpdateStockByIdSuccess = false;
        state.inventoryUpdateStockByIdError = null;
      })
      .addCase(updateStockById.fulfilled, (state, action) => {
        state.loading = false;
        state.stockDetails = action.payload;
        state.inventoryUpdateStockByIdSuccess = true;
        state.inventoryUpdateStockByIdError = null;
      })
      .addCase(updateStockById.rejected, (state, action) => {
        state.loading = false;
        state.inventoryUpdateStockByIdSuccess = false;
        state.inventoryUpdateStockByIdError = action.payload;
      })
      .addCase(deleteStockById.pending, (state) => {
        state.loading = true;
        state.inventoryDeleteStockByIdSuccess = false;
        state.inventoryDeleteStockByIdError = null;
      })
      .addCase(deleteStockById.fulfilled, (state) => {
        state.loading = false;
        state.inventoryDeleteStockByIdSuccess = true;
        state.inventoryDeleteStockByIdError = null;
      })
      .addCase(deleteStockById.rejected, (state, action) => {
        state.loading = false;
        state.inventoryDeleteStockByIdSuccess = false;
        state.inventoryDeleteStockByIdError = action.payload;
      });
  },
});

// Export Actions
export const { clearInventoryData } = inventorySlice.actions;

// Export Reducer
export default inventorySlice.reducer;
