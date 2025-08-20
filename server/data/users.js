const bcrypt = require('bcryptjs');

const admins = [
  {
    name: 'Admin User 1',
    email: 'admin1@pizzapalette.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'admin',
    permissions: ['admin'],
    isApproved: true,
  },
  {
    name: 'Admin User 2',
    email: 'admin2@pizzapalette.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'admin',
    permissions: ['admin'],
    isApproved: true,
  },
];

const users = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('123456', 10),
    phoneNumber: '123-456-7890',
    address: '123 Main St, City',
    orders: [],
    isVerified: true,
    verificationCode: '123456',
    resetPasswordToken: null,
    resetPasswordExpire: null,
  },
  {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: bcrypt.hashSync('123456', 10),
    phoneNumber: '123-456-7890',
    address: '123 Main St, City',
    orders: [],
    isVerified: true,
    verificationCode: '098765',
    resetPasswordToken: null,
    resetPasswordExpire: null,
  },
];

module.exports = { admins, users };
