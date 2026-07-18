import { useEffect, useState } from 'react';
import { FaCheck, FaMoneyCheckAlt, FaTruck } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Import Components
import Card from '../../components/ui/Card';
import CurrentCheckoutStep from '../../components/ui/CheckoutSteps/CurrentCheckoutStep';
import PaymentStep from '../../components/ui/CheckoutSteps/PaymentStep';
import PlaceOrderStep from '../../components/ui/CheckoutSteps/PlaceOrderStep';
import ShippingStep from '../../components/ui/CheckoutSteps/ShippingStep';

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

  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  const { userInfo } = user;

  const admin = useSelector((state) => state.admin);
  const { adminUserInfo } = admin;

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  useEffect(() => {
    if (!userInfo && !adminUserInfo) {
      navigate('/login');
    } else if (!cartItems || cartItems.length === 0) {
      navigate('/menu');
    }
  }, [navigate, userInfo, adminUserInfo, cartItems]);

  return (
    <section className="min-h-screen flex flex-col justify-center items-center pb-6 px-2 sm:px-16 bg-neutral-50">
      <Card className="w-full sm:w-11/12 md:w-3/4 lg:w-2/3" padding="md">
        <h2 className="font-display text-h2 text-center mb-4 text-primary-600">
          Checkout
        </h2>
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
      </Card>
    </section>
  );
}

export default CheckoutScreen;
