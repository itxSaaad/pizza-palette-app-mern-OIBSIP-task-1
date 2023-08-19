const bcrypt = require('bcryptjs');

const admin = {
  name: 'Admin User',
  email: 'admin@pizzadelivery.com',
  password: bcrypt.hashSync('123456', 10),
  role: 'admin',
  permissions: ['admin'],
};

const users = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('123456', 10),
    phoneNumber: '123-456-7890',
    address: '123 Main St, City',
    orders: [],
  },
  {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: bcrypt.hashSync('123456', 10),
    phoneNumber: '123-456-7890',
    address: '123 Main St, City',
    orders: [],
  },
];

module.exports = { admin, users };
