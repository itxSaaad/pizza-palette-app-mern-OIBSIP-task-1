import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { FaPlusCircle, FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

// Import Thunks
import {
  createStock,
  listInventory,
} from '../../../../../redux/asyncThunks/inventoryThunks';

// Import Components
import Button from '../../../Button';
import Loader from '../../../Loader';
import Message from '../../../Message';

function StockCreateModal({ onClose }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState('');
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [threshold, setThreshold] = useState('');

  const stockTypes = ['Base', 'Sauce', 'Cheese', 'Veggie'];

  const dispatch = useDispatch();

  const inventory = useSelector((state) => state.inventory);
  const { loading, inventoryListError, inventoryCreateStockError } = inventory;

  const handleModalClose = () => {
    setModalVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleCreateStock = (e) => {
    e.preventDefault();

    const stockData = {
      type,
      item,
      price,
      quantity,
      threshold,
    };

    dispatch(createStock(stockData)).then(() => {
      dispatch(listInventory({}));
      handleModalClose();
    });
  };

  useEffect(() => {
    if (onClose) {
      setModalVisible(true);
    }
  }, [onClose]);
  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center z-10 bg-gray-800 bg-opacity-30 p-4 backdrop-filter backdrop-blur-sm transition-opacity duration-200 ${
        modalVisible ? 'opacity-100' : 'opacity-0 delay-150'
      }`}
      onClick={handleModalClose}
    >
      <div
        className="bg-white rounded-2xl p-4 sm:p-6 w-full sm:w-2/3 md:w-1/2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="w-full text-xl text-orange-500 font-bold border-b border-b-orange-400">
            Add a New Stock
          </h2>
          <button
            className="text-red-500 border-2 border-red-500 hover:bg-red-600 hover:text-white rounded-full p-1 ml-10"
            onClick={handleModalClose}
          >
            <FaTimes />
          </button>
        </div>
        <div>
          {loading ? (
            <Loader />
          ) : inventoryListError || inventoryCreateStockError ? (
            <Message>{inventoryListError || inventoryCreateStockError}</Message>
          ) : (
            <div className="flex flex-col items-center justify-center w-full">
              <div className="flex flex-col md:flex-row items-center justify-between space-x-2 my-2">
                <h1 className="text-lg text-black font-bold">
                  Select Stock Type
                </h1>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  {stockTypes.map((type, index) => (
                    <label
                      htmlFor={type}
                      key={index}
                      className="flex flex-row items-center justify-center text-white rounded-full bg-orange-500 p-2"
                    >
                      <input
                        type="radio"
                        name="item"
                        id={type}
                        value={type}
                        className="mr-2"
                        onChange={(e) => setType(e.target.value)}
                        required
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>
              <form
                onSubmit={handleCreateStock}
                className="w-full border border-orange-300 rounded-2xl p-4"
              >
                <p className="text-center text-black text-xl leading-relaxed">
                  Enter Stock Item Details
                </p>

                <div className="w-full grid grid-cols-1 gap-4 md:grid-cols-2 my-2">
                  <div className="w-full">
                    <label htmlFor="item" className="sr-only">
                      Item Name
                    </label>

                    <input
                      type="text"
                      id="item"
                      value={item}
                      placeholder="Enter Item Name"
                      onChange={(e) => setItem(e.target.value)}
                      disabled={loading || type === ''}
                      required
                      className="w-full text-orange-600 bg-orange-100 placeholder-orange-300 rounded-md p-4 pr-12 text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="w-full">
                    <label htmlFor="quantity" className="sr-only">
                      Quantity
                    </label>

                    <input
                      type="number"
                      id="quantity"
                      value={quantity}
                      placeholder="Enter Quantity"
                      onChange={(e) => setQuantity(e.target.value)}
                      disabled={loading || type === ''}
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
                      disabled={loading || type === ''}
                      required
                      className="w-full text-orange-600 bg-orange-100 placeholder-orange-300 rounded-md p-4 pr-12 text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="w-full">
                    <label htmlFor="threshold" className="sr-only">
                      Threshold
                    </label>

                    <input
                      type="number"
                      id="threshold"
                      value={threshold}
                      placeholder="Enter Threshold"
                      onChange={(e) => setThreshold(e.target.value)}
                      disabled={loading || type === ''}
                      required
                      className="w-full text-orange-600 bg-orange-100 placeholder-orange-300 rounded-md p-4 pr-12 text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full rounded-full inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading || type === ''}
                  >
                    <FaPlusCircle className="mr-2" />
                    Add Stock
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

StockCreateModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default StockCreateModal;
