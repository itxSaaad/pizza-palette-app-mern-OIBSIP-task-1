import React from 'react';

function HomeScreen() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-cneter py-12 px-16">
      <h1 className="text-4xl text-center font-bold text-gray-800">
        Pizza Palette!
      </h1>
      <p className="text-xl text-center font-semibold text-gray-600">
        Order your favorite pizza now!
      </p>
    </section>
  );
}

export default HomeScreen;
