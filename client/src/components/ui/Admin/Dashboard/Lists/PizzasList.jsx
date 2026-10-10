import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Import Constants
import { USER_ROLES } from '../../../../../constants';

// Import Thunks
import { deletePizzaById, listPizzas } from '../../../../../redux/asyncThunks/pizzaThunks';

// Import Hooks
import { useEntityListActions } from '../../../../../hooks/useEntityListActions';

// Import Components
import ConfirmDialog from '../../../ConfirmDialog';
import AdminListLayout from '../AdminListLayout';
import GroupedTableSection from '../GroupedTableSection';

function PizzasList() {
  const pizzaColumns = ['_id', 'name', 'price'];

  const dispatch = useDispatch();
  const [page, setPage] = useState(1);

  const pizza = useSelector((state) => state.pizza);
  const {
    loading,
    pizzaList,
    pizzaListPagination,
    pizzaListError,
    pizzaDeleteByIdError,
    pizzaDeleteByIdSuccess,
  } = pizza;

  const { handleDeleteRequest, confirmDialogProps } = useEntityListActions({
    deleteThunk: deletePizzaById,
    refreshThunk: () => listPizzas({ page }),
    entityName: 'pizza',
  });

  const successMessageDelete = pizzaDeleteByIdSuccess && {
    status: '200',
    message: 'Pizza Deleted Successfully!',
  };

  const groups = [
    {
      label: 'Pizzas By Admin',
      data: pizzaList.filter((p) => p.createdBy === USER_ROLES.ADMIN),
      emptyLabel: 'No Pizzas Created By Admin Found..',
    },
    {
      label: 'Custom Pizzas',
      data: pizzaList.filter((p) => p.createdBy === USER_ROLES.USER),
      emptyLabel: 'No Custom Pizzas Found..',
    },
  ];

  useEffect(() => {
    dispatch(listPizzas({ page }));
  }, [dispatch, page]);

  return (
    <>
      <AdminListLayout
        title="All Pizzas"
        loading={loading}
        error={pizzaListError || pizzaDeleteByIdError}
        successMessage={successMessageDelete}
        isEmpty={pizzaList.length === 0}
        emptyLabel="No Pizzas Found.."
      >
        <GroupedTableSection
          groups={groups}
          columns={pizzaColumns}
          handleDelete={handleDeleteRequest}
          pagination={pizzaListPagination}
          onPageChange={setPage}
        />
      </AdminListLayout>
      <ConfirmDialog {...confirmDialogProps} />
    </>
  );
}

export default PizzasList;
