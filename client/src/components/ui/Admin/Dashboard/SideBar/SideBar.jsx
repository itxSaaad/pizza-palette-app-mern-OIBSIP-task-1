import PropTypes from 'prop-types';

function SideBar({
  menuItems,
  activeMenuItem,
  handleMenuItemClick,
  collapsible,
}) {
  return (
    <div
      className={`bg-orange-700 w-full sm:w-1/6 flex flex-col items-center justify-start shadow-md pt-16 sm:pt-20 p-4 transform ${
        collapsible ? 'translate-x-0' : '-translate-x-full'
      } transition-all duration-300 ease-in-out`}
    >
      <h2 className="text-xl font-semibold mb-4 flex flex-row items-center">
        <i className="fas fa-gauge-high mr-2"></i>
        <span className="hidden md:block">Dashboard</span>
      </h2>

      <nav className="text-sm w-full">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index} className="mb-3">
              <button
                onClick={() => handleMenuItemClick(item.name)}
                className={`flex flex-row items-center justify-center border border-orange-600 text-white w-full px-3 py-2 rounded-md text-base hover:font-bold ${
                  activeMenuItem === item.name
                    ? 'bg-orange-900'
                    : 'hover:bg-orange-900'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

SideBar.propTypes = {
  menuItems: PropTypes.array.isRequired,
  activeMenuItem: PropTypes.string.isRequired,
  handleMenuItemClick: PropTypes.func.isRequired,
  collapsible: PropTypes.bool.isRequired,
};

export default SideBar;
