import { Link } from 'react-router-dom';
import { GiPizzaSlice } from 'react-icons/gi';

import Button from '../components/ui/Button';

function NotFoundScreen() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 sm:px-16 bg-neutral-50 text-center">
      <GiPizzaSlice className="text-primary-300 text-8xl mb-6" aria-hidden="true" />
      <h1 className="font-display text-h1 text-primary-600 mb-3">
        This Slice Went Missing
      </h1>
      <p className="text-neutral-700 text-lg mb-8 max-w-md">
        We couldn&apos;t find the page you were looking for. It might have
        been moved, or the link might be off &mdash; but the menu is still
        right where you left it.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/">
          <Button variant="primary">Back to Home</Button>
        </Link>
        <Link to="/menu">
          <Button variant="outline">Browse the Menu</Button>
        </Link>
      </div>
    </section>
  );
}

export default NotFoundScreen;
