import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../Button';
import Input from '../Input';
import Loader from '../Loader';
import Message from '../Message';

import { getUserDetails, updateUserProfile } from '../../../redux/asyncThunks/userThunks';

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
          {userUpdateProfileError && <Message>{userUpdateProfileError}</Message>}
          <form onSubmit={handleSubmit} className="w-full">
            <div className="w-full grid grid-cols-1 gap-4 lg:grid-cols-2 my-2">
              <Input name="name" type="text" value={formData.name} onChange={handleFieldChange} />
              <Input name="email" type="text" value={formData.email} onChange={handleFieldChange} />
              <Input
                name="address"
                type="text"
                value={formData.address}
                placeholder="Enter your Address"
                onChange={handleFieldChange}
              />
              <Input
                name="phoneNumber"
                type="text"
                value={formData.phoneNumber}
                placeholder="Enter your Phone Number"
                onChange={handleFieldChange}
              />
              <Input
                name="password"
                type="password"
                placeholder="Enter new password"
                onChange={handleFieldChange}
              />
              <Input
                name="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                onChange={handleFieldChange}
              />
            </div>
            <div className="flex flex-row justify-between">
              <Button type="submit" variant="primary" className="rounded-control">
                Save Changes
              </Button>
              <Button variant="danger" className="rounded-control" onClick={handleCancel}>
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
