import { useState } from 'react';

// Import Components
import Card from '../../components/ui/Card';
import EmailForm from '../../components/ui/Auth/ForgetPassword/EmailForm';
import PasswordForm from '../../components/ui/Auth/ForgetPassword/PasswordForm';
import OTPForm from '../../components/ui/Auth/ForgetPassword/OTPForm';
import Logo from '/android-chrome-512x512.png';

function ForgetPasswordScreen() {
  const [currentStep, setCurrentStep] = useState('EmailForm'); // 'EmailForm' | 'OTPForm' | 'PasswordForm'
  return (
    <section className="min-h-screen flex flex-col justify-center items-center px-10 sm:px-16 bg-gradient-to-b from-primary-100 to-neutral-50">
      <div className="flex flex-col sm:flex-row justify-center items-center sm:space-x-6">
        <div className="flex flex-row justify-center items-center p-4 md:p-6 md:w-1/2">
          <img src={Logo} alt="Pizza Palette Logo" className="hidden sm:block h-44 w-44" />
          <h1 className="font-display text-h1 text-center md:text-left text-primary-600">
            <span className="text-primary-700">Forgot Password?</span>
            <br />
            <span className="text-md text-primary-600">No Worries!</span>
          </h1>
        </div>

        <Card className="flex flex-col justify-center items-center md:w-1/2 lg:w-1/3" padding="lg">
          {currentStep === 'EmailForm' && <EmailForm setCurrentStep={setCurrentStep} />}
          {currentStep === 'OTPForm' && <OTPForm setCurrentStep={setCurrentStep} />}
          {currentStep === 'PasswordForm' && <PasswordForm setCurrentStep={setCurrentStep} />}
        </Card>
      </div>
    </section>
  );
}

export default ForgetPasswordScreen;
