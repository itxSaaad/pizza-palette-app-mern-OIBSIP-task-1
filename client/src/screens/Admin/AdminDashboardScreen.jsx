import { useEffect, useState } from 'react';
import {
  FaBoxes,
  FaClipboardList,
  FaEnvelopeOpenText,
  FaHome,
  FaPizzaSlice,
  FaUser,
  FaUsers,
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Import Constants
import { USER_ROLES } from '../../constants';

// Import Thunks
import { listAdminUsers } from '../../redux/asyncThunks/adminThunks';
import { listAdminInvites } from '../../redux/asyncThunks/inviteThunks';
import { listOrders } from '../../redux/asyncThunks/orderThunks';
import { listPizzas } from '../../redux/asyncThunks/pizzaThunks';
import { listUsers } from '../../redux/asyncThunks/userThunks';
import { listInventory } from '../../redux/asyncThunks/inventoryThunks';

// Import Components
import MainContent from '../../components/ui/Admin/Dashboard/MainContent';
import SideBar from '../../components/ui/Admin/Dashboard/SideBar/SideBar';

function AdminDashboardScreen() {
  const [activeMenuItem, setActiveMenuItem] = useState('Home');
  const [collapsible, setCollapsible] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const { userInfo } = user;

  const admin = useSelector((state) => state.admin);
  const { adminUserInfo } = admin;

  const menuItems = [
    { name: 'Home', icon: <FaHome className="mr-2" /> },
    { name: 'Staff', icon: <FaUsers className="mr-2" /> },
    ...(adminUserInfo?.role === USER_ROLES.ADMIN
      ? [{ name: 'Invites', icon: <FaEnvelopeOpenText className="mr-2" /> }]
      : []),
    { name: 'Users', icon: <FaUser className="mr-2" /> },
    { name: 'Pizzas', icon: <FaPizzaSlice className="mr-2" /> },
    { name: 'Orders', icon: <FaClipboardList className="mr-2" /> },
    { name: 'Inventory', icon: <FaBoxes className="mr-2" /> },
  ];

  const toggleSidebar = () => {
    setCollapsible((prevState) => !prevState);
  };

  const handleMenuItemClick = (name) => {
    setActiveMenuItem(name);
    toggleSidebar();
  };

  useEffect(() => {
    if (!adminUserInfo) {
      navigate('/login');
      return;
    }
    dispatch(listUsers({}));
    dispatch(listAdminUsers({}));
    dispatch(listPizzas({}));
    dispatch(listOrders({}));
    dispatch(listInventory({}));
    if (adminUserInfo.role === USER_ROLES.ADMIN) {
      dispatch(listAdminInvites());
    }
  }, [dispatch, navigate, adminUserInfo]);

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  if (!adminUserInfo) {
    return null;
  }

  return (
    <section className="min-h-screen flex flex-row bg-primary-600 text-white">
      {collapsible && (
        <SideBar
          menuItems={menuItems}
          handleMenuItemClick={handleMenuItemClick}
          activeMenuItem={activeMenuItem}
          collapsible={collapsible}
        />
      )}

      <MainContent
        menuItems={menuItems}
        activeMenuItem={activeMenuItem}
        collapsible={collapsible}
        onToggleSidebar={toggleSidebar}
      />
    </section>
  );
}

export default AdminDashboardScreen;
