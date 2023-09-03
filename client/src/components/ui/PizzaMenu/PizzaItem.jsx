import Proptypes from 'prop-types';
import { useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';

// Import Components
import AddtoCartButton from '../Cart/AddToCartButton';

function PizzaItem({ pizza }) {
  const [qty, setQty] = useState(1);
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
        <p className="text-sm text-gray-700">
          <span className="font-bold">Size: </span>
          {pizza.size.charAt(0).toUpperCase() + pizza.size.slice(1)}
        </p>
        <div className="flex justify-between items-center w-full space-x-1 mt-2">
          <AddtoCartButton id={pizza._id} qty={qty} />
          <div className="flex justify-between items-center space-x-2">
            <button
              className="text-red-500"
              onClick={() => {
                if (qty > 1) {
                  setQty(qty - 1);
                }
              }}
            >
              <FaMinus />
            </button>
            <p>Qty: {qty}</p>
            <button
              className="text-green-500"
              onClick={() => {
                if (qty < 10) {
                  setQty(qty + 1);
                }
              }}
            >
              <FaPlus />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

PizzaItem.propTypes = {
  pizza: Proptypes.object.isRequired,
};

export default PizzaItem;
