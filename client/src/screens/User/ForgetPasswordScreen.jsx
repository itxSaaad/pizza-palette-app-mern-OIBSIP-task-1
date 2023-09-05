import { useState } from 'react';

// Import Components
import EmailForm from '../../components/ui/Auth/ForgetPassword/EmailForm';
import PasswordForm from '../../components/ui/Auth/ForgetPassword/PasswordForm';
import OTPForm from '../../components/ui/Auth/ForgetPassword/OTPForm';
import Logo from '/android-chrome-512x512.png';

function ForgetPasswordScreen() {
  const [currentStep, setCurrentStep] = useState('EmailForm'); // 'EmailForm' | 'OTPForm' | 'PasswordForm
  return (
    <section className="min-h-screen flex flex-col justify-center items-center pt-14 px-10 sm:px-16 bg-gradient-to-b from-orange-200 to-orange-100">
      <div className="flex flex-col sm:flex-row justify-center items-center sm:space-x-6">
        <div className="flex flex-row justify-center items-center p-4 md:p-6 md:w-1/2">
          <img
            src={Logo}
            alt="Pizza Palette Logo"
            className="hidden sm:block h-44 w-44"
          />
          <h1 className="text-4xl lg:text-5xl text-center md:text-left text-orange-500 font-semibold">
            <span className="text-orange-700">Forgot Password?</span>
            <br />
            <span className="text-md text-orange-500">No Worries!</span>
          </h1>
        </div>

        <div className="bg-white flex flex-col justify-center items-center rounded-2xl shadow-lg p-6 md:w-1/2 lg:w-1/3">
          {currentStep === 'EmailForm' && (
            <EmailForm setCurrentStep={setCurrentStep} />
          )}
          {currentStep === 'OTPForm' && (
            <OTPForm setCurrentStep={setCurrentStep} />
          )}
          {currentStep === 'PasswordForm' && (
            <PasswordForm setCurrentStep={setCurrentStep} />
          )}
        </div>
      </div>
    </section>
  );
}

export default ForgetPasswordScreen;
