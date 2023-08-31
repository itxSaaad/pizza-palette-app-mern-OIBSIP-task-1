import { configureStore } from '@reduxjs/toolkit';

// Import Reducers
import adminReducer from './slices/adminSlice.js';
import cartReducer from './slices/cartSlice.js';
import orderReducer from './slices/orderSlice.js';
import pizzaReducer from './slices/pizzaSlice.js';
import userReducer from './slices/userSlice.js';

// Create Store

const store = configureStore({
  reducer: {
    admin: adminReducer,
    cart: cartReducer,
    order: orderReducer,
    pizza: pizzaReducer,
    user: userReducer,
  },
  devTools: true,
});

// Export Store
export default store;
