import { configureStore } from '@reduxjs/toolkit';

// Import Reducers
import userReducer from './slices/userSlice.js';

// Create Store

const store = configureStore({
  reducer: {
    user: userReducer,
  },
  devTools: true,
});

// Export Store
export default store;
