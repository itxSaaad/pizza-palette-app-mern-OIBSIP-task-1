import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Import Thunks
import { listInventory } from '../../../../../redux/asyncThunks/inventoryThunks';
import { createPizza, listPizzas } from '../../../../../redux/asyncThunks/pizzaThunks';

// Import Hooks
import { useModalTransition } from '../../../../../hooks/useModalTransition';

// Import Components
import Button from '../../../Button';
import Input from '../../../Input';
import Loader from '../../../Loader';
import Message from '../../../Message';
import Modal from '../../../Modal';
import IngredientChecklistGroup from './IngredientChecklistGroup';

function PizzaCreateModal({ onClose }) {
  const { visible, requestClose } = useModalTransition(onClose);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedBases, setSelectedBases] = useState([]);
  const [selectedSauces, setSelectedSauces] = useState([]);
  const [selectedCheeses, setSelectedCheeses] = useState([]);
  const [selectedVeggies, setSelectedVeggies] = useState([]);

  const dispatch = useDispatch();

  const pizza = useSelector((state) => state.pizza);
  const { loading: pizzaLoading, pizzaInfo, pizzaCreateError, pizzaCreateSuccess } = pizza;

  const inventory = useSelector((state) => state.inventory);
  const {
    loading: inventoryLoading,
    inventoryList,
    inventoryListError,
    inventoryCreateStockError,
  } = inventory;

  const toggleIngredient = (item, selectedItems, setSelectedItems) => {
    const isSelected = selectedItems.some((i) => i._id === item._id);
    if (isSelected) {
      setSelectedItems(selectedItems.filter((i) => i._id !== item._id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleCreatePizza = (e) => {
    e.preventDefault();

    const pizzaData = {
      name,
      description,
      bases: selectedBases.map((item) => item._id),
      sauces: selectedSauces.map((item) => item._id),
      cheeses: selectedCheeses.map((item) => item._id),
      veggies: selectedVeggies.map((item) => item._id),
      price,
      imageUrl,
    };

    dispatch(createPizza(pizzaData));
  };

  useEffect(() => {
    dispatch(listInventory());
  }, [dispatch]);

  useEffect(() => {
    if (pizzaInfo && pizzaCreateSuccess) {
      dispatch(listPizzas({}));
      dispatch(listInventory({}));
      requestClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, pizzaInfo, pizzaCreateSuccess]);

  return (
    <Modal isOpen={visible} onClose={requestClose} title="Create Pizza" size="lg">
      {inventoryLoading || pizzaLoading ? (
        <Loader />
      ) : (
        <>
          {(inventoryListError || inventoryCreateStockError || pizzaCreateError) && (
            <Message>{inventoryListError || inventoryCreateStockError || pizzaCreateError}</Message>
          )}

          <form onSubmit={handleCreatePizza} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                name="name"
                label="Pizza Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                name="description"
                label="Pizza Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <Input
                name="price"
                label="Price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
              <Input
                name="imageUrl"
                label="Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
              />
            </div>

            <IngredientChecklistGroup
              stepNumber={1}
              title="Bases"
              items={inventoryList?.bases}
              selectedItems={selectedBases}
              onToggle={(item) => toggleIngredient(item, selectedBases, setSelectedBases)}
            />
            <IngredientChecklistGroup
              stepNumber={2}
              title="Sauces"
              items={inventoryList?.sauces}
              selectedItems={selectedSauces}
              onToggle={(item) => toggleIngredient(item, selectedSauces, setSelectedSauces)}
            />
            <IngredientChecklistGroup
              stepNumber={3}
              title="Cheeses"
              items={inventoryList?.cheeses}
              selectedItems={selectedCheeses}
              onToggle={(item) => toggleIngredient(item, selectedCheeses, setSelectedCheeses)}
            />
            <IngredientChecklistGroup
              stepNumber={4}
              title="Veggies"
              items={inventoryList?.veggies}
              selectedItems={selectedVeggies}
              onToggle={(item) => toggleIngredient(item, selectedVeggies, setSelectedVeggies)}
              required={false}
            />

            <Button type="submit" variant="primary" fullWidth>
              Create Pizza
            </Button>
          </form>
        </>
      )}
    </Modal>
  );
}

PizzaCreateModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default PizzaCreateModal;
