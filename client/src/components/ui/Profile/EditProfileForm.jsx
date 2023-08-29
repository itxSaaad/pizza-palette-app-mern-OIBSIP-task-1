import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../Button';
import Loader from '../Loader';
import Message from '../Message';

import {
  getUserDetails,
  updateUserProfile,
} from '../../../redux/asyncThunks/userThunks';

function EditProfileForm({ setIsEditing }) {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const { loading, userUpdateProfileError, userDetails } = user;

  const initialFormData = {
    name: userDetails.name,
    email: userDetails.email,
    address: userDetails.address,
    phoneNumber: userDetails.phoneNumber,
    password: '',
    confirmPassword: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleFieldChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserProfile(formData)).then(() => {
      setIsEditing(false);
      dispatch(getUserDetails({}));
    });
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setIsEditing(false);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          {userUpdateProfileError && (
            <Message>{userUpdateProfileError}</Message>
          )}
          <form onSubmit={handleSubmit} className="w-full">
            <div className="w-full grid grid-cols-1 gap-4 lg:grid-cols-2 my-2">
              <div className="w-full">
                <label className="sr-only" htmlFor="name">
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full text-orange-600 bg-orange-100 placeholder-orange-300 rounded-md p-4 pr-12 text-sm shadow-sm"
                  value={formData.name}
                  onChange={handleFieldChange}
                />
              </div>

              <div className="w-full">
                <label htmlFor="email" className="sr-only">
                  Email
                </label>

                <input
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  className="w-full text-orange-600 bg-orange-100 placeholder-orange-300 rounded-md p-4 pr-12 text-sm shadow-sm"
                  onChange={handleFieldChange}
                />
              </div>
              <div className="w-full">
                <label htmlFor="address" className="sr-only">
                  Address
                </label>

                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  placeholder="Enter your Address"
                  className="w-full text-orange-600 bg-orange-100 placeholder-orange-300 rounded-md p-4 pr-12 text-sm shadow-sm"
                  onChange={handleFieldChange}
                />
              </div>
              <div className="w-full">
                <label htmlFor="phoneNumber" className="sr-only">
                  Phone Number
                </label>

                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  placeholder="Enter your Phone Number"
                  className="w-full text-orange-600 bg-orange-100 placeholder-orange-300 rounded-md p-4 pr-12 text-sm shadow-sm"
                  onChange={handleFieldChange}
                />
              </div>

              <div className="w-full">
                <label className="sr-only" htmlFor="password">
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter new password"
                  className="w-full text-orange-600 bg-orange-100 placeholder-orange-300 rounded-md p-4 pr-12 text-sm shadow-sm"
                  onChange={handleFieldChange}
                />
              </div>

              <div className="w-full">
                <label className="sr-only" htmlFor="confirmPassword">
                  Confirm Password:
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  className="w-full text-orange-600 bg-orange-100 placeholder-orange-300 rounded-md p-4 pr-12 text-sm shadow-sm"
                  onChange={handleFieldChange}
                />
              </div>
            </div>
            <div className="flex flex-row justify-between">
              <Button type="submit" variant="primary" className="rounded-md">
                Save Changes
              </Button>
              <Button
                variant="danger"
                className="rounded-md"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </form>
        </>
      )}
    </>
  );
}

EditProfileForm.propTypes = {
  setIsEditing: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};
export default EditProfileForm;
