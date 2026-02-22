const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

const { connectDb } = require('./config/db');
const { USER_ROLES } = require('./constants/userRoles');

const Admin = require('./schemas/adminUserSchema');
const User = require('./schemas/userSchema');
const Pizza = require('./schemas/pizzaSchema');
const Order = require('./schemas/orderSchema');
const { Base, Sauce, Cheese, Veggie } = require('./schemas/inventorySchema');

const { users, admins } = require('./data/users');
const pizzas = require('./data/pizzas');
const { base, sauce, cheese, veggie } = require('./data/inventory');

dotenv.config();

// Connect to MongoDB
connectDb();

const importData = async () => {
  try {
    // Insert users and admins first
    const createdUsers = await User.insertMany(users);
    const createdAdmins = await Admin.insertMany(admins);

    // Insert inventory items
    const createdBases = await Base.insertMany(base);
    const createdSauces = await Sauce.insertMany(sauce);
    const createdCheeses = await Cheese.insertMany(cheese);
    const createdVeggies = await Veggie.insertMany(veggie);

    // Create lookup maps for inventory items by name
    const baseMap = {};
    createdBases.forEach((b) => {
      baseMap[b.item] = b._id;
    });

    const sauceMap = {};
    createdSauces.forEach((s) => {
      sauceMap[s.item] = s._id;
    });

    const cheeseMap = {};
    createdCheeses.forEach((c) => {
      cheeseMap[c.item] = c._id;
    });

    const veggieMap = {};
    createdVeggies.forEach((v) => {
      veggieMap[v.item] = v._id;
    });

    // Transform pizzas to use ObjectIds
    const pizzasWithIds = pizzas.map((pizza) => ({
      name: pizza.name,
      description: pizza.description,
      bases: pizza.base ? [baseMap[pizza.base] || createdBases[0]._id] : [],
      sauces: pizza.sauces.map((s) => sauceMap[s]).filter((id) => id),
      cheeses: pizza.cheeses.map((c) => cheeseMap[c]).filter((id) => id),
      veggies: pizza.veggies.map((v) => veggieMap[v]).filter((id) => id),
      price: pizza.price,
      imageUrl: pizza.imageUrl,
      createdBy: USER_ROLES.ADMIN,
    }));

    await Pizza.insertMany(pizzasWithIds);

    console.log('\n✅ Database seeded successfully!\n'.green.inverse);
    console.log('═'.repeat(60).cyan);
    console.log('TEST CREDENTIALS'.yellow.bold);
    console.log('═'.repeat(60).cyan);
    console.log('\nADMINS:'.yellow.bold);
    console.log('  • admin1@pizzapalette.com / Admin@123456'.green + ' (Super Admin)'.gray);
    console.log('  • admin2@pizzapalette.com / Manager@123456'.green + ' (Manager)'.gray);
    console.log('\nUSERS:'.yellow.bold);
    console.log('  • john@example.com / User@123456'.green + ' (Verified)'.gray);
    console.log('  • jane@example.com / User@123456'.green + ' (Verified)'.gray);
    console.log('  • test@example.com / User@123456'.green + ' (Not Verified)'.gray);
    console.log('\n' + '═'.repeat(60).cyan);
    console.log('IMPORTANT:'.red.bold + ' Change these passwords in production!\n'.gray);

    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Admin.deleteMany();
    await Order.deleteMany();
    await Pizza.deleteMany();
    await User.deleteMany();
    await Base.deleteMany();
    await Sauce.deleteMany();
    await Cheese.deleteMany();
    await Veggie.deleteMany();

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
