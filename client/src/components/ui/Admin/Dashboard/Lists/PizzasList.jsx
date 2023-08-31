import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Import Thunks
import {
  deletePizzaById,
  listPizzas,
} from '../../../../../redux/asyncThunks/pizzaThunks';

// Import Components
import Loader from '../../../Loader';
import Message from '../../../Message';
import Table from '../Table';

function PizzasList() {
  const pizzaColumns = ['_id', 'name', 'price', 'size'];

  const dispatch = useDispatch();

  const pizza = useSelector((state) => state.pizza);
  const {
    loading,
    pizzaList,
    pizzaListError,
    pizzaDeleteByIdError,
    pizzaDeleteByIdSuccess,
  } = pizza;

  const handleDelete = (id) => {
    dispatch(deletePizzaById(id)).then(() => dispatch(listPizzas({})));
  };

  const successMessageDelete = pizzaDeleteByIdSuccess && {
    status: '200',
    message: 'pizza Deleted Successfully!',
  };

  useEffect(() => {
    if (!pizzaList) {
      dispatch(listPizzas({}));
    }
  }, [dispatch, pizzaList]);

  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-bold my-2">All pizzas</h2>
      {loading ? (
        <Loader />
      ) : (
        <>
          {(pizzaListError || pizzaDeleteByIdError) && (
            <Message>{pizzaListError || pizzaDeleteByIdError}</Message>
          )}
          {successMessageDelete && <Message>{successMessageDelete}</Message>}
          <div className="mt-4">
            {pizzaList.length > 0 ? (
              <Table
                data={pizzaList}
                columns={pizzaColumns}
                handleDelete={handleDelete}
              />
            ) : (
              <h2 className="text-white text-xl text-center rounded-md border-2 border-orange-400 font-semibold mb-2 p-4">
                No Pizzas Found..
              </h2>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default PizzasList;
