import PropTypes from 'prop-types';

import Card from '../../Card';
import Loader from '../../Loader';
import Message from '../../Message';

// Absorbs the loading/error/success/empty-state shell that used to be
// hand-rolled identically across every admin list (OrdersList, UsersList,
// PizzasList, InventoryList, StaffList) — each screen only needs to supply
// its title, current status, and the content to render once loaded.
function AdminListLayout({ title, loading, error, successMessage, isEmpty, emptyLabel, children }) {
  return (
    <div className="w-full p-4">
      <h2 className="font-display text-h2 text-neutral-900 my-2">{title}</h2>
      {loading ? (
        <Loader />
      ) : (
        <>
          {error && <Message>{error}</Message>}
          {successMessage && <Message>{successMessage}</Message>}
          <div className="mt-4">
            {isEmpty ? (
              <Card className="text-center">
                <p className="text-lg font-semibold text-neutral-800">{emptyLabel}</p>
              </Card>
            ) : (
              children
            )}
          </div>
        </>
      )}
    </div>
  );
}

AdminListLayout.propTypes = {
  title: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.bool]),
  successMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.bool]),
  isEmpty: PropTypes.bool.isRequired,
  emptyLabel: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default AdminListLayout;
