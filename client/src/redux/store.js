import { configureStore } from '@reduxjs/toolkit';

// Import Reducers
import userReducer from './slices/userSlice.js';
import pizzaReducer from './slices/pizzaSlice.js';
import adminReducer from './slices/adminSlice.js';
import cartReducer from './slices/cartSlice.js';

// Create Store

const store = configureStore({
  reducer: {
    user: userReducer,
    admin: adminReducer,
    pizza: pizzaReducer,
    cart: cartReducer,
  },
  devTools: true,
});

// Export Store
export default store;
