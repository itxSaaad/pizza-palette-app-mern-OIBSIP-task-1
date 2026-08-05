import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../Button';
import Input from '../Input';
import Loader from '../Loader';
import Message from '../Message';

import { useFormState } from '../../../hooks/useFormState';
import { getUserDetails, updateUserProfile } from '../../../redux/asyncThunks/userThunks';

function EditProfileForm({ setIsEditing }) {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const { loading, userUpdateProfileError, userDetails } = user;

  const {
    values: formData,
    handleChange: handleFieldChange,
    reset,
  } = useFormState({
    name: userDetails.name,
    email: userDetails.email,
    address: userDetails.address,
    phoneNumber: userDetails.phoneNumber,
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserProfile(formData)).then(() => {
      setIsEditing(false);
      dispatch(getUserDetails({}));
    });
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          {userUpdateProfileError && <Message>{userUpdateProfileError}</Message>}
          <form onSubmit={handleSubmit} className="w-full">
            <div className="w-full grid grid-cols-1 gap-4 lg:grid-cols-2 my-2">
              <Input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleFieldChange}
                aria-label="Name"
                placeholder="Enter your Name"
              />
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleFieldChange}
                aria-label="Email"
                placeholder="Enter your Email"
              />
              <Input
                name="address"
                type="text"
                value={formData.address}
                aria-label="Address"
                placeholder="Enter your Address"
                onChange={handleFieldChange}
              />
              <Input
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                aria-label="Phone Number"
                placeholder="Enter your Phone Number"
                onChange={handleFieldChange}
              />
              <Input
                name="password"
                type="password"
                value={formData.password}
                aria-label="New Password"
                placeholder="Enter new password"
                onChange={handleFieldChange}
              />
              <Input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                aria-label="Confirm New Password"
                placeholder="Confirm new password"
                onChange={handleFieldChange}
              />
            </div>
            <div className="flex flex-row justify-between">
              <Button type="submit" variant="primary" className="rounded-control">
                Save Changes
              </Button>
              <Button
                type="button"
                variant="danger"
                className="rounded-control"
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
};
export default EditProfileForm;
