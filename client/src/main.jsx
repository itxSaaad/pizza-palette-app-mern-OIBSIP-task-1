import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

// Import App
import App from './App.jsx';
import './index.css';
import store from './redux/store.js';

// Import Screens
import AdminDashboardScreen from './screens/Admin/AdminDashboardScreen.jsx';
import AdminLoginScreen from './screens/Admin/AdminLoginScreen.jsx';
import HomeScreen from './screens/HomeScreen.jsx';
import MenuScreen from './screens/MenuScreen.jsx';
import CheckoutScreen from './screens/User/CheckoutScreen.jsx';
import ProfileScreen from './screens/User/ProfileScreen.jsx';
import UserLoginScreen from './screens/User/UserLoginScreen.jsx';
import UserOrdersScreen from './screens/User/UserOrdersScreen.jsx';
import UserRegisterScreen from './screens/User/UserRegisterScreen.jsx';
import AdminRegisterScreen from './screens/Admin/AdminRegisterScreen.jsx';

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
        path: '/my-orders',
        element: <UserOrdersScreen />,
      },
      {
        path: '/checkout',
        element: <CheckoutScreen />,
      },
      {
        path: '/admin/dashboard',
        element: <AdminDashboardScreen />,
      },
      {
        path: '/admin/login',
        element: <AdminLoginScreen />,
      },
      {
        path: '/admin/register',
        element: <AdminRegisterScreen />,
      },
      {
        path: '/menu',
        element: <MenuScreen />,
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
