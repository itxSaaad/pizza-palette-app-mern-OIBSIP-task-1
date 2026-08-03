import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Import Constants
import { USER_ROLES } from '../../../../../constants';

// Import Thunks
import {
  deletePizzaById,
  listPizzas,
} from '../../../../../redux/asyncThunks/pizzaThunks';

// Import Hooks
import { useEntityListActions } from '../../../../../hooks/useEntityListActions';

// Import Components
import Card from '../../../Card';
import ConfirmDialog from '../../../ConfirmDialog';
import Loader from '../../../Loader';
import Message from '../../../Message';
import Table from '../Table';

function PizzasList() {
  const pizzaColumns = ['_id', 'name', 'price'];

  const dispatch = useDispatch();

  const pizza = useSelector((state) => state.pizza);
  const {
    loading,
    pizzaList,
    pizzaListError,
    pizzaDeleteByIdError,
    pizzaDeleteByIdSuccess,
  } = pizza;

  const { handleDeleteRequest, confirmDialogProps } = useEntityListActions({
    deleteThunk: deletePizzaById,
    refreshThunk: () => listPizzas({}),
    entityName: 'pizza',
  });

  const successMessageDelete = pizzaDeleteByIdSuccess && {
    status: '200',
    message: 'Pizza Deleted Successfully!',
  };

  const PizzaByAdmin = pizzaList.filter((pizza) => pizza.createdBy === USER_ROLES.ADMIN);
  const customPizzas = pizzaList.filter((pizza) => pizza.createdBy === USER_ROLES.USER);

  useEffect(() => {
    if (!pizzaList) {
      dispatch(listPizzas({}));
    }
  }, [dispatch, pizzaList]);

  return (
    <div className="w-full p-4">
      <h2 className="font-display text-h2 text-neutral-900 my-2">All Pizzas</h2>
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
                    <h1 className="text-3xl text-center font-bold border-b-2 border-primary-900 p-1 my-2 text-neutral-900">
                      Pizzas By Admin
                    </h1>
                    <Table
                      data={PizzaByAdmin}
                      columns={pizzaColumns}
                      handleDelete={handleDeleteRequest}
                    />
                  </div>
                ) : (
                  <Card className="text-center mb-4">
                    <p className="text-lg font-semibold text-neutral-800">
                      No Pizzas Created By Admin Found..
                    </p>
                  </Card>
                )}
                {customPizzas.length > 0 ? (
                  <div className="mb-4">
                    <h1 className="text-3xl text-center font-bold border-b-2 border-primary-900 p-1 my-2 text-neutral-900">
                      Custom Pizzas
                    </h1>
                    <Table
                      data={customPizzas}
                      columns={pizzaColumns}
                      handleDelete={handleDeleteRequest}
                    />
                  </div>
                ) : (
                  <Card className="text-center mb-4">
                    <p className="text-lg font-semibold text-neutral-800">
                      No Custom Pizzas Found..
                    </p>
                  </Card>
                )}
              </>
            ) : (
              <Card className="text-center">
                <p className="text-lg font-semibold text-neutral-800">
                  No Pizzas Found..
                </p>
              </Card>
            )}
          </div>
        </>
      )}
      <ConfirmDialog {...confirmDialogProps} />
    </div>
  );
}

export default PizzasList;
