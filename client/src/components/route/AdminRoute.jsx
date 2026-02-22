import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

function AdminRoute({ children }) {
  const admin = useSelector((state) => state.admin);
  const { adminUserInfo } = admin;

  if (!adminUserInfo) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminRoute;
