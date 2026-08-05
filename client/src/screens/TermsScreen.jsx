import Card from '../components/ui/Card';

const SECTIONS = [
  {
    title: 'Using Pizza Palette',
    body: "By creating an account and placing an order with Pizza Palette, you agree to these terms. You're responsible for keeping your account details accurate and your password secure.",
  },
  {
    title: 'Orders & Pricing',
    body: 'Prices shown at checkout include a 15% sales tax and, unless your order subtotal is $100 or more, a flat $10 delivery charge. Once an order is placed, our kitchen begins preparing it right away, so we may not be able to make changes after the fact.',
  },
  {
    title: 'Payments',
    body: "We accept card payments processed securely through Stripe, or cash on delivery. If you pay by card, Stripe's own terms and privacy practices also apply to that transaction.",
  },
  {
    title: 'Custom Pizzas',
    body: 'Pizzas created through our custom pizza builder are priced based on the ingredients and size you select. We do our best to keep ingredient information accurate, but please let us know if you have any allergies or dietary concerns before ordering.',
  },
  {
    title: 'Account Responsibilities',
    body: "You're responsible for all activity on your account. If you believe your account has been used without your permission, contact us right away at contact@pizzapalette.com.",
  },
  {
    title: 'Changes to These Terms',
    body: 'We may update these terms from time to time as the app changes. Continuing to use Pizza Palette after an update means you accept the revised terms.',
  },
  {
    title: 'Contact',
    body: 'Questions about these terms? Reach us at contact@pizzapalette.com.',
  },
];

function TermsScreen() {
  return (
    <section className="min-h-screen flex flex-col items-center pt-24 pb-16 px-6 sm:px-16 bg-neutral-50">
      <h1 className="font-display text-h1 text-primary-600 mb-2 text-center">Terms of Service</h1>
      <p className="text-neutral-600 mb-8 text-center max-w-xl">
        This is a straightforward summary of how Pizza Palette works, written in plain language
        rather than formal legal terms.
      </p>

      <div className="w-full max-w-3xl space-y-4">
        {SECTIONS.map((section) => (
          <Card key={section.title} padding="lg">
            <h2 className="font-display text-h4 text-neutral-900 mb-2">{section.title}</h2>
            <p className="text-neutral-700 leading-relaxed">{section.body}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default TermsScreen;
