import Proptypes from 'prop-types';

function PizzaItem({ pizza }) {
  return (
    <div
      key={pizza._id}
      className="bg-orange-100 rounded-2xl shadow-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-500 ease-in-out"
    >
      <img
        src={pizza.imageUrl}
        alt={pizza.name}
        className="w-full h-48 object-cover p-4 border-b border-orange-200"
      />

      <div className="p-4 flex flex-col justify-between items-start">
        <div className="flex justify-between items-center w-full">
          <h3 className="text-lg font-bold text-black mb-1">{pizza.name}</h3>
          <span className="text-2xl font-bold text-orange-500">
            ${pizza.price}
          </span>
        </div>
        <p className="text-sm text-gray-700">{pizza.description}</p>
      </div>
    </div>
  );
}

PizzaItem.propTypes = {
  pizza: Proptypes.object.isRequired,
};

export default PizzaItem;
