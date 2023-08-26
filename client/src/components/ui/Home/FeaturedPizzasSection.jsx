function FeaturedPizzasSection() {
  const featuredPizzas = [
    {
      id: 1,
      name: 'Pepperoni Feast',
      description: 'Classic pepperoni pizza with extra cheese.',
      price: 12.99,
      imageUrl: 'https://www.cicis.com/media/gvedawsa/pepperoni-pizza.png',
    },
    {
      id: 2,
      name: 'Margherita Delight',
      description: 'Fresh tomatoes, mozzarella, and basil leaves.',
      price: 10.99,
      imageUrl: 'https://www.cicis.com/media/5jzgsmbq/supreme-pizza.png',
    },
    {
      id: 3,
      name: 'Veggie Supreme',
      description: 'Loaded with a variety of fresh vegetables.',
      price: 11.99,
      imageUrl: 'https://www.cicis.com/media/nctfaewb/veggie-pizza.png',
    },
  ];
  return (
    <section
      id="featured-pizzas"
      className="min-h-screen flex flex-col justify-center items-center py-16 sm:py-12 px-10 sm:px-16"
    >
      <h2 className="text-4xl font-bold text-center mb-8">Featured Pizzas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredPizzas.map((pizza) => (
          <div
            key={pizza.id}
            className="bg-orange-100 rounded-2xl shadow-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-500 ease-in-out"
          >
            <img
              src={pizza.imageUrl}
              alt={pizza.name}
              className="w-full h-48 object-cover p-4 border-b border-orange-200"
            />

            <div className="p-4 flex flex-col justify-between items-start">
              <div className="flex justify-between items-center w-full">
                <h3 className="text-lg font-bold text-black mb-1">
                  {pizza.name}
                </h3>
                <span className="text-2xl font-bold text-orange-500">
                  ${pizza.price}
                </span>
              </div>
              <p className="text-sm text-gray-700">{pizza.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedPizzasSection;
