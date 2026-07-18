import { BsChevronDoubleDown } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';

import BGImage from '/images/pizza-jumbo-bg.jpg';

function Jumbotron() {
  return (
    <section
      style={{
        backgroundImage: `linear-gradient(rgba(26,21,18,0.55), rgba(26,21,18,0.55)), url(${BGImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
      }}
      className="min-h-screen flex flex-col justify-center items-center py-12 px-10 sm:px-16 text-white"
    >
      <h1 className="font-display text-display text-center mb-4">
        It&apos;s Pizza Time
      </h1>
      <p className="text-xl mb-12 text-center">
        Craving for a pizza? You are in the right place!
      </p>
      <Link
        to="/menu"
        className="bg-primary-500 hover:bg-primary-600 transition-all duration-200 text-white font-semibold px-8 py-3 min-h-[44px] rounded-pill shadow-card-lg inline-flex items-center"
      >
        Order Now
      </Link>

      <ScrollLink
        to="featured-pizzas"
        smooth={true}
        spy={true}
        duration={1000}
        className="text-white absolute bottom-0 mb-12 hover:text-primary-300 transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
      >
        <BsChevronDoubleDown className="text-4xl animate-bounce" />
      </ScrollLink>
    </section>
  );
}

export default Jumbotron;
