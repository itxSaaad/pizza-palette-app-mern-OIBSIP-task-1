import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Create Thunks
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ id, qty }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/pizzas/${id}`
      );

      return {
        _id: data._id,
        name: data.name,
        imageUrl: data.imageUrl,
        price: data.price,
        size: data.size,
        qty,
      };
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

// Initial State
const initialState = {
  cartItems: localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [],
  shippingAddress: localStorage.getItem('shippingAddress')
    ? JSON.parse(localStorage.getItem('shippingAddress'))
    : {},
  paymentMethod: localStorage.getItem('paymentMethod')
    ? JSON.parse(localStorage.getItem('paymentMethod'))
    : {},
  cartAddItemError: null,
  cartRemoveItemError: null,
  cartSaveShippingAddressError: null,
  cartSavePaymentMethodError: null,
  cartAddItemSuccess: false,
  cartRemoveItemSuccess: false,
  cartSaveShippingAddressSuccess: false,
  cartSavePaymentMethodSuccess: false,
  loading: false,
};

// Create Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    removeFromCart(state, action) {
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload
      );
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    saveShippingAddress(state, action) {
      state.shippingAddress = action.payload;
      localStorage.setItem(
        'shippingAddress',
        JSON.stringify(state.shippingAddress)
      );
    },
    savePaymentMethod(state, action) {
      state.paymentMethod = action.payload;
      localStorage.setItem(
        'paymentMethod',
        JSON.stringify(state.paymentMethod)
      );
    },
    clearCartData(state) {
      state.cartItems = [];
      state.shippingAddress = {};
      state.paymentMethod = {};
      state.cartAddItemError = null;
      state.cartRemoveItemError = null;
      state.cartSaveShippingAddressError = null;
      state.cartSavePaymentMethodError = null;
      state.cartAddItemSuccess = false;
      state.cartRemoveItemSuccess = false;
      state.cartSaveShippingAddressSuccess = false;
      state.cartSavePaymentMethodSuccess = false;
      localStorage.removeItem('cartItems');
      localStorage.removeItem('shippingAddress');
      localStorage.removeItem('paymentMethod');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.cartAddItemError = null;
        state.cartAddItemSuccess = false;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartAddItemSuccess = true;
        const item = action.payload;
        const existItem = state.cartItems.find((x) => x._id === item._id);
        if (existItem) {
          state.cartItems = state.cartItems.map((x) =>
            x._id === existItem._id ? item : x
          );
        } else {
          state.cartItems = [...state.cartItems, item];
        }
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.cartAddItemError = action.payload.message;
      });
  },
});

// Export Actions
export const {
  clearCartData,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
} = cartSlice.actions;

// Export Reducer
export default cartSlice.reducer;
