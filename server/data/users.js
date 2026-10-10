const bcrypt = require('bcryptjs');
const { USER_ROLES } = require('../constants/userRoles');

/**
 * SAMPLE SEED CREDENTIALS (Local or Explicit Production Seed)
 * =====================================
 * 
 * ADMINS:
 * - admin1@pizzapalette.com / Admin@123456 (Super Admin)
 * - admin2@pizzapalette.com / Manager@123456 (Manager)
 * 
 * USERS:
 * - john@example.com / User@123456 (Verified)
 * - jane@example.com / User@123456 (Verified)
 * - test@example.com / User@123456 (Not Verified)
 * 
 * IMPORTANT: These credentials are committed in source. Change them immediately
 * after using a production seed, and do not expose the seeded accounts publicly.
 */

const admins = [
  {
    name: 'Super Admin',
    email: 'admin1@pizzapalette.com',
    password: bcrypt.hashSync('Admin@123456', 10),
    role: USER_ROLES.ADMIN,
    permissions: ['admin'],
    isApproved: true,
  },
  {
    name: 'Manager Admin',
    email: 'admin2@pizzapalette.com',
    password: bcrypt.hashSync('Manager@123456', 10),
    role: USER_ROLES.MANAGER,
    permissions: ['admin'],
    isApproved: true,
  },
];

const users = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('User@123456', 10),
    phoneNumber: '123-456-7890',
    address: '123 Main St, New York, NY 10001',
    orders: [],
    isVerified: true,
    verificationCode: '123456',
    resetPasswordToken: null,
    resetPasswordExpire: null,
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: bcrypt.hashSync('User@123456', 10),
    phoneNumber: '987-654-3210',
    address: '456 Oak Ave, Los Angeles, CA 90001',
    orders: [],
    isVerified: true,
    verificationCode: '098765',
    resetPasswordToken: null,
    resetPasswordExpire: null,
  },
  {
    name: 'Test User',
    email: 'test@example.com',
    password: bcrypt.hashSync('User@123456', 10),
    phoneNumber: '555-123-4567',
    address: '789 Pine Rd, Chicago, IL 60601',
    orders: [],
    isVerified: false,
    verificationCode: '567890',
    resetPasswordToken: null,
    resetPasswordExpire: null,
  },
];

module.exports = { admins, users };
