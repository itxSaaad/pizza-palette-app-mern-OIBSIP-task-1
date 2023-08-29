import { useEffect, useState } from 'react';
import {
  FaBoxes,
  FaClipboardList,
  FaHome,
  FaPizzaSlice,
  FaUser,
  FaUsers,
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import MainContent from '../components/ui/Admin/Dashboard/MainContent';
import SideBar from '../components/ui/Admin/Dashboard/SideBar';

function AdminDashboardScreen() {
  const menuItems = [
    {
      name: 'Home',
      icon: <FaHome className="mr-2" />,
    },
    {
      name: 'Staff',
      icon: <FaUsers className="mr-2" />,
    },
    {
      name: 'Users',
      icon: <FaUser className="mr-2" />,
    },
    {
      name: 'Pizzas',
      icon: <FaPizzaSlice className="mr-2" />,
    },
    {
      name: 'Orders',
      icon: <FaClipboardList className="mr-2" />,
    },
    {
      name: 'Inventory',
      icon: <FaBoxes className="mr-2" />,
    },
  ];

  const [activeMenuItem, setActiveMenuItem] = useState('Home');
  const [collapsible, setCollapsible] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const { userInfo } = user;

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
    // else {
    //   if (!adminUserInfo) {
    //     navigate('/admin/login');
    //   }
    // dispatch(listUsers({}));
    //   dispatch(listStaff({}));
    //   dispatch(listPizzas({}));
    //   dispatch(listOrders({}));
    // }
    // }, [navigate, dispatch, userInfo]);
  }, [dispatch, userInfo, navigate]);

  const toggleSidebar = () => {
    setCollapsible((prevState) => !prevState);
  };

  const handleMenuItemClick = (name) => {
    setActiveMenuItem(name);
    toggleSidebar();
  };

  return (
    <section className="min-h-screen flex flex-row bg-orange-600 text-white pt-16 sm:pt-20">
      <>
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
      </>
    </section>
  );
}

export default AdminDashboardScreen;
