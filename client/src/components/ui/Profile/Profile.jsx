import PropTypes from 'prop-types';

const Profile = ({ user }) => {
  const { name, email, address, phoneNumber, isVerified } = user;

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <h2 className="text-2xl font-semibold text-orange-600 mb-2">
        Hello! {name}
      </h2>
      <div>
        <span className="text-sm text-orange-600 font-semibold">Email:</span>{' '}
        <span className="text-gray-700">{email}</span>
      </div>
      <div>
        <span className="text-sm text-orange-600 font-semibold">Address:</span>{' '}
        <span className="text-gray-700">{address}</span>
      </div>
      <div>
        <span className="text-sm text-orange-600 font-semibold">Phone:</span>{' '}
        <span className="text-gray-700">{phoneNumber}</span>
      </div>
      <div>
        <span className="text-sm text-orange-600 font-semibold">
          Account Status:
        </span>{' '}
        <span className="text-gray-700">
          {isVerified ? 'Verified' : 'Not Verified'}
        </span>
      </div>
    </div>
  );
};

Profile.propTypes = {
  user: PropTypes.object.isRequired,
};

export default Profile;
