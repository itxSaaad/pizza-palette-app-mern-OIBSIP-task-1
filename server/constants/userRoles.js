/**
 * User Role Constants
 * 
 * Defines all user roles in the system.
 * Used for authorization and access control.
 * 
 * @constant {Object} USER_ROLES
 */

const USER_ROLES = Object.freeze({
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user'
});

/**
 * Get all user role values as an array
 * @returns {string[]} Array of user role values
 */
const USER_ROLE_VALUES = Object.values(USER_ROLES);

/**
 * Admin roles (roles that have admin privileges)
 * @constant {string[]} ADMIN_ROLES
 */
const ADMIN_ROLES = Object.freeze([USER_ROLES.ADMIN, USER_ROLES.MANAGER]);

/**
 * Check if a role is an admin role
 * @param {string} role - Role to check
 * @returns {boolean} True if admin role
 */
const isAdminRole = (role) => {
  return ADMIN_ROLES.includes(role);
};

module.exports = {
  USER_ROLES,
  USER_ROLE_VALUES,
  ADMIN_ROLES,
  isAdminRole
};
