import PropTypes from 'prop-types';

function IngredientCard({ item, selected, onToggle, disabled = false }) {
  return (
    <label
      className={`flex items-center justify-between p-3 rounded-control cursor-pointer transition-all min-h-[44px] ${
        selected
          ? 'bg-primary-500 text-white shadow-card border-2 border-primary-600'
          : 'bg-neutral-50 text-neutral-700 hover:bg-primary-100 border-2 border-neutral-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className="flex items-center">
        <input
          type="checkbox"
          className="mr-3 w-5 h-5 accent-primary-500"
          checked={selected}
          disabled={disabled}
          onChange={onToggle}
        />
        <div>
          <span className="font-medium">{item.item}</span>
          {disabled && <span className="text-xs ml-2">(Out of stock)</span>}
        </div>
      </div>
      <span className="font-bold">${item.price}</span>
    </label>
  );
}

IngredientCard.propTypes = {
  item: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default IngredientCard;
