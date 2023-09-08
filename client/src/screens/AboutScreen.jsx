import React from 'react';
import Logo from '/android-chrome-512x512.png';

function AboutScreen() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center pt-20 pb-10 px-10 sm:px-16 bg-gradient-to-b from-orange-200 to-orange-100">
      <div className="flex flex-row justify-center items-center">
        <img
          src={Logo}
          alt="Pizza Palette Logo"
          className="hidden sm:block h-32 w-32"
        />
        <h1 className="text-4xl lg:text-5xl text-orange-500 font-semibold mt-4">
          <span className="text-orange-700">About</span>
          <br /> Pizza Palette
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <article className="mb-4">
          <h2 className="text-2xl text-black font-semibold mb-2">
            Introduction
          </h2>
          <p className="text-gray-800 text-lg leading-relaxed">
            Pizza Palette is a pizza ordering app that allows you to create your
            own custom pizza. You can choose from a variety of toppings and
            sauces to create your dream pizza. You can also choose from a
            selection of pre-made pizzas.
          </p>
        </article>

        <article className="mb-4">
          <h2 className="text-2xl text-black font-semibold mb-2">
            Our Mission
          </h2>
          <p className="text-gray-800 text-lg leading-relaxed">
            Our mission is to provide you with the best pizza ordering
            experience. We want to make it easy for you to order your favorite
            pizza. We also want to make it easy for you to create your own
            custom pizza.
          </p>
        </article>

        <article className="mb-4">
          <h2 className="text-2xl text-black font-semibold mb-2">Contact Us</h2>
          <p className="text-gray-800 text-lg leading-relaxed">
            If you have any questions or concerns, please contact us at{' '}
            <a
              href="mailto:contact@pizzapalette.com"
              className="text-orange-500 hover:text-orange-700"
            >
              contact@pizzapalette.com
            </a>
          </p>
        </article>
      </div>
    </section>
  );
}

export default AboutScreen;
