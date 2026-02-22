/**
 * User Role Constants
 * 
 * Defines all user roles in the system.
 * Used for authorization and access control.
 * 
 * NOTE: Keep in sync with backend constants at server/constants/userRoles.js
 * 
 * @constant {Object} USER_ROLES
 */

export const USER_ROLES = Object.freeze({
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user'
});

/**
 * Get all user role values as an array
 * @returns {string[]} Array of user role values
 */
export const USER_ROLE_VALUES = Object.values(USER_ROLES);

/**
 * Admin roles (roles that have admin privileges)
 * @constant {string[]} ADMIN_ROLES
 */
export const ADMIN_ROLES = Object.freeze([USER_ROLES.ADMIN, USER_ROLES.MANAGER]);

/**
 * Check if a role is an admin role
 * @param {string} role - Role to check
 * @returns {boolean} True if admin role
 */
export const isAdminRole = (role) => {
  return ADMIN_ROLES.includes(role);
};

/**
 * Get display label for role
 * @param {string} role - User role
 * @returns {string} Display label
 */
export const getRoleLabel = (role) => {
  switch (role) {
    case USER_ROLES.ADMIN:
      return 'Admin';
    case USER_ROLES.MANAGER:
      return 'Manager';
    case USER_ROLES.USER:
      return 'User';
    default:
      return role;
  }
};
