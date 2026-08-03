import PropTypes from 'prop-types';
import { FaGaugeHigh } from 'react-icons/fa6';

function SideBar({
  menuItems,
  activeMenuItem,
  handleMenuItemClick,
  collapsible,
}) {
  return (
    <div
      className={`bg-primary-700 w-full sm:w-1/6 flex flex-col items-center justify-start shadow-card-lg p-4 transform ${
        collapsible ? 'translate-x-0' : '-translate-x-full'
      } transition-all duration-300 ease-in-out`}
    >
      <h2 className="font-display text-h4 mb-4 flex flex-row items-center text-white">
        <FaGaugeHigh className="mr-2" />
        <span className="hidden md:block">Dashboard</span>
      </h2>

      <nav className="text-sm w-full">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index} className="mb-3">
              <button
                type="button"
                onClick={() => handleMenuItemClick(item.name)}
                className={`flex flex-row items-center justify-center border border-primary-500 text-white w-full px-3 py-2 min-h-[44px] rounded-control text-base hover:font-bold ${
                  activeMenuItem === item.name
                    ? 'bg-primary-900'
                    : 'hover:bg-primary-900'
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
