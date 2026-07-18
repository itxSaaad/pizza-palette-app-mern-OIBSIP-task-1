import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

// Import Thunks
import { createPizza } from '../../redux/asyncThunks/pizzaThunks';
import { listInventory } from '../../redux/asyncThunks/inventoryThunks';
import { addToCart } from '../../redux/slices/cartSlice';

// Import Components
import Button from '../../components/ui/Button';
import IngredientCard from '../../components/ui/PizzaMenu/IngredientCard';
import Message from '../../components/ui/Message';
import Loader from '../../components/ui/Loader';

// Import Constants
import { PIZZA_SIZE_OPTIONS, getPizzaSizeMultiplier } from '../../constants';

function UserCreateCustomPizzaScreen() {
  const [name, setName] = useState('Custom Pizza');
  const [description, setDescription] = useState('My Custom Pizza');
  const [imageUrl, setImageUrl] = useState('/images/pizza.png');
  const [size, setSize] = useState('medium');
  const [selectedBases, setSelectedBases] = useState([]);
  const [selectedSauces, setSelectedSauces] = useState([]);
  const [selectedCheeses, setSelectedCheeses] = useState([]);
  const [selectedVeggies, setSelectedVeggies] = useState([]);
  const [qty, setQty] = useState(1);
  const [validationError, setValidationError] = useState('');
  const addedToCartRef = useRef(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const pizza = useSelector((state) => state.pizza);
  const { loading: pizzaLoading, pizzaInfo, pizzaCreateError, pizzaCreateSuccess } = pizza;

  const inventory = useSelector((state) => state.inventory);
  const { loading: inventoryLoading, inventoryList, inventoryListError } = inventory;

  const cart = useSelector((state) => state.cart);
  const { loading: cartLoading, cartAddItemError, cartAddItemSuccess } = cart;

  const calculateBasePrice = () => {
    const basePrice =
      selectedBases.reduce((sum, item) => sum + (item.price || 0), 0) +
      selectedSauces.reduce((sum, item) => sum + (item.price || 0), 0) +
      selectedCheeses.reduce((sum, item) => sum + (item.price || 0), 0) +
      selectedVeggies.reduce((sum, item) => sum + (item.price || 0), 0);

    return basePrice;
  };

  const calculateTotalPrice = () => {
    const multiplier = getPizzaSizeMultiplier(size);
    return (calculateBasePrice() * multiplier).toFixed(2);
  };

  const handleIngredientToggle = (item, selectedItems, setSelectedItems) => {
    const isSelected = selectedItems.some((i) => i._id === item._id);
    if (isSelected) {
      setSelectedItems(selectedItems.filter((i) => i._id !== item._id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleCreateCustomPizza = (e) => {
    e.preventDefault();

    if (selectedBases.length === 0) {
      setValidationError('Please select at least one base');
      return;
    }

    if (selectedSauces.length === 0) {
      setValidationError('Please select at least one sauce');
      return;
    }

    if (selectedCheeses.length === 0) {
      setValidationError('Please select at least one cheese');
      return;
    }

    if (!size) {
      setValidationError('Please select a pizza size');
      return;
    }

    setValidationError('');

    const pizzaData = {
      name,
      description,
      bases: selectedBases.map((item) => item._id),
      sauces: selectedSauces.map((item) => item._id),
      cheeses: selectedCheeses.map((item) => item._id),
      veggies: selectedVeggies.map((item) => item._id),
      price: parseFloat(calculateTotalPrice()),
      imageUrl,
    };

    dispatch(createPizza(pizzaData));
  };

  useEffect(() => {
    dispatch(listInventory());
  }, [dispatch]);

  useEffect(() => {
    if (pizzaCreateSuccess && pizzaInfo && !addedToCartRef.current) {
      addedToCartRef.current = true;
      const multiplier = getPizzaSizeMultiplier(size);
      const calculatedPrice = parseFloat((calculateBasePrice() * multiplier).toFixed(2));

      dispatch(
        addToCart({
          id: pizzaInfo._id,
          qty,
          size,
          calculatedPrice,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, pizzaCreateSuccess, pizzaInfo, qty, size]);

  useEffect(() => {
    if (cartAddItemSuccess) {
      navigate('/menu');
    }
  }, [cartAddItemSuccess, navigate]);

  return (
    <section className="min-h-screen flex flex-col justify-center items-center pb-6 px-4 sm:px-8 bg-neutral-50">
      <div className="w-full max-w-7xl">
        <h1 className="font-display text-h1 text-primary-600 text-center">
          Create Your Custom Pizza
        </h1>
        <p className="text-neutral-600 mt-2 text-center">
          Build your perfect pizza by selecting ingredients
        </p>

        {cartLoading || pizzaLoading || inventoryLoading ? (
          <Loader />
        ) : (
          <div className="mt-6">
            {(pizzaCreateError || inventoryListError || cartAddItemError) && (
              <Message>{pizzaCreateError || inventoryListError || cartAddItemError}</Message>
            )}

            {validationError && <Message variant="warning">{validationError}</Message>}

            <form
              onSubmit={handleCreateCustomPizza}
              className="w-full flex flex-col lg:flex-row items-start gap-6"
            >
              <div className="w-full lg:w-2/3 space-y-4">
                <div className="bg-primary-50 rounded-card p-6 border-2 border-primary-200">
                  <h2 className="font-display text-h3 text-primary-600 mb-4 flex items-center">
                    <span className="bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                      1
                    </span>
                    Choose Your Base (Required)
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {inventoryList?.bases?.map((item) => (
                      <IngredientCard
                        key={item._id}
                        item={item}
                        selected={selectedBases.some((b) => b._id === item._id)}
                        onToggle={() =>
                          handleIngredientToggle(item, selectedBases, setSelectedBases)
                        }
                        disabled={item.quantity === 0}
                      />
                    ))}
                  </div>
                </div>

                <div className="bg-primary-50 rounded-card p-6 border-2 border-primary-200">
                  <h2 className="font-display text-h3 text-primary-600 mb-4 flex items-center">
                    <span className="bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                      2
                    </span>
                    Choose Your Sauce (Required)
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {inventoryList?.sauces?.map((item) => (
                      <IngredientCard
                        key={item._id}
                        item={item}
                        selected={selectedSauces.some((s) => s._id === item._id)}
                        onToggle={() =>
                          handleIngredientToggle(item, selectedSauces, setSelectedSauces)
                        }
                        disabled={item.quantity === 0}
                      />
                    ))}
                  </div>
                </div>

                <div className="bg-primary-50 rounded-card p-6 border-2 border-primary-200">
                  <h2 className="font-display text-h3 text-primary-600 mb-4 flex items-center">
                    <span className="bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                      3
                    </span>
                    Choose Your Cheese (Required)
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {inventoryList?.cheeses?.map((item) => (
                      <IngredientCard
                        key={item._id}
                        item={item}
                        selected={selectedCheeses.some((c) => c._id === item._id)}
                        onToggle={() =>
                          handleIngredientToggle(item, selectedCheeses, setSelectedCheeses)
                        }
                        disabled={item.quantity === 0}
                      />
                    ))}
                  </div>
                </div>

                <div className="bg-primary-50 rounded-card p-6 border-2 border-primary-200">
                  <h2 className="font-display text-h3 text-primary-600 mb-4 flex items-center">
                    <span className="bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                      4
                    </span>
                    Choose Your Veggies (Optional)
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {inventoryList?.veggies?.map((item) => (
                      <IngredientCard
                        key={item._id}
                        item={item}
                        selected={selectedVeggies.some((v) => v._id === item._id)}
                        onToggle={() =>
                          handleIngredientToggle(item, selectedVeggies, setSelectedVeggies)
                        }
                        disabled={item.quantity === 0}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-primary-50 rounded-card p-6 border-2 border-primary-200">
                    <h2 className="text-xl font-bold text-primary-600 mb-3">5. Choose Size</h2>
                    <select
                      id="size"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      required
                      className="w-full min-h-[44px] text-primary-600 bg-neutral-50 border-2 border-primary-200 rounded-control p-4 text-sm shadow-card-sm focus:ring-2 focus:ring-primary-400"
                    >
                      <option value="">Select Pizza Size</option>
                      {PIZZA_SIZE_OPTIONS.map((sizeOption) => (
                        <option key={sizeOption.value} value={sizeOption.value}>
                          {sizeOption.label} - {sizeOption.multiplier}x price
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-primary-50 rounded-card p-6 border-2 border-primary-200">
                    <h2 className="text-xl font-bold text-primary-600 mb-3">6. Quantity</h2>
                    <input
                      type="number"
                      id="qty"
                      min="1"
                      value={qty}
                      placeholder="Enter Quantity"
                      onChange={(e) => setQty(parseInt(e.target.value) || 1)}
                      required
                      className="w-full min-h-[44px] text-primary-600 bg-neutral-50 border-2 border-primary-200 rounded-control p-4 text-sm shadow-card-sm focus:ring-2 focus:ring-primary-400"
                    />
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-1/3 lg:sticky lg:top-24">
                <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-card p-6 shadow-card-lg">
                  <h2 className="font-display text-h3 mb-4 border-b border-primary-400 pb-2">
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6">
                    {selectedBases.length > 0 && (
                      <div>
                        <p className="font-bold text-primary-100 mb-1">Bases:</p>
                        <ul className="space-y-1">
                          {selectedBases.map((item) => (
                            <li key={item._id} className="flex justify-between text-sm">
                              <span>{item.item}</span>
                              <span>${item.price}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedSauces.length > 0 && (
                      <div>
                        <p className="font-bold text-primary-100 mb-1">Sauces:</p>
                        <ul className="space-y-1">
                          {selectedSauces.map((item) => (
                            <li key={item._id} className="flex justify-between text-sm">
                              <span>{item.item}</span>
                              <span>${item.price}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedCheeses.length > 0 && (
                      <div>
                        <p className="font-bold text-primary-100 mb-1">Cheeses:</p>
                        <ul className="space-y-1">
                          {selectedCheeses.map((item) => (
                            <li key={item._id} className="flex justify-between text-sm">
                              <span>{item.item}</span>
                              <span>${item.price}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedVeggies.length > 0 && (
                      <div>
                        <p className="font-bold text-primary-100 mb-1">Veggies:</p>
                        <ul className="space-y-1">
                          {selectedVeggies.map((item) => (
                            <li key={item._id} className="flex justify-between text-sm">
                              <span>{item.item}</span>
                              <span>${item.price}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="border-t border-primary-400 pt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Base Price:</span>
                        <span className="font-bold">${calculateBasePrice().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Size:</span>
                        <span className="font-bold">
                          {size ? size.charAt(0).toUpperCase() + size.slice(1) : 'Not selected'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Size Multiplier:</span>
                        <span className="font-bold">{getPizzaSizeMultiplier(size)}x</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Quantity:</span>
                        <span className="font-bold">{qty}</span>
                      </div>
                    </div>

                    <div className="border-t border-primary-400 pt-3 mt-3">
                      <div className="flex justify-between items-center text-2xl font-bold">
                        <span>Total Price:</span>
                        <span>${calculateTotalPrice()}</span>
                      </div>
                      {qty > 1 && (
                        <p className="text-sm text-primary-100 mt-1">
                          ${calculateTotalPrice()} per pizza
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="secondary"
                    type="submit"
                    disabled={
                      selectedBases.length === 0 ||
                      selectedSauces.length === 0 ||
                      selectedCheeses.length === 0 ||
                      !size
                    }
                    className="w-full rounded-pill inline-flex items-center justify-center py-3 font-bold shadow-card-lg"
                  >
                    <FaPlus className="mr-2" /> Add to Cart
                  </Button>

                  {(selectedBases.length === 0 ||
                    selectedSauces.length === 0 ||
                    selectedCheeses.length === 0) && (
                    <p className="text-primary-100 text-sm mt-2 text-center">
                      Please select required ingredients
                    </p>
                  )}
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}

export default UserCreateCustomPizzaScreen;
