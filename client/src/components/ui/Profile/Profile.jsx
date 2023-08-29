import PropTypes from 'prop-types';

const Profile = ({ user }) => {
  const { name, email, address, phoneNumber } = user;

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <h2 className="text-2xl font-semibold text-orange-600 mb-2">
        Hello! {name}
      </h2>
      <div className="mb-2">
        <span className="text-sm text-orange-600 font-semibold">Email:</span>{' '}
        <span className="text-gray-700">{email}</span>
      </div>
      <div className="mb-2">
        <span className="text-sm text-orange-600 font-semibold">Address:</span>{' '}
        <span className="text-gray-700">{address}</span>
      </div>
      <div>
        <span className="text-sm text-orange-600 font-semibold">Phone:</span>{' '}
        <span className="text-gray-700">{phoneNumber}</span>
      </div>
    </div>
  );
};

Profile.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired,
  }).isRequired,
};

export default Profile;
