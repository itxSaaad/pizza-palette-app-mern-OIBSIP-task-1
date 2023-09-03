import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

// Import Thunks
import { listInventory } from '../../../../../redux/asyncThunks/inventoryThunks';
import {
  createPizza,
  listPizzas,
} from '../../../../../redux/asyncThunks/pizzaThunks';

// Import Components
import Button from '../../../Button';
import Loader from '../../../Loader';
import Message from '../../../Message';

function PizzaCreateModal({ onClose }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [bases, setBases] = useState([]);
  const [sauces, setSauces] = useState([]);
  const [cheeses, setCheeses] = useState([]);
  const [veggies, setVeggies] = useState([]);
  const [price, setPrice] = useState('');
  const [size, setSize] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const PizzaSizes = ['small', 'medium', 'large', 'extra-large'];

  const dispatch = useDispatch();

  const pizza = useSelector((state) => state.pizza);
  const {
    loading: pizzaLoading,
    pizzaInfo,
    pizzaCreateError,
    pizzaCreateSuccess,
  } = pizza;

  const inventory = useSelector((state) => state.inventory);
  const {
    loading,
    inventoryList,
    inventoryListError,
    inventoryCreateStockError,
  } = inventory;

  const handleModalClose = () => {
    setModalVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleCreatePizza = (e) => {
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
    if (pizzaInfo && pizzaCreateSuccess) {
      dispatch(listPizzas({}));
      dispatch(listInventory({}));
      setModalVisible(false);
      setTimeout(() => {
        onClose();
      }, 300);
    }

    if (onClose) {
      setModalVisible(true);
    }
  }, [dispatch, onClose, pizzaInfo, pizzaCreateSuccess]);
  return (
    <div
      className={`fixed inset-0 flex items-center h-screen justify-center z-10 bg-gray-800 bg-opacity-30 p-4 backdrop-filter backdrop-blur-sm transition-opacity duration-200 ${
        modalVisible ? 'opacity-100' : 'opacity-0 delay-150'
      }`}
      onClick={handleModalClose}
    >
      <div
        className="bg-white rounded-2xl p-4 sm:p-6 w-full sm:w-2/3 md:w-1/2 h-3/4 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="w-full text-xl text-orange-500 font-bold border-b border-b-orange-400">
            Create Pizza
          </h2>

          <button
            className="text-red-500 border-2 border-red-500 hover:bg-red-600 hover:text-white rounded-full p-1 ml-10"
            onClick={handleModalClose}
          >
            <FaTimes />
          </button>
        </div>
        <div>
          {loading || pizzaLoading ? (
            <Loader />
          ) : inventoryListError ||
            inventoryCreateStockError ||
            pizzaCreateError ? (
            <Message>
              {inventoryListError ||
                inventoryCreateStockError ||
                pizzaCreateError}
            </Message>
          ) : (
            <div className="flex flex-col items-center justify-center w-full">
              <form
                onSubmit={handleCreatePizza}
                className="w-full flex flex-col items-center justify-center gap-3"
              >
                <div className="w-full grid grid-cols-1 gap-4 md:grid-cols-2">
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
                      disabled={loading}
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
                      disabled={loading}
                      required
                      className="w-full text-orange-600 bg-orange-100 placeholder-orange-300 rounded-md p-4 pr-12 text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="w-full">
                    <label htmlFor="price" className="sr-only">
                      Price
                    </label>
                    <input
                      type="number"
                      id="price"
                      value={price}
                      placeholder="Enter Price"
                      onChange={(e) => setPrice(e.target.value)}
                      disabled={loading}
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
                      disabled={loading}
                      required
                      className="w-full text-orange-600 bg-orange-100 placeholder-orange-300 rounded-md p-4 pr-12 text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
                <div className="w-full flex flex-col items-center justify-center bg-orange-100 rounded-md p-4">
                  <h1 className="text-xl font-bold text-orange-300">Size</h1>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    {PizzaSizes.map((size, index) => (
                      <label
                        key={index}
                        htmlFor={size}
                        className="flex flex-row items-center justify-center text-white rounded-full bg-orange-500 p-2"
                      >
                        <input
                          type="radio"
                          className="mr-2"
                          name="size"
                          id={size}
                          value={size}
                          onChange={(e) => setSize(e.target.value)}
                          required
                        />
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="w-full flex flex-wrap items-start justify-center gap-4">
                  <div className="w-full sm:w-auto">
                    {Object.entries(inventoryList).map(([category, items]) => {
                      switch (category) {
                        case 'bases':
                          return (
                            <div
                              key={category}
                              className="w-full flex flex-col items-center justify-center bg-orange-100 rounded-md p-4"
                            >
                              <h1 className="text-xl font-bold text-orange-300">
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
                  <div className="w-full sm:w-auto">
                    {Object.entries(inventoryList).map(([category, items]) => {
                      switch (category) {
                        case 'sauces':
                          return (
                            <div
                              key={category}
                              className="w-full flex flex-col items-center justify-center bg-orange-100 rounded-md p-4"
                            >
                              <h1 className="text-xl font-bold text-orange-300">
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
                  <div className="w-full sm:w-auto">
                    {Object.entries(inventoryList).map(([category, items]) => {
                      switch (category) {
                        case 'cheeses':
                          return (
                            <div
                              key={category}
                              className="w-full flex flex-col items-center justify-center bg-orange-100 rounded-md p-4"
                            >
                              <h1 className="text-xl font-bold text-orange-300">
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
                  <div className="w-full sm:w-auto">
                    {Object.entries(inventoryList).map(([category, items]) => {
                      switch (category) {
                        case 'veggies':
                          return (
                            <div
                              key={category}
                              className="w-full flex flex-col items-center justify-center bg-orange-100 rounded-md p-4"
                            >
                              <h1 className="text-xl font-bold text-orange-300">
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

                <Button
                  variant="outline"
                  type="submit"
                  className="w-full rounded-full mt-4 inline-flex items-center justify-center"
                >
                  <FaPlus className="mr-1" /> Create Pizza
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

PizzaCreateModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default PizzaCreateModal;
