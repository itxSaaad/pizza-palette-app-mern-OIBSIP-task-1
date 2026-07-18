import { BsChevronDoubleDown } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';

import BGImage from '/images/pizza-jumbo-bg.jpg';

function Jumbotron() {
  return (
    <section
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${BGImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
      }}
      className="min-h-screen flex flex-col justify-center items-center py-12 px-10 sm:px-16 text-white"
    >
      <h1 className="font-display text-5xl font-semibold mb-4 text-center">
        Hand-Stretched. Made to Order.
      </h1>
      <p className="text-xl mb-12 text-center max-w-xl">
        Real dough, real ingredients, made fresh in our kitchen the moment you
        order &mdash; the same way we&apos;ve been doing it since day one.
      </p>
      <Link
        to="/menu"
        className="bg-primary-500 hover:bg-primary-600 transition-all duration-200 text-white font-semibold px-8 py-3 rounded-pill shadow-lg"
      >
        Order Now
      </Link>

      <ScrollLink
        to="featured-pizzas"
        smooth={true}
        spy={true}
        duration={1000}
        className="text-white absolute bottom-0 mb-12 hover:text-primary-300 transition-all duration-200"
      >
        <BsChevronDoubleDown className="text-4xl animate-bounce" />
      </ScrollLink>
    </section>
  );
}

export default Jumbotron;
