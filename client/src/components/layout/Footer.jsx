import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-primary-600 py-6">
      <div className="flex flex-col items-center justify-center container mx-auto text-primary-100 text-center px-4 space-y-3">
        <nav className="flex flex-row flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          <Link to="/faq" className="hover:text-white underline-offset-4 hover:underline">
            FAQ
          </Link>
          <Link to="/terms" className="hover:text-white underline-offset-4 hover:underline">
            Terms of Service
          </Link>
          <Link to="/privacy" className="hover:text-white underline-offset-4 hover:underline">
            Privacy Policy
          </Link>
        </nav>
        <p>
          &copy; {new Date().getFullYear()} Pizza Palette. All rights reserved. Created with ♥ by{' '}
          <a
            href="https://bento.me/itxsaaad"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-primary-200 underline underline-offset-4"
          >
            Muhammad Saad
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
