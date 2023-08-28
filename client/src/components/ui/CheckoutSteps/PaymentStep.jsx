import PropTypes from 'prop-types';
import { useState } from 'react';

import Button from '../Button';

function PaymentStep({ setCurrentStep }) {
  const [paymentMethod, setPaymentMethod] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    setCurrentStep('Place Order');
  };
  return (
    <form onSubmit={submitHandler} className="w-full p-4">
      <p className="text-center text-black text-xl leading-relaxed">
        Payment
        <br />
        <span className="text-sm text-orange-500">Select Payment Method</span>
      </p>
      <div className="flex flex-col items-center justify-center mt-4">
        <div className="flex items-center justify-center">
          <input
            type="radio"
            id="razorpay"
            value="Razorpay"
            name="paymentMethod"
            required
            checked={paymentMethod === 'Razorpay'}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mr-2"
          />
          <label
            htmlFor="razorpay"
            className="text-orange-500 font-semibold text-lg"
          >
            Razorpay
          </label>
        </div>
      </div>
      <Button
        variant="outline"
        type="submit"
        className="w-full sm:w-1/3 rounded-full mt-4"
      >
        Continue
      </Button>
    </form>
  );
}

PaymentStep.propTypes = {
  setCurrentStep: PropTypes.func.isRequired,
};

export default PaymentStep;
