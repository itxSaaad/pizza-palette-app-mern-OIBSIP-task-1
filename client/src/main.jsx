import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

// Import App
import App from './App.jsx';
import './index.css';
import store from './redux/store.js';

// Import Route Protection
import ProtectedRoute from './components/route/ProtectedRoute.jsx';
import AdminRoute from './components/route/AdminRoute.jsx';
import UserRoute from './components/route/UserRoute.jsx';

// Import Screens
import AboutScreen from './screens/AboutScreen.jsx';
import FAQScreen from './screens/FAQScreen.jsx';
import TermsScreen from './screens/TermsScreen.jsx';
import PrivacyScreen from './screens/PrivacyScreen.jsx';
import AdminDashboardScreen from './screens/Admin/AdminDashboardScreen.jsx';
import AdminLoginScreen from './screens/Admin/AdminLoginScreen.jsx';
import AdminRegisterScreen from './screens/Admin/AdminRegisterScreen.jsx';
import HomeScreen from './screens/HomeScreen.jsx';
import MenuScreen from './screens/MenuScreen.jsx';
import CheckoutScreen from './screens/User/CheckoutScreen.jsx';
import ForgetPasswordScreen from './screens/User/ForgetPasswordScreen.jsx';
import ProfileScreen from './screens/User/ProfileScreen.jsx';
import UserCreateCustomPizzaScreen from './screens/User/UserCreateCustomPizzaScreen.jsx';
import UserLoginScreen from './screens/User/UserLoginScreen.jsx';
import UserOrdersScreen from './screens/User/UserOrdersScreen.jsx';
import UserRegisterScreen from './screens/User/UserRegisterScreen.jsx';
import VerifyEmailScreen from './screens/User/VerifyEmailScreen.jsx';
import ResetPasswordScreen from './screens/User/ResetPasswordScreen.jsx';
import OrderDetailScreen from './screens/User/OrderDetailScreen.jsx';
import CheckoutSuccessScreen from './screens/CheckoutSuccessScreen.jsx';
import CheckoutCancelScreen from './screens/CheckoutCancelScreen.jsx';

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
        path: '/forget-pwd',
        element: <ForgetPasswordScreen />,
      },
      {
        path: '/verify-email',
        element: <VerifyEmailScreen />,
      },
      {
        path: '/reset-password',
        element: <ResetPasswordScreen />,
      },
      {
        path: '/checkout/success',
        element: <CheckoutSuccessScreen />,
      },
      {
        path: '/checkout/cancel',
        element: <CheckoutCancelScreen />,
      },

      {
        path: '/profile',
        element: (
          <ProtectedRoute>
            <ProfileScreen />
          </ProtectedRoute>
        ),
      },
      {
        path: '/custom-pizza',
        element: (
          <UserRoute>
            <UserCreateCustomPizzaScreen />
          </UserRoute>
        ),
      },
      {
        path: '/my-orders',
        element: (
          <UserRoute>
            <UserOrdersScreen />
          </UserRoute>
        ),
      },
      {
        path: '/my-orders/:orderId',
        element: (
          <UserRoute>
            <OrderDetailScreen />
          </UserRoute>
        ),
      },
      {
        path: '/checkout',
        element: (
          <ProtectedRoute>
            <CheckoutScreen />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/dashboard',
        element: (
          <AdminRoute>
            <AdminDashboardScreen />
          </AdminRoute>
        ),
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
      {
        path: '/about',
        element: <AboutScreen />,
      },
      {
        path: '/faq',
        element: <FAQScreen />,
      },
      {
        path: '/terms',
        element: <TermsScreen />,
      },
      {
        path: '/privacy',
        element: <PrivacyScreen />,
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
