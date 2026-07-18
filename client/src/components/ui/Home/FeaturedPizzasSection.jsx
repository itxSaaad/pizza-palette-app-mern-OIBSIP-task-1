import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { USER_ROLES } from '../../../constants';
import { listPizzas } from '../../../redux/asyncThunks/pizzaThunks';
import Card from '../Card';
import Loader from '../Loader';

function FeaturedPizzasSection() {
  const dispatch = useDispatch();

  const pizza = useSelector((state) => state.pizza);
  const { loading, pizzaList } = pizza;

  useEffect(() => {
    if (!pizzaList || pizzaList.length < 1) {
      dispatch(listPizzas({}));
    }
  }, [dispatch, pizzaList]);

  const featuredPizzas = (pizzaList || [])
    .filter((p) => p.createdBy === USER_ROLES.ADMIN)
    .slice(0, 3);

  return (
    <section
      id="featured-pizzas"
      className="min-h-screen flex flex-col justify-center items-center py-16 sm:py-12 px-10 sm:px-16"
    >
      <h2 className="font-display text-h2 text-center mb-8 text-neutral-900">
        Featured Pizzas
      </h2>
      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPizzas.map((pizza) => (
            <Card
              key={pizza._id}
              padding="none"
              className="overflow-hidden hover:scale-105 transition-transform duration-500 ease-in-out"
            >
              <img
                src={pizza.imageUrl}
                alt={pizza.name}
                className="w-full h-48 object-cover p-4 border-b border-neutral-100"
              />
              <div className="p-4 flex flex-col justify-between items-start">
                <div className="flex justify-between items-center w-full">
                  <h3 className="text-lg font-bold text-neutral-900 mb-1">
                    {pizza.name}
                  </h3>
                  <span className="text-2xl font-bold text-primary-600">
                    ${pizza.price}
                  </span>
                </div>
                <p className="text-sm text-neutral-600">{pizza.description}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

export default FeaturedPizzasSection;
