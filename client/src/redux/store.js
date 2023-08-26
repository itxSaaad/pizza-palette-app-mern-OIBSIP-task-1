import { configureStore } from '@reduxjs/toolkit';

// Import Reducers
import userReducer from './slices/userSlice.js';
import pizzaReducer from './slices/pizzaSlice.js';

// Create Store

const store = configureStore({
  reducer: {
    user: userReducer,
    pizza: pizzaReducer,
  },
  devTools: true,
});

// Export Store
export default store;
