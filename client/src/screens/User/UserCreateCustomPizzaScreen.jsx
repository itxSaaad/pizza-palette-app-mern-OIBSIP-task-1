import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Import Thunks
import { createPizza } from '../../redux/asyncThunks/pizzaThunks';
import { listInventory } from '../../redux/asyncThunks/inventoryThunks';
import { addToCart } from '../../redux/slices/cartSlice';

// Import Components
import Button from '../../components/ui/Button';
import Message from '../../components/ui/Message';
import Loader from '../../components/ui/Loader';
import { FaPlus } from 'react-icons/fa';

function UserCreateCustomPizzaScreen() {
  const [name, setName] = useState('Custom Pizza');
  const [description, setDescription] = useState('Custom Pizza');
  const [imageUrl, setImageUrl] = useState(
    'https://www.cicis.com/media/gvedawsa/pepperoni-pizza.png'
  );
  const [size, setSize] = useState('');
  const [price, setPrice] = useState(
    size === 'small'
      ? 10
      : size === 'medium'
      ? 12
      : size === 'large'
      ? 14
      : size === 'extra-large'
      ? 16
      : 0
  );

  const [bases, setBases] = useState([]);
  const [sauces, setSauces] = useState([]);
  const [cheeses, setCheeses] = useState([]);
  const [veggies, setVeggies] = useState([]);
  const [qty, setQty] = useState('');

  const PizzaSizes = ['small', 'medium', 'large', 'extra-large'];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const pizza = useSelector((state) => state.pizza);
  const {
    loading: pizzaLoading,
    pizzaInfo,
    pizzaCreateError,
    pizzaCreateSuccess,
  } = pizza;

  const inventory = useSelector((state) => state.inventory);
  const {
    loading: inventoryLoading,
    inventoryList,
    inventoryListError,
  } = inventory;

  const cart = useSelector((state) => state.cart);
  const { loading: cartLoading, cartAddItemError, cartAddItemSuccess } = cart;

  const handleCreateCustomPizza = (e) => {
    e.preventDefault();

    const pizzaData = {
      name,
      description,
      bases,
      sauces,
      cheeses,
      veggies,
      price,
      size,
      imageUrl,
    };

    dispatch(createPizza(pizzaData));
  };

  useEffect(() => {
    dispatch(listInventory());
  }, [dispatch]);

  useEffect(() => {
    if (pizzaCreateSuccess) {
      dispatch(addToCart({ id: pizzaInfo._id, qty }));
    }
  }, [dispatch, pizzaCreateSuccess, pizzaInfo, qty]);

  useEffect(() => {
    if (cartAddItemSuccess) {
      navigate('/');
    }
  }, [cartAddItemSuccess, navigate]);

  return (
    <section className="min-h-screen flex flex-col justify-center items-center pt-16 pb-6 px-10 sm:px-16">
      <h1 className="text-4xl font-bold text-orange-600 mt-6">
        Create Custom Pizza
      </h1>
      {cartLoading || pizzaLoading || inventoryLoading ? (
        <Loader />
      ) : (
        <div className="w-full mt-6 p-6 rounded-2xl shadow-lg bg-orange-300">
          {(pizzaCreateError || inventoryListError || cartAddItemError) && (
            <Message>
              {pizzaCreateError
                ? pizzaCreateError
                : inventoryListError
                ? inventoryListError
                : cartAddItemError}
            </Message>
          )}

          {(pizzaCreateSuccess || cartAddItemSuccess) && (
            <Message>{pizzaCreateSuccess || cartAddItemSuccess}</Message>
          )}

          <form
            onSubmit={handleCreateCustomPizza}
            className="w-full flex flex-col items-center justify-center gap-3"
          >
            <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3">
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full">
                  <label htmlFor="name" className="sr-only">
                    Pizza Name
                  </label>

                  <input
                    type="text"
                    id="name"
                    value={name}
                    placeholder="Enter Pizza Name"
                    onChange={(e) => setName(e.target.value)}
                    disabled={true}
                    required
                    className="w-full text-orange-600 bg-orange-100 placeholder-orange-300 rounded-md p-4 pr-12 text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="w-full">
                  <label htmlFor="description" className="sr-only">
                    Pizza Description
                  </label>
                  <input
                    type="text"
                    id="description"
                    value={description}
                    placeholder="Enter Pizza Description"
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={true}
                    required
                    className="w-full text-orange-600 bg-orange-100 placeholder-orange-300 rounded-md p-4 pr-12 text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="w-full">
                  <label htmlFor="imageUrl" className="sr-only">
                    Image URL
                  </label>

                  <input
                    type="text"
                    id="imageUrl"
                    value={imageUrl}
                    placeholder="Enter Image URL"
                    onChange={(e) => setImageUrl(e.target.value)}
                    disabled={true}
                    required
                    className="w-full text-orange-600 bg-orange-100 placeholder-orange-300 rounded-md p-4 pr-12 text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="w-full">
                  <label htmlFor="price" className="sr-only">
                    Pizza Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    value={price}
                    placeholder="Enter Pizza Price"
                    onChange={(e) => setPrice(e.target.value)}
                    disabled={true}
                    required
                    className="w-full text-orange-600 bg-orange-100 placeholder-orange-300 rounded-md p-4 pr-12 text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="w-full">
                  <label htmlFor="size" className="sr-only">
                    Pizza Size
                  </label>
                  <select
                    id="size"
                    value={size}
                    onChange={(e) => {
                      setSize(e.target.value);
                      setPrice(
                        e.target.value === 'small'
                          ? 10
                          : e.target.value === 'medium'
                          ? 12
                          : e.target.value === 'large'
                          ? 14
                          : e.target.value === 'extra-large'
                          ? 16
                          : 0
                      );
                    }}
                    required
                    className="w-full text-orange-600 bg-orange-100 placeholder-orange-300 rounded-md p-4 pr-12 text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select Pizza Size</option>
                    {PizzaSizes.map((size) => (
                      <option key={size} value={size}>
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-full">
                  <label htmlFor="qty" className="sr-only">
                    Pizza Quantity
                  </label>
                  <input
                    type="number"
                    id="qty"
                    value={qty}
                    placeholder="Enter Pizza Quantity"
                    onChange={(e) => setQty(e.target.value)}
                    required
                    className="w-full text-orange-600 bg-orange-100 placeholder-orange-300 rounded-md p-4 pr-12 text-sm shadow-sm"
                  />
                </div>
              </div>
              <div className="w-full grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="w-full">
                  {Object.entries(inventoryList).map(([category, items]) => {
                    switch (category) {
                      case 'bases':
                        return (
                          <div
                            key={category}
                            className="w-full flex flex-col items-center justify-center bg-orange-100 rounded-md p-4"
                          >
                            <h1 className="text-xl font-bold text-orange-600">
                              {category.charAt(0).toUpperCase() +
                                category.slice(1)}
                            </h1>
                            <div className="w-full">
                              {items.map((item) => (
                                <label
                                  key={item._id}
                                  htmlFor={item._id}
                                  className="flex items-center justify-start w-full"
                                >
                                  <input
                                    type="checkbox"
                                    className="mr-2"
                                    value={item._id}
                                    name={item._id}
                                    id={item._id}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setBases([...bases, item._id]);
                                      } else {
                                        setBases(
                                          bases.filter(
                                            (base) => base !== item._id
                                          )
                                        );
                                      }
                                    }}
                                  />
                                  <span className="text-orange-600 text-sm">
                                    {item.item}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        );
                    }
                  })}
                </div>
                <div className="w-full">
                  {Object.entries(inventoryList).map(([category, items]) => {
                    switch (category) {
                      case 'sauces':
                        return (
                          <div
                            key={category}
                            className="w-full flex flex-col items-center justify-center bg-orange-100 rounded-md p-4"
                          >
                            <h1 className="text-xl font-bold text-orange-600">
                              {category.charAt(0).toUpperCase() +
                                category.slice(1)}
                            </h1>
                            <div className="w-full">
                              {items.map((item) => (
                                <label
                                  key={item._id}
                                  htmlFor={item._id}
                                  className="flex items-center justify-start w-full"
                                >
                                  <input
                                    type="checkbox"
                                    className="mr-2"
                                    value={item._id}
                                    name={item._id}
                                    id={item._id}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSauces([...sauces, item._id]);
                                      } else {
                                        setSauces(
                                          sauces.filter(
                                            (sauce) => sauce !== item._id
                                          )
                                        );
                                      }
                                    }}
                                  />
                                  <span className="text-orange-600 text-sm">
                                    {item.item}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        );
                    }
                  })}
                </div>
                <div className="w-full">
                  {Object.entries(inventoryList).map(([category, items]) => {
                    switch (category) {
                      case 'cheeses':
                        return (
                          <div
                            key={category}
                            className="w-full flex flex-col items-center justify-center bg-orange-100 rounded-md p-4"
                          >
                            <h1 className="text-xl font-bold text-orange-600">
                              {category.charAt(0).toUpperCase() +
                                category.slice(1)}
                            </h1>
                            <div className="w-full">
                              {items.map((item) => (
                                <label
                                  key={item._id}
                                  htmlFor={item._id}
                                  className="flex items-center justify-start w-full"
                                >
                                  <input
                                    type="checkbox"
                                    className="mr-2"
                                    value={item._id}
                                    name={item._id}
                                    id={item._id}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setCheeses([...cheeses, item._id]);
                                      } else {
                                        setCheeses(
                                          cheeses.filter(
                                            (cheese) => cheese !== item._id
                                          )
                                        );
                                      }
                                    }}
                                  />
                                  <span className="text-orange-600 text-sm">
                                    {item.item}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        );
                    }
                  })}
                </div>
                <div className="w-full">
                  {Object.entries(inventoryList).map(([category, items]) => {
                    switch (category) {
                      case 'veggies':
                        return (
                          <div
                            key={category}
                            className="w-full flex flex-col items-center justify-center bg-orange-100 rounded-md p-4"
                          >
                            <h1 className="text-xl font-bold text-orange-600">
                              {category.charAt(0).toUpperCase() +
                                category.slice(1)}
                            </h1>
                            <div className="w-full">
                              {items.map((item) => (
                                <label
                                  key={item._id}
                                  htmlFor={item._id}
                                  className="flex items-center justify-start w-full"
                                >
                                  <input
                                    type="checkbox"
                                    className="mr-2"
                                    value={item._id}
                                    name={item._id}
                                    id={item._id}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setVeggies([...veggies, item._id]);
                                      } else {
                                        setVeggies(
                                          veggies.filter(
                                            (veggie) => veggie !== item._id
                                          )
                                        );
                                      }
                                    }}
                                  />
                                  <span className="text-orange-600 text-sm">
                                    {item.item}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        );
                    }
                  })}
                </div>
              </div>
            </div>
            <Button
              variant="secondary"
              type="submit"
              className="w-full rounded-full mt-4 inline-flex items-center justify-center"
            >
              <FaPlus className="mr-1" /> Create Pizza
            </Button>
          </form>
        </div>
      )}
    </section>
  );
}

export default UserCreateCustomPizzaScreen;
