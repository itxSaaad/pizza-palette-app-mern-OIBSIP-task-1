import PropTypes from 'prop-types';
import { FaChevronRight } from 'react-icons/fa';

function CurrentCheckoutStep({ currentStep, AllSteps }) {
  return (
    <div className="flex items-center justify-center space-x-2 mb-4 pb-4 border-b border-b-neutral-200">
      {AllSteps.map((step, index) => (
        <div key={index} className="flex items-center space-x-2">
          <p
            className={`${
              currentStep === step.step
                ? 'text-white font-bold rounded-pill bg-primary-500 px-2 py-1 text-sm sm:text-md'
                : 'text-primary-700 font-bold rounded-pill bg-primary-100 px-2 py-1 text-sm sm:text-md'
            } `}
          >
            {step.icon}
            <span className="hidden sm:inline-block">{step.step}</span>
          </p>
          {index !== AllSteps.length - 1 && (
            <FaChevronRight className="text-primary-700 text-sm sm:text-lg" />
          )}
        </div>
      ))}
    </div>
  );
}

CurrentCheckoutStep.propTypes = {
  currentStep: PropTypes.string.isRequired,
  AllSteps: PropTypes.array.isRequired,
};

export default CurrentCheckoutStep;
