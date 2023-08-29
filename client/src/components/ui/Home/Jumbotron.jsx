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
      <h1 className="text-5xl font-semibold mb-4">It&apos;s Pizza Time</h1>
      <p className="text-xl mb-12">
        Craving for a pizza? You are in the right place!
      </p>
      <Link
        to="/menu"
        className="bg-orange-500 hover:bg-orange-600 transition-all duration-200 text-white font-semibold px-8 py-3 rounded-full shadow-lg"
      >
        Order Now
      </Link>

      <ScrollLink
        to="featured-pizzas"
        smooth={true}
        spy={true}
        duration={1000} // Duration of the smooth scroll animation
        className="text-white absolute bottom-0 mb-12 hover:text-orange-500 transition-all duration-200"
      >
        <BsChevronDoubleDown className="text-4xl animate-bounce" />
      </ScrollLink>
    </section>
  );
}

export default Jumbotron;
