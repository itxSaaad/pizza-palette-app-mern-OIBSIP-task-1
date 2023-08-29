// Import Components
import { useState } from 'react';
import { FaCheck, FaMoneyCheckAlt, FaTruck } from 'react-icons/fa';

// Import Components
import CurrentCheckoutStep from '../components/ui/CheckoutSteps/CurrentCheckoutStep';
import PaymentStep from '../components/ui/CheckoutSteps/PaymentStep';
import PlaceOrderStep from '../components/ui/CheckoutSteps/PlaceOrderStep';
import ShippingStep from '../components/ui/CheckoutSteps/ShippingStep';

function CheckoutScreen() {
  const [currentStep, setCurrentStep] = useState('Shipping');

  const AllSteps = [
    {
      step: 'Shipping',
      icon: <FaTruck className="inline-block sm:mr-1" />,
    },
    {
      step: 'Payment',
      icon: <FaMoneyCheckAlt className="inline-block sm:mr-1" />,
    },
    {
      step: 'Place Order',
      icon: <FaCheck className="inline-block sm:mr-1" />,
    },
  ];

  return (
    <section className="min-h-screen flex flex-col justify-center items-center pt-24 pb-6 px-2 sm:px-16 bg-orange-200">
      <div className="w-3/4 bg-white rounded-2xl shadow-md p-4 ">
        <h2 className="text-3xl font-bold text-center mb-4">Checkout</h2>
        <CurrentCheckoutStep currentStep={currentStep} AllSteps={AllSteps} />

        {currentStep === 'Shipping' && (
          <ShippingStep setCurrentStep={setCurrentStep} />
        )}
        {currentStep === 'Payment' && (
          <PaymentStep setCurrentStep={setCurrentStep} />
        )}
        {currentStep === 'Place Order' && (
          <PlaceOrderStep setCurrentStep={setCurrentStep} />
        )}
      </div>
    </section>
  );
}

export default CheckoutScreen;
