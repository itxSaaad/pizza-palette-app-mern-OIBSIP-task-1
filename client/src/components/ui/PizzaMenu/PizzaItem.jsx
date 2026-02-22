import Proptypes from 'prop-types';
import { useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';

// Import Constants
import { PIZZA_SIZE_OPTIONS, getPizzaSizeMultiplier } from '../../../constants';

// Import Components
import AddtoCartButton from '../Cart/AddToCartButton';

function PizzaItem({ pizza }) {
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState('medium');
  
  // Calculate price based on selected size
  const calculatePrice = () => {
    const multiplier = getPizzaSizeMultiplier(selectedSize);
    return (pizza.price * multiplier).toFixed(2);
  };
  
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
            ${calculatePrice()}
          </span>
        </div>
        <p className="text-sm text-gray-700">{pizza.description}</p>
        
        {/* SIZE SELECTOR */}
        <div className="w-full mt-2">
          <label className="text-sm font-bold text-gray-700">Size:</label>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="w-full mt-1 p-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
          >
            {PIZZA_SIZE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex justify-between items-center w-full space-x-1 mt-2">
          <AddtoCartButton 
            id={pizza._id} 
            qty={qty} 
            size={selectedSize}
            basePrice={pizza.price}
          />
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
