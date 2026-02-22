import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

function UserRoute({ children }) {
  const user = useSelector((state) => state.user);
  const { userInfo } = user;

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

UserRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserRoute;
