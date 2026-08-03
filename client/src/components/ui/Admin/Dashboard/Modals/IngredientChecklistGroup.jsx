import PropTypes from 'prop-types';

import IngredientCard from '../../../PizzaMenu/IngredientCard';
import Card from '../../../Card';

function IngredientChecklistGroup({
  stepNumber,
  title,
  items,
  selectedItems,
  onToggle,
  required = true,
}) {
  return (
    <Card className="border-2 border-primary-200 bg-primary-50">
      <h2 className="font-display text-h3 text-primary-600 mb-4 flex items-center">
        <span className="bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
          {stepNumber}
        </span>
        {title} {required ? '(Required)' : '(Optional)'}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items?.map((item) => (
          <IngredientCard
            key={item._id}
            item={item}
            selected={selectedItems.some((i) => i._id === item._id)}
            onToggle={() => onToggle(item)}
            disabled={item.quantity === 0}
          />
        ))}
      </div>
    </Card>
  );
}

IngredientChecklistGroup.propTypes = {
  stepNumber: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  title: PropTypes.string.isRequired,
  items: PropTypes.array,
  selectedItems: PropTypes.array.isRequired,
  onToggle: PropTypes.func.isRequired,
  required: PropTypes.bool,
};

export default IngredientChecklistGroup;
