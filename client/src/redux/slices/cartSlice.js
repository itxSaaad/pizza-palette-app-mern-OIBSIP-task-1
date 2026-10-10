import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { extractErrorMessage } from '../../utils/errorUtils';

// Create Thunks
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ id, qty, size, calculatedPrice }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/pizzas/${id}`);

      // Extract pizza data from response
      const pizza = data.data || data;

      return {
        _id: pizza._id,
        name: pizza.name,
        imageUrl: pizza.imageUrl,
        basePrice: pizza.price,
        size: size,
        price: calculatedPrice,
        qty,
      };
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Create Stripe Checkout Session
export const createStripeCheckoutSession = createAsyncThunk(
  'cart/createStripeCheckoutSession',
  async (orderData, { rejectWithValue, getState }) => {
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
        `${import.meta.env.VITE_SERVER_URL}/orders/create-checkout-session`,
        orderData,
        config
      );

      return data.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Initial State with defensive data validation
const initialState = {
  cartItems: (() => {
    try {
      const items = localStorage.getItem('cartItems');
      if (!items) return [];

      const parsed = JSON.parse(items);

      // Validate and clean up cart items
      return Array.isArray(parsed)
        ? parsed.filter(
            (item) => item._id && item.size && item.price > 0 && item.qty > 0 && item.qty <= 10
          )
        : [];
    } catch (error) {
      console.error('Failed to parse cart items:', error);
      localStorage.removeItem('cartItems');
      return [];
    }
  })(),
  shippingAddress: localStorage.getItem('shippingAddress')
    ? JSON.parse(localStorage.getItem('shippingAddress'))
    : {},
  paymentMethod: localStorage.getItem('paymentMethod')
    ? JSON.parse(localStorage.getItem('paymentMethod'))
    : {},
  stripeSessionId: null,
  stripeCheckoutUrl: null,
  stripeOrderId: null,
  stripeCheckoutError: null,
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
    updateCartItemQuantity(state, action) {
      const { id, size, qty } = action.payload;

      // Validate quantity bounds
      if (qty < 1 || qty > 10) {
        return;
      }

      // Find the specific cart item
      const item = state.cartItems.find((item) => item._id === id && item.size === size);

      if (item) {
        item.qty = qty; // SET quantity (don't add)
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      }
    },
    removeFromCart(state, action) {
      const { id, size } = action.payload;
      state.cartItems = state.cartItems.filter((item) => !(item._id === id && item.size === size));
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    saveShippingAddress(state, action) {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(state.shippingAddress));
    },
    savePaymentMethod(state, action) {
      state.paymentMethod = action.payload;
      localStorage.setItem('paymentMethod', JSON.stringify(state.paymentMethod));
    },
    clearCartData(state) {
      state.cartItems = [];
      state.shippingAddress = {};
      state.paymentMethod = {};
      localStorage.removeItem('cartItems');
      localStorage.removeItem('shippingAddress');
      localStorage.removeItem('paymentMethod');
      state.stripeSessionId = null;
      state.stripeCheckoutUrl = null;
      state.stripeOrderId = null;
      state.stripeCheckoutError = null;
      state.cartAddItemError = null;
      state.cartRemoveItemError = null;
      state.cartSaveShippingAddressError = null;
      state.cartSavePaymentMethodError = null;
      state.cartAddItemSuccess = false;
      state.cartRemoveItemSuccess = false;
      state.cartSaveShippingAddressSuccess = false;
      state.cartSavePaymentMethodSuccess = false;
      state.orderGetRazorPayOrderIdSuccess = false;
      state.orderRazorPayPaymentSuccess = false;
      state.loading = false;
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

        // Check if same pizza with same size exists
        const existItem = state.cartItems.find((x) => x._id === item._id && x.size === item.size);

        if (existItem) {
          // Update quantity for existing item
          existItem.qty += item.qty;
        } else {
          // Add new item
          state.cartItems.push(item);
        }

        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.cartAddItemError = action.payload;
      })
      .addCase(createStripeCheckoutSession.pending, (state) => {
        state.loading = true;
        state.stripeCheckoutError = null;
      })
      .addCase(createStripeCheckoutSession.fulfilled, (state, action) => {
        state.loading = false;
        state.stripeSessionId = action.payload.sessionId;
        state.stripeCheckoutUrl = action.payload.url;
        state.stripeOrderId = action.payload.orderId;
      })
      .addCase(createStripeCheckoutSession.rejected, (state, action) => {
        state.loading = false;
        state.stripeCheckoutError = action.payload;
      });
  },
});

// Export Actions
export const {
  clearCartData,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  updateCartItemQuantity,
} = cartSlice.actions;

// Export Reducer
export default cartSlice.reducer;
