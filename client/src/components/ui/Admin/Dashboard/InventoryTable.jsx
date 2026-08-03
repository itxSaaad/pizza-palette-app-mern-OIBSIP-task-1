import PropTypes from 'prop-types';

function InventoryTable({ title, items }) {
  return (
    <div className="overflow-x-auto">
      <h2 className="text-lg font-semibold text-neutral-900">
        {title.charAt(0).toUpperCase() + title.slice(1)}
      </h2>
      <table className="bg-primary-500 w-full table-auto border-collapse border-2 border-primary-500 rounded-card text-center overflow-hidden">
        <thead className="bg-primary-500 h-10 uppercase font-bold text-white">
          <tr>
            <th>Stock Item</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody className="bg-primary-100 text-primary-800">
          {items.map((item) => (
            <tr key={item._id}>
              <td className="border border-primary-300 px-4 py-2 sm:px-2 sm:py-1">
                {item.item}
              </td>
              <td className="border border-primary-300 px-4 py-2 sm:px-2 sm:py-1">
                {item.quantity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

InventoryTable.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default InventoryTable;
