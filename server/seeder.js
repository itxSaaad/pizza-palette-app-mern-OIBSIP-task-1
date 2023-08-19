const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

const connectDb = require('./config/db');

const User = require('./schemas/userSchema');
const Pizza = require('./schemas/pizzaSchema');
const Order = require('./schemas/orderSchema');
const Inventory = require('./schemas/inventorySchema');
const Admin = require('./schemas/adminUserSchema');

const { users, admin } = require('./data/users');
const pizzas = require('./data/pizzas');
const inventory = require('./data/inventory');

dotenv.config();

// Connect to MongoDB
connectDb();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Pizza.deleteMany();
    await User.deleteMany();
    await Inventory.deleteMany();
    await Admin.deleteMany();

    const createdUsers = await User.insertMany(users);
    const createdAdmin = await Admin.create(admin);
    const createdPizzas = await Pizza.insertMany(pizzas);
    const createdInventory = await Inventory.insertMany(inventory);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Pizza.deleteMany();
    await User.deleteMany();
    await Inventory.deleteMany();
    await Admin.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
