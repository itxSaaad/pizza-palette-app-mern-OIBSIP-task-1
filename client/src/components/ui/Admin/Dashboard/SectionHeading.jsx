import PropTypes from 'prop-types';

function SectionHeading({ children }) {
  return (
    <h1 className="text-3xl text-center font-bold border-b-2 border-primary-900 p-1 my-2 text-neutral-900">
      {children}
    </h1>
  );
}

SectionHeading.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SectionHeading;
