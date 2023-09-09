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

  const PizzaByAdmin = pizzaList.filter((pizza) => pizza.createdBy === 'admin');
  const customPizzas = pizzaList.filter((pizza) => pizza.createdBy === 'user');

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
              <>
                {PizzaByAdmin.length > 0 ? (
                  <div className="mb-4">
                    <h1 className="text-3xl text-center font-bold border-b-2 border-orange-900 p-1 my-2">
                      Pizzas By Admin
                    </h1>
                    <Table
                      data={PizzaByAdmin}
                      columns={pizzaColumns}
                      handleDelete={handleDelete}
                    />
                  </div>
                ) : (
                  <h2 className="text-white text-xl text-center rounded-md border-2 border-orange-400 font-semibold mb-2 p-4">
                    No Pizzas Created By Admin Found..
                  </h2>
                )}
                {customPizzas.length > 0 ? (
                  <div className="mb-4">
                    <h1 className="text-3xl text-center font-bold border-b-2 border-orange-900 p-1 my-2">
                      Custom Pizzas
                    </h1>
                    <Table
                      data={customPizzas}
                      columns={pizzaColumns}
                      handleDelete={handleDelete}
                    />
                  </div>
                ) : (
                  <h2 className="text-white text-xl text-center rounded-md border-2 border-orange-400 font-semibold mb-2 p-4">
                    No Custom Pizzas Found..
                  </h2>
                )}
              </>
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
