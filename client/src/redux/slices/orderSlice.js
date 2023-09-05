import { createSlice } from '@reduxjs/toolkit';

// Import Thunks
import {
  createOrder,
  deleteOrderById,
  getOrderById,
  listOrders,
  listOrdersByUserId,
  updateOrderById,
} from '../asyncThunks/orderThunks';

// Create Intitial State
const initialState = {
  orderInfo: {},
  orderList: [],
  orderListByUserId: [],
  orderCreateError: null,
  orderDetailsByIdError: null,
  orderListError: null,
  orderListByUserIdError: null,
  orderUpdateByIdError: null,
  orderDeleteByIdError: null,
  orderDetailsByIdSuccess: false,
  orderListSuccess: false,
  orderListByUserIdSuccess: false,
  orderCreateSuccess: false,
  orderUpdateByIdSuccess: false,
  orderDeleteByIdSuccess: false,
  loading: false,
};

// Create Slice
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderData: (state) => {
      state.orderInfo = {};
      state.orderListByUserId = [];
      state.orderList = [];
      state.orderCreateError = null;
      state.orderListByUserIdError = null;
      state.orderListError = null;
      state.orderDetailsByIdError = null;
      state.orderUpdateByIdError = null;
      state.orderDeleteByIdError = null;
      state.orderCreateSuccess = false;
      state.orderListByUserIdSuccess = false;
      state.orderListSuccess = false;
      state.orderDetailsByIdSuccess = false;
      state.orderUpdateByIdSuccess = false;
      state.orderDeleteByIdSuccess = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.orderCreateSuccess = false;
        state.orderCreateError = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderCreateSuccess = true;
        state.orderInfo = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.orderCreateError = action.payload;
      })
      .addCase(listOrders.pending, (state) => {
        state.loading = true;
        state.orderListSuccess = false;
        state.orderListError = null;
      })
      .addCase(listOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orderListSuccess = true;
        state.orderList = action.payload;
      })
      .addCase(listOrders.rejected, (state, action) => {
        state.loading = false;
        state.orderListError = action.payload;
      })
      .addCase(listOrdersByUserId.pending, (state) => {
        state.loading = true;
        state.orderListByUserIdSuccess = false;
        state.orderListByUserIdError = null;
      })
      .addCase(listOrdersByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.orderListByUserIdSuccess = true;
        state.orderListByUserId = action.payload;
      })
      .addCase(listOrdersByUserId.rejected, (state, action) => {
        state.loading = false;
        state.orderListByUserIdError = action.payload;
      })
      .addCase(getOrderById.pending, (state) => {
        state.loading = true;
        state.orderDetailsByIdSuccess = false;
        state.orderDetailsByIdError = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetailsByIdSuccess = true;
        state.orderInfo = action.payload;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.loading = false;
        state.orderDetailsByIdError = action.payload;
      })
      .addCase(updateOrderById.pending, (state) => {
        state.loading = true;
        state.orderUpdateByIdSuccess = false;
        state.orderUpdateByIdError = null;
      })
      .addCase(updateOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.orderUpdateByIdSuccess = true;
        state.orderInfo = action.payload;
      })
      .addCase(updateOrderById.rejected, (state, action) => {
        state.loading = false;
        state.orderUpdateByIdError = action.payload;
      })
      .addCase(deleteOrderById.pending, (state) => {
        state.loading = true;
        state.orderDeleteByIdSuccess = false;
        state.orderDeleteByIdError = null;
      })
      .addCase(deleteOrderById.fulfilled, (state) => {
        state.loading = false;
        state.orderDeleteByIdSuccess = true;
      })
      .addCase(deleteOrderById.rejected, (state, action) => {
        state.loading = false;
        state.orderDeleteByIdError = action.payload;
      });
  },
});

// Export Actions
export const { clearOrderData } = orderSlice.actions;

// Export Reducer
export default orderSlice.reducer;
