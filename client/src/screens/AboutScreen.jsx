import Logo from '/android-chrome-512x512.png';
import Card from '../components/ui/Card';

function AboutScreen() {
  return (
    <section className="min-h-screen flex flex-col items-center pt-24 pb-16 px-6 sm:px-16 bg-neutral-50">
      <div className="flex flex-col sm:flex-row items-center justify-center mb-10 text-center sm:text-left">
        <img
          src={Logo}
          alt="Pizza Palette Logo"
          className="hidden sm:block h-28 w-28 mr-4"
        />
        <h1 className="font-display text-h1 text-primary-600">
          Our Story
        </h1>
      </div>

      <div className="w-full max-w-3xl space-y-6">
        <Card padding="lg">
          <h2 className="font-display text-h3 text-neutral-900 mb-3">
            From One Kitchen to Your Doorstep
          </h2>
          <p className="text-neutral-700 text-lg leading-relaxed">
            Pizza Palette started in 2014 as a small, family-run kitchen
            opened by Maria Rossi in her neighborhood, built on a simple
            idea: hand-stretched dough, real ingredients, and pizza made the
            way she learned to make it growing up. Word got around, the
            neighborhood kept coming back, and what started as a single
            counter has grown into an online ordering experience &mdash; but
            the dough is still hand-stretched, and every pizza is still made
            to order.
          </p>
        </Card>

        <Card padding="lg">
          <h2 className="font-display text-h3 text-neutral-900 mb-3">
            How We Do Things
          </h2>
          <p className="text-neutral-700 text-lg leading-relaxed">
            Every pizza on our menu is made from scratch when you order it
            &mdash; no reheating, no shortcuts. If you&rsquo;d rather build your
            own, our custom pizza tool lets you pick your base, sauce,
            cheese, and toppings and see the price update as you go, the
            same way you&rsquo;d call it out at the counter.
          </p>
        </Card>

        <Card padding="lg">
          <h2 className="font-display text-h3 text-neutral-900 mb-3">
            Get in Touch
          </h2>
          <p className="text-neutral-700 text-lg leading-relaxed">
            Questions, feedback, or just want to say hi? Reach us at{' '}
            <a
              href="mailto:contact@pizzapalette.com"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              contact@pizzapalette.com
            </a>
            .
          </p>
        </Card>
      </div>
    </section>
  );
}

export default AboutScreen;
