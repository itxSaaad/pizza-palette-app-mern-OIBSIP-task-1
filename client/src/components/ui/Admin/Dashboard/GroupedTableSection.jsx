import PropTypes from 'prop-types';

import Card from '../../Card';
import SectionHeading from './SectionHeading';
import Table from './Table';

// Replaces the repeated "bucket data into named groups, render a heading +
// Table (or an empty-state Card) per group" pattern that OrdersList,
// PizzasList, and InventoryList each reimplemented.
function GroupedTableSection({ groups, columns, handleDelete, handleChange, columnRenderers }) {
  return (
    <>
      {groups.map(({ label, data, emptyLabel }) => (
        <div className="mb-4" key={label}>
          <SectionHeading>{label}</SectionHeading>
          {data.length > 0 ? (
            <Table
              data={data}
              columns={columns}
              handleDelete={handleDelete}
              handleChange={handleChange}
              columnRenderers={columnRenderers}
            />
          ) : (
            <Card className="text-center mb-4">
              <p className="text-lg font-semibold text-neutral-800">
                {emptyLabel || `No ${label} Found..`}
              </p>
            </Card>
          )}
        </div>
      ))}
    </>
  );
}

GroupedTableSection.propTypes = {
  groups: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      data: PropTypes.array.isRequired,
      emptyLabel: PropTypes.string,
    })
  ).isRequired,
  columns: PropTypes.array.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleChange: PropTypes.func,
  columnRenderers: PropTypes.objectOf(PropTypes.func),
};

export default GroupedTableSection;
