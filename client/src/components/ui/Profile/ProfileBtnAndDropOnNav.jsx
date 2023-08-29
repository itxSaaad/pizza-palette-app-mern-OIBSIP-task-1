import PropTypes from 'prop-types';
import { BiSolidDownArrow, BiSolidUserDetail } from 'react-icons/bi';
import { CgLogOut } from 'react-icons/cg';
import { FaUserAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { getUserDetails } from '../../../redux/asyncThunks/userThunks';

function ProfileBtnAndDropOnNav({
  dropIsOpen,
  setDropIsOpen,
  dropdownRef,
  logoutHandler,
}) {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const { userInfo } = user;

  const admin = useSelector((state) => state.admin);
  const { adminUserInfo } = admin;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setDropIsOpen(!dropIsOpen)}
        className="text-black hover:text-orange-500 border-2 border-orange-500 rounded-full inline-flex items-center p-2 focus:outline-none"
      >
        <FaUserAlt />
        <BiSolidDownArrow className="h-3 text-orange-300" />
      </button>
      {dropIsOpen && (
        <div className="absolute right-0 w-48  bg-white border border-gray-300 rounded shadow-lg mt-4">
          {adminUserInfo && (
            <Link
              to="/admin/dashboard"
              onClick={() => {
                setDropIsOpen(!dropIsOpen);
              }}
              className="inline-flex items-center w-full px-4 py-2 text-sm text-left text-orange-500 hover:bg-orange-100"
            >
              <BiSolidUserDetail className="mr-1" />
              Dashboard
            </Link>
          )}
          {userInfo && (
            <Link
              to="/profile" // Replace with the actual profile route
              onClick={() => {
                dispatch(getUserDetails({}));
                setDropIsOpen(!dropIsOpen);
              }}
              className="inline-flex items-center w-full px-4 py-2 text-sm text-left text-orange-500 hover:bg-orange-100"
            >
              <BiSolidUserDetail className="mr-1" />
              Profile
            </Link>
          )}
          <button
            type="button"
            onClick={logoutHandler}
            className="inline-flex items-center w-full px-4 py-2 text-sm text-left text-orange-500 hover:bg-orange-100"
          >
            <CgLogOut className="mr-1" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

ProfileBtnAndDropOnNav.propTypes = {
  dropIsOpen: PropTypes.bool.isRequired,
  setDropIsOpen: PropTypes.func.isRequired,
  dropdownRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  logoutHandler: PropTypes.func.isRequired,
};

export default ProfileBtnAndDropOnNav;
