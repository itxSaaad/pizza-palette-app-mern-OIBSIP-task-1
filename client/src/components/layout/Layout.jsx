import PropTypes from 'prop-types';

import Footer from './Footer';
import MainNavBar from './MainNavBar';

function Layout({ children }) {
  return (
    <>
      <MainNavBar />
      <main className="pt-16 sm:pt-20 min-h-screen">{children}</main>
      <Footer />
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
