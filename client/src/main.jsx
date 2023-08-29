import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

// Import App
import App from './App.jsx';
import './index.css';
import store from './redux/store.js';

// Import Screens
import CheckoutScreen from './screens/CheckoutScreen.jsx';
import HomeScreen from './screens/HomeScreen.jsx';
import MenuScreen from './screens/MenuScreen.jsx';
import ProfileScreen from './screens/ProfileScreen.jsx';
import UserLoginScreen from './screens/UserLoginScreen.jsx';
import UserOrdersScreen from './screens/UserOrdersScreen.jsx';
import UserRegisterScreen from './screens/UserRegisterScreen.jsx';

// Create Router
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <HomeScreen />,
      },
      {
        path: '/login',
        element: <UserLoginScreen />,
      },
      {
        path: '/register',
        element: <UserRegisterScreen />,
      },
      {
        path: '/profile',
        element: <ProfileScreen />,
      },
      {
        path: '/menu',
        element: <MenuScreen />,
      },
      {
        path: '/my-orders',
        element: <UserOrdersScreen />,
      },
      {
        path: '/checkout',
        element: <CheckoutScreen />,
      },
    ],
  },
]);

// Render App
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
