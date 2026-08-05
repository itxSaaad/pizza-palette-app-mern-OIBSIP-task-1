import PropTypes from 'prop-types';
import { FaPlusCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

// Import Constants
import { INVENTORY_TYPES } from '../../../../../constants';

// Import Thunks
import { createStock, listInventory } from '../../../../../redux/asyncThunks/inventoryThunks';

// Import Hooks
import { useModalTransition } from '../../../../../hooks/useModalTransition';
import { useFormState } from '../../../../../hooks/useFormState';

// Import Components
import Button from '../../../Button';
import Input from '../../../Input';
import Loader from '../../../Loader';
import Message from '../../../Message';
import Modal from '../../../Modal';

function StockCreateModal({ onClose }) {
  const { visible, requestClose } = useModalTransition(onClose);
  const { values, handleChange } = useFormState({
    type: '',
    item: '',
    quantity: '',
    price: '',
    threshold: '',
  });
  const { type, item, quantity, price, threshold } = values;

  const dispatch = useDispatch();

  const inventory = useSelector((state) => state.inventory);
  const { loading, inventoryListError, inventoryCreateStockError } = inventory;

  const handleCreateStock = (e) => {
    e.preventDefault();

    const stockData = { type, item, price, quantity, threshold };

    dispatch(createStock(stockData)).then(() => {
      dispatch(listInventory({}));
      requestClose();
    });
  };

  return (
    <Modal isOpen={visible} onClose={requestClose} title="Add a New Stock" size="md">
      {loading ? (
        <Loader />
      ) : inventoryListError || inventoryCreateStockError ? (
        <Message>{inventoryListError || inventoryCreateStockError}</Message>
      ) : (
        <div className="flex flex-col items-center justify-center w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 my-2 w-full">
            <h1 className="text-lg text-neutral-900 font-bold">Select Stock Type</h1>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {INVENTORY_TYPES.map((typeOption, index) => (
                <label
                  htmlFor={typeOption}
                  key={index}
                  className="flex flex-row items-center justify-center text-white rounded-pill bg-primary-500 p-2 min-h-[44px]"
                >
                  <input
                    type="radio"
                    name="type"
                    id={typeOption}
                    value={typeOption}
                    className="mr-2 h-4 w-4 accent-primary-700"
                    onChange={handleChange}
                    required
                  />
                  {typeOption}
                </label>
              ))}
            </div>
          </div>
          <form
            onSubmit={handleCreateStock}
            className="w-full border border-primary-200 rounded-card p-4"
          >
            <p className="text-center text-neutral-900 text-xl leading-relaxed">
              Enter Stock Item Details
            </p>

            <div className="w-full grid grid-cols-1 gap-4 md:grid-cols-2 my-2">
              <Input
                name="item"
                type="text"
                value={item}
                placeholder="Enter Item Name"
                onChange={handleChange}
                disabled={loading || type === ''}
                required
              />
              <Input
                name="quantity"
                type="number"
                value={quantity}
                placeholder="Enter Quantity"
                onChange={handleChange}
                disabled={loading || type === ''}
                required
              />
              <Input
                name="price"
                type="number"
                value={price}
                placeholder="Enter Price"
                onChange={handleChange}
                disabled={loading || type === ''}
                required
              />
              <Input
                name="threshold"
                type="number"
                value={threshold}
                placeholder="Enter Threshold"
                onChange={handleChange}
                disabled={loading || type === ''}
                required
              />
            </div>
            <Button
              type="submit"
              variant="outline"
              fullWidth
              className="inline-flex items-center justify-center"
              disabled={loading || type === ''}
            >
              <FaPlusCircle className="mr-2" />
              Add Stock
            </Button>
          </form>
        </div>
      )}
    </Modal>
  );
}

StockCreateModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default StockCreateModal;
