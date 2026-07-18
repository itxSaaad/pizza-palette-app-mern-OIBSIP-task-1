import { FaPizzaSlice, FaCartPlus, FaMoneyCheckAlt } from 'react-icons/fa';
import { BsFillEmojiHeartEyesFill } from 'react-icons/bs';

import Card from '../Card';

function HowItWorksSection() {
  const StepsToOrderPizza = [
    {
      step: 1,
      icon: <FaPizzaSlice />,
      title: 'Choose Your Pizza',
      description:
        'Browse our delicious range of pizzas and select your favorite one.',
    },
    {
      step: 2,
      icon: <FaCartPlus />,
      title: 'Add to Cart',
      description:
        'Click the "Add to Cart" button to add your chosen pizza to your cart.',
    },
    {
      step: 3,
      icon: <FaMoneyCheckAlt />,
      title: 'Checkout Your Order',
      description:
        'Review your order details and proceed to the secure checkout.',
    },
    {
      step: 4,
      icon: <BsFillEmojiHeartEyesFill />,
      title: 'Enjoy Your Pizza',
      description:
        'Sit back, relax, and enjoy your delicious pizza delivered to your doorstep.',
    },
  ];

  return (
    <section
      id="how-it-works"
      className="min-h-screen flex flex-col justify-center items-center py-12 px-10 sm:px-16 bg-gradient-to-b from-primary-100 to-neutral-50"
    >
      <h1 className="font-display text-h1 text-primary-600 mb-2 text-center">
        How It Works
      </h1>

      <p className="text-xl text-center text-neutral-700 mb-4">
        From our kitchen to your door in four simple steps.
      </p>
      <Card className="grid grid-cols-1 md:grid-cols-2 gap-4" padding="lg">
        {StepsToOrderPizza.map((step) => (
          <div
            key={step.step}
            className="flex flex-col lg:flex-row lg:my-4 items-center justify-start"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-primary-100 text-2xl text-primary-600 rounded-full mb-4 lg:mr-4">
              {step.icon}
            </div>
            <div className="flex flex-col text-center lg:text-left">
              <h3 className="text-xl font-semibold border-b-2 border-b-primary-500 mb-2">
                {step.step}
                {'. '}
                {step.title}
              </h3>
              <p className="text-neutral-700">{step.description}</p>
            </div>
          </div>
        ))}
      </Card>
    </section>
  );
}

export default HowItWorksSection;
