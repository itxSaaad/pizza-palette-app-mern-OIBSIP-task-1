import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Import Actions
import { saveShippingAddress } from '../../../redux/slices/cartSlice';

// Import Components
import Button from '../Button';
import Input from '../Input';

function ShippingStep({ setCurrentStep }) {
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress, cartItems } = cart;

  const [phoneNumber, setPhoneNumber] = useState(shippingAddress.phoneNumber);
  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [country, setCountry] = useState(shippingAddress.country);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ phoneNumber, address, city, postalCode, country }));
    setCurrentStep('Payment');
  };

  return (
    <form onSubmit={submitHandler} className="w-full p-4">
      <p className="text-center text-neutral-900 text-xl leading-relaxed">
        Shipping
        <br />
        <span className="text-sm text-primary-600">Enter Shipping Details</span>
      </p>

      {cartItems && cartItems.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <Input
              name="phoneNumber"
              type="text"
              value={phoneNumber}
              placeholder="Enter Phone Number"
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <Input
              name="address"
              type="text"
              value={address}
              placeholder="Enter Address"
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <Input
              name="city"
              type="text"
              value={city}
              placeholder="Enter City"
              onChange={(e) => setCity(e.target.value)}
              required
            />
            <Input
              name="postalCode"
              type="text"
              value={postalCode}
              placeholder="Enter Postal Code"
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />
            <Input
              name="country"
              type="text"
              value={country}
              placeholder="Enter Country"
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </div>
          <Button
            variant="outline"
            type="submit"
            disabled={!phoneNumber || !address || !city || !postalCode || !country || !cartItems}
            className="w-full sm:w-1/3 rounded-pill mt-4"
          >
            Continue
          </Button>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center w-full border border-primary-200 rounded-card p-4">
          <p className="text-center text-primary-600 text-xl leading-relaxed">
            Can&apos;t Place Order Without Order Items
          </p>
        </div>
      )}
    </form>
  );
}

ShippingStep.propTypes = {
  setCurrentStep: PropTypes.func.isRequired,
};

export default ShippingStep;
