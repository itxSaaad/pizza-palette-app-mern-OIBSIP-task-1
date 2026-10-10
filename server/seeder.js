const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

const { connectDb } = require('./config/db');
const { USER_ROLES } = require('./constants/userRoles');

const Admin = require('./schemas/adminUserSchema');
const User = require('./schemas/userSchema');
const Pizza = require('./schemas/pizzaSchema');
const { Base, Sauce, Cheese, Veggie } = require('./schemas/inventorySchema');

const { users, admins } = require('./data/users');
const pizzas = require('./data/pizzas');
const { base, sauce, cheese, veggie } = require('./data/inventory');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const args = new Set(process.argv.slice(2));
const isProduction = args.has('--production');
const isDestroy = args.has('--destroy') || args.has('-d') || args.has('--sync');

const assertTargetIsExplicit = () => {
  if (process.env.NODE_ENV === 'production' && !isProduction) {
    throw new Error('NODE_ENV is production. Use the explicit --production flag to seed the configured database.');
  }

  if (isProduction && !process.env.MONGO_URI) {
    throw new Error('MONGO_URI must point to the intended production database before using --production.');
  }

  if (isDestroy && isProduction && !args.has('--confirm-production-destroy')) {
    throw new Error('Production cleanup requires --confirm-production-destroy.');
  }
};

const insertSeededDocuments = (Model, documents) => Model.insertMany(documents);

const syncSeededAccounts = async (Model, accounts) => {
  for (const account of accounts) {
    await Model.findOneAndUpdate(
      { email: account.email },
      { $set: account },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );
  }
};

const getOrCreateInventory = async (Model, items) => {
  const results = [];
  for (const item of items) {
    const existing = await Model.findOne({ item: item.item });
    results.push(existing || (await Model.create(item)));
  }
  return results;
};

const importData = async () => {
  try {
    assertTargetIsExplicit();
    await connectDb();

    // Seed emails are fixture identities: update only these accounts, never all users.
    await syncSeededAccounts(User, users);
    await syncSeededAccounts(Admin, admins);

    const createdBases = await getOrCreateInventory(Base, base);
    const createdSauces = await getOrCreateInventory(Sauce, sauce);
    const createdCheeses = await getOrCreateInventory(Cheese, cheese);
    const createdVeggies = await getOrCreateInventory(Veggie, veggie);

    const baseMap = Object.fromEntries(createdBases.map((item) => [item.item, item._id]));
    const sauceMap = Object.fromEntries(createdSauces.map((item) => [item.item, item._id]));
    const cheeseMap = Object.fromEntries(createdCheeses.map((item) => [item.item, item._id]));
    const veggieMap = Object.fromEntries(createdVeggies.map((item) => [item.item, item._id]));

    const pizzasWithIds = pizzas.map((pizza) => ({
      name: pizza.name,
      description: pizza.description,
      bases: pizza.base ? [baseMap[pizza.base]].filter(Boolean) : [],
      sauces: pizza.sauces.map((item) => sauceMap[item]).filter(Boolean),
      cheeses: pizza.cheeses.map((item) => cheeseMap[item]).filter(Boolean),
      veggies: pizza.veggies.map((item) => veggieMap[item]).filter(Boolean),
      price: pizza.price,
      imageUrl: pizza.imageUrl,
      createdBy: USER_ROLES.ADMIN,
    }));

    let insertedPizzas = 0;
    for (const pizza of pizzasWithIds) {
      const existing = await Pizza.findOne({
        name: pizza.name,
        description: pizza.description,
        price: pizza.price,
        imageUrl: pizza.imageUrl,
        createdBy: pizza.createdBy,
      });
      if (existing) continue;
      await Pizza.create(pizza);
      insertedPizzas += 1;
    }

    console.log('\nSample data imported successfully.'.green);
    console.log(`Inserted ${insertedPizzas} new sample pizza(s); matching catalog items were preserved.`.cyan);
    console.log(isProduction
      ? 'Production sample accounts use the credentials defined in server/data/users.js. Change their passwords immediately.'.yellow
      : 'Local demo accounts are ready.'.cyan);
  } catch (error) {
    console.error(`${error}`.red);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect().catch((error) => console.error('MongoDB disconnect failed:', error.message));
    }
  }
};

const destroyData = async () => {
  try {
    assertTargetIsExplicit();
    await connectDb();

    const seededUsers = users.map(({ email }) => email);
    const seededAdmins = admins.map(({ email }) => email);
    const seededPizzas = pizzas.map((pizza) => ({
      name: pizza.name,
      description: pizza.description,
      price: pizza.price,
      imageUrl: pizza.imageUrl,
      createdBy: USER_ROLES.ADMIN,
    }));

    const userResult = await User.deleteMany({ email: { $in: seededUsers } });
    const adminResult = await Admin.deleteMany({ email: { $in: seededAdmins } });
    const pizzaResult = await Pizza.deleteMany({ $or: seededPizzas });
    console.log(`Removed ${userResult.deletedCount} seed-email user(s).`);
    console.log(`Removed ${adminResult.deletedCount} seed-email admin(s).`);
    console.log(`Removed ${pizzaResult.deletedCount} exact-match sample pizza(s).`);

    for (const [Model, items] of [
      [Base, base],
      [Sauce, sauce],
      [Cheese, cheese],
      [Veggie, veggie],
    ]) {
      const result = await Model.deleteMany({
        $or: items.map(({ item, price, threshold }) => ({ item, price, threshold })),
      });
      console.log(`Removed ${result.deletedCount} matching ${Model.modelName} seed item(s).`);
    }

    console.log('Seed identities removed; orders and non-matching application data were left intact.'.green);
  } catch (error) {
    console.error(`${error}`.red);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect().catch((error) => console.error('MongoDB disconnect failed:', error.message));
    }
  }
};

if (args.has('--sync')) {
  (async () => {
    await destroyData();
    if (process.exitCode === 1) return;
    await importData();
  })();
} else if (isDestroy) {
  destroyData();
} else {
  importData();
}
