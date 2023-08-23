import PropTypes from 'prop-types';

import Footer from './Footer';
import MainNavBar from './MainNavBar';

function Layout({ children }) {
  return (
    <>
      <MainNavBar />
      {children}
      <Footer />
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
