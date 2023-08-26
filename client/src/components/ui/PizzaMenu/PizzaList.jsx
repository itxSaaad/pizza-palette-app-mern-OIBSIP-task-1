import PropTypes, { object } from 'prop-types';
import PizzaItem from './PizzaItem';

function PizzaList({ pizzaList }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {pizzaList.map((pizza) => (
        <PizzaItem key={pizza._id} pizza={pizza} />
      ))}
    </div>
  );
}

PizzaList.propTypes = {
  pizzaList: PropTypes.arrayOf(object).isRequired,
};

export default PizzaList;
