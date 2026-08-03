import PropTypes from 'prop-types';
import { BiSolidDownArrow, BiSolidUserDetail } from 'react-icons/bi';
import { CgLogOut } from 'react-icons/cg';
import { FaUserAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { getUserDetails } from '../../../redux/asyncThunks/userThunks';

function ProfileBtnAndDropOnNav({ dropIsOpen, setDropIsOpen, dropdownRef, logoutHandler }) {
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
        className="text-neutral-900 hover:text-primary-600 border-2 border-primary-500 rounded-full inline-flex items-center justify-center p-2 min-h-[44px] min-w-[44px] focus:outline-none"
        aria-label="Account menu"
      >
        <FaUserAlt />
        <BiSolidDownArrow className="h-3 text-primary-300 ml-1" />
      </button>
      {dropIsOpen && (
        <div className="absolute right-0 w-48 bg-neutral-50 border border-neutral-200 rounded-card shadow-card-lg mt-4 overflow-hidden">
          {adminUserInfo && (
            <Link
              to="/admin/dashboard"
              onClick={() => {
                setDropIsOpen(!dropIsOpen);
              }}
              className="flex items-center w-full px-4 py-3 min-h-[44px] text-sm text-left text-primary-600 hover:bg-primary-100"
            >
              <BiSolidUserDetail className="mr-1" />
              Dashboard
            </Link>
          )}
          {userInfo && (
            <Link
              to="/profile"
              onClick={() => {
                dispatch(getUserDetails({}));
                setDropIsOpen(!dropIsOpen);
              }}
              className="flex items-center w-full px-4 py-3 min-h-[44px] text-sm text-left text-primary-600 hover:bg-primary-100"
            >
              <BiSolidUserDetail className="mr-1" />
              Profile
            </Link>
          )}
          <button
            type="button"
            onClick={logoutHandler}
            className="flex items-center w-full px-4 py-3 min-h-[44px] text-sm text-left text-primary-600 hover:bg-primary-100"
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
