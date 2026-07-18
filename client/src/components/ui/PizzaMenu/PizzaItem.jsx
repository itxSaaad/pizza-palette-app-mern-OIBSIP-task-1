import Proptypes from 'prop-types';
import { useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';

// Import Constants
import { PIZZA_SIZE_OPTIONS, getPizzaSizeMultiplier } from '../../../constants';

// Import Components
import Card from '../Card';
import AddtoCartButton from '../Cart/AddToCartButton';

function PizzaItem({ pizza }) {
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState('medium');

  const calculatePrice = () => {
    const multiplier = getPizzaSizeMultiplier(selectedSize);
    return (pizza.price * multiplier).toFixed(2);
  };

  return (
    <Card
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
            ${calculatePrice()}
          </span>
        </div>
        <p className="text-sm text-neutral-600">{pizza.description}</p>

        {/* SIZE SELECTOR */}
        <div className="w-full mt-2">
          <label className="text-sm font-bold text-neutral-700">Size:</label>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="w-full mt-1 p-2 min-h-[44px] border border-neutral-200 rounded-control focus:outline-none focus:ring-2 focus:ring-primary-300 bg-neutral-50"
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
          <div className="flex justify-between items-center space-x-1">
            <button
              type="button"
              className="text-error-500 hover:text-error-600 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-control"
              onClick={() => {
                if (qty > 1) {
                  setQty(qty - 1);
                }
              }}
              aria-label="Decrease quantity"
            >
              <FaMinus />
            </button>
            <p className="text-neutral-800">Qty: {qty}</p>
            <button
              type="button"
              className="text-accent-green-600 hover:text-accent-green-700 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-control"
              onClick={() => {
                if (qty < 10) {
                  setQty(qty + 1);
                }
              }}
              aria-label="Increase quantity"
            >
              <FaPlus />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

PizzaItem.propTypes = {
  pizza: Proptypes.object.isRequired,
};

export default PizzaItem;
