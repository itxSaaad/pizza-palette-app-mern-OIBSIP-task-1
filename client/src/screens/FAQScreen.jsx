import Card from '../components/ui/Card';
import Accordion from '../components/ui/Accordion';

const FAQ_CATEGORIES = [
  {
    category: 'Ordering & Delivery',
    questions: [
      {
        q: 'How much is delivery?',
        a: "Delivery is a flat $10, or free on orders of $100 or more. We'll show you the exact total, including tax, before you check out.",
      },
      {
        q: 'How long does delivery take?',
        a: "Every pizza is made fresh when you order, so timing depends on how busy our kitchen is. You'll be able to track your order status from your account once it's placed.",
      },
      {
        q: 'Can I change or cancel my order after placing it?',
        a: 'Once an order is placed our kitchen starts on it right away, so we can’t guarantee changes. If something’s wrong, reach out to us at contact@pizzapalette.com as soon as you can.',
      },
    ],
  },
  {
    category: 'Custom Pizzas',
    questions: [
      {
        q: 'How does the custom pizza builder work?',
        a: "Pick a base, sauce, cheese, and any toppings you like, choose a size, and we'll calculate the price as you go — the same way you'd build one at the counter.",
      },
      {
        q: 'Does the size affect the price?',
        a: 'Yes. Larger sizes cost more since they use more ingredients — the price updates automatically as you pick a size in the builder.',
      },
    ],
  },
  {
    category: 'Payments',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept card payments through Stripe, or cash on delivery (COD) if you’d rather pay when your order arrives.',
      },
      {
        q: 'Is my payment information safe?',
        a: 'Card payments are processed securely by Stripe — we never see or store your full card details.',
      },
    ],
  },
  {
    category: 'Account & Orders',
    questions: [
      {
        q: 'Do I need an account to order?',
        a: "Yes, you'll need to create an account so we can keep track of your order and delivery details.",
      },
      {
        q: 'Where can I see my past orders?',
        a: "Head to “My Orders” from your account menu to see everything you've ordered and its current status.",
      },
      {
        q: 'I forgot my password — what do I do?',
        a: 'Use the "Forgot Password" link on the login page and we’ll email you a reset code.',
      },
    ],
  },
];

function FAQScreen() {
  return (
    <section className="min-h-screen flex flex-col items-center pt-24 pb-16 px-6 sm:px-16 bg-neutral-50">
      <h1 className="font-display text-h1 text-primary-600 mb-8 text-center">
        Frequently Asked Questions
      </h1>

      <div className="w-full max-w-3xl space-y-8">
        {FAQ_CATEGORIES.map((group) => (
          <div key={group.category}>
            <h2 className="font-display text-h3 text-neutral-900 mb-2">{group.category}</h2>
            <Card padding="lg">
              {group.questions.map((item) => (
                <Accordion key={item.q} title={item.q}>
                  {item.a}
                </Accordion>
              ))}
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FAQScreen;
