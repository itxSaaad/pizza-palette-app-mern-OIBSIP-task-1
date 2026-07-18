import Card from '../components/ui/Card';

const SECTIONS = [
  {
    title: 'What We Collect',
    body: 'When you create an account or place an order, we collect your name, email address, phone number, and delivery address. If you pay by card, your payment details are handled directly by Stripe — we never see or store your full card number.',
  },
  {
    title: 'How We Use It',
    body: "We use your information to process orders, keep you updated on delivery status by email, and let you view your order history. We don\'t sell your information to anyone.",
  },
  {
    title: 'Order & Account Data',
    body: "Your order history stays linked to your account so you can review past orders. You can update your name, email, phone number, and address at any time from your profile.",
  },
  {
    title: 'Cookies',
    body: 'Pizza Palette uses browser storage to keep you signed in and to remember your cart between visits. We don\'t use tracking cookies for advertising.',
  },
  {
    title: 'Data Security',
    body: 'Your password is stored encrypted, never in plain text, and all traffic to Pizza Palette is sent over HTTPS.',
  },
  {
    title: 'Contact',
    body: 'Questions about your data or this policy? Reach us at contact@pizzapalette.com.',
  },
];

function PrivacyScreen() {
  return (
    <section className="min-h-screen flex flex-col items-center pt-24 pb-16 px-6 sm:px-16 bg-neutral-50">
      <h1 className="font-display text-h1 text-primary-600 mb-2 text-center">
        Privacy Policy
      </h1>
      <p className="text-neutral-600 mb-8 text-center max-w-xl">
        This is a plain-language explanation of what we collect and why —
        not a substitute for formal legal advice.
      </p>

      <div className="w-full max-w-3xl space-y-4">
        {SECTIONS.map((section) => (
          <Card key={section.title} padding="lg">
            <h2 className="font-display text-h4 text-neutral-900 mb-2">
              {section.title}
            </h2>
            <p className="text-neutral-700 leading-relaxed">{section.body}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default PrivacyScreen;
