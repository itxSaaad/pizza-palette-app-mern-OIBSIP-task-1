const express = require('express');
const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');

// The pizza routes gate write operations behind `protect`/`admin`. Real auth
// (JWT + DB user lookup) is out of scope for this controller test, so the
// auth middleware is mocked to always let the request through as an admin.
jest.mock('../../middlewares/authMiddlewares', () => ({
  protect: (req, res, next) => {
    req.user = { _id: new (require('mongoose').Types.ObjectId)(), role: 'admin' };
    next();
  },
  admin: (req, res, next) => next(),
}));

const pizzaRoutes = require('../../routes/pizzaRoutes');
const { errorHandler, notFound } = require('../../middlewares/errorMiddlewares');
const Pizza = require('../../schemas/pizzaSchema');

let mongoServer;

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/pizzas', pizzaRoutes);
  app.use(notFound);
  app.use(errorHandler);
  return app;
};

const app = buildApp();

const validPizzaPayload = (overrides = {}) => ({
  name: 'Margherita',
  description: 'A classic pizza with fresh tomatoes and mozzarella.',
  bases: [new mongoose.Types.ObjectId().toString()],
  sauces: [new mongoose.Types.ObjectId().toString()],
  cheeses: [new mongoose.Types.ObjectId().toString()],
  veggies: [],
  price: 9.99,
  createdBy: 'user',
  imageUrl: 'https://example.com/margherita.jpg',
  ...overrides,
});

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Pizza.deleteMany({});
});

describe('Pizza controllers', () => {
  describe('GET /api/pizzas (getAllPizzas)', () => {
    it('returns an empty list with pagination metadata when there are no pizzas', async () => {
      const res = await request(app).get('/api/pizzas');

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
      expect(res.body.pagination).toMatchObject({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      });
    });

    it('paginates results according to page/limit query params', async () => {
      const docs = Array.from({ length: 15 }, (_, i) =>
        validPizzaPayload({ name: `Pizza ${i}`, price: i })
      );
      await Pizza.insertMany(docs);

      const res = await request(app).get('/api/pizzas').query({ page: 2, limit: 10 });

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(5);
      expect(res.body.pagination).toMatchObject({
        total: 15,
        page: 2,
        limit: 10,
        totalPages: 2,
        hasNextPage: false,
        hasPrevPage: true,
      });
    });

    it('filters by createdBy', async () => {
      await Pizza.create(validPizzaPayload({ name: 'User Pizza', createdBy: 'user' }));
      await Pizza.create(validPizzaPayload({ name: 'Admin Pizza', createdBy: 'admin' }));

      const res = await request(app).get('/api/pizzas').query({ createdBy: 'admin' });

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].name).toBe('Admin Pizza');
    });

    it('filters by minPrice and maxPrice', async () => {
      await Pizza.create(validPizzaPayload({ name: 'Cheap', price: 5 }));
      await Pizza.create(validPizzaPayload({ name: 'Mid', price: 10 }));
      await Pizza.create(validPizzaPayload({ name: 'Pricey', price: 20 }));

      const res = await request(app)
        .get('/api/pizzas')
        .query({ minPrice: 8, maxPrice: 15 });

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].name).toBe('Mid');
    });
  });

  describe('GET /api/pizzas/:id (getPizzaById)', () => {
    it('returns the pizza when found', async () => {
      const pizza = await Pizza.create(validPizzaPayload());

      const res = await request(app).get(`/api/pizzas/${pizza._id}`);

      expect(res.status).toBe(200);
      expect(res.body._id).toBe(pizza._id.toString());
      expect(res.body.name).toBe('Margherita');
    });

    it('returns 404 with a structured error when not found', async () => {
      const missingId = new mongoose.Types.ObjectId().toString();

      const res = await request(app).get(`/api/pizzas/${missingId}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('NOT_FOUND');
      expect(res.body.error.message).toBe('Pizza not found');
    });

    it('returns 400 for a malformed id (CastError)', async () => {
      const res = await request(app).get('/api/pizzas/not-a-valid-object-id');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('INVALID_INPUT');
    });
  });

  describe('POST /api/pizzas (createPizza)', () => {
    it('creates a pizza and forces createdBy to "user"', async () => {
      const payload = validPizzaPayload({ createdBy: 'admin' });

      const res = await request(app).post('/api/pizzas').send(payload);

      expect(res.status).toBe(201);
      expect(res.body.name).toBe(payload.name);
      expect(res.body.createdBy).toBe('user');
      expect(res.body.message).toBe('Pizza Created Successfully!');

      const stored = await Pizza.findById(res.body._id);
      expect(stored).not.toBeNull();
    });

    it('returns a 400 validation error when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/pizzas')
        .send({ name: 'X' }); // too short, missing everything else

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(Array.isArray(res.body.error.details)).toBe(true);
      expect(res.body.error.details.length).toBeGreaterThan(0);
    });
  });

  describe('PUT /api/pizzas/:id (updatePizzaById)', () => {
    it('updates fields that are provided and leaves others untouched', async () => {
      const pizza = await Pizza.create(validPizzaPayload());

      const res = await request(app)
        .put(`/api/pizzas/${pizza._id}`)
        .send({ price: 12.5 });

      expect(res.status).toBe(200);
      expect(res.body.price).toBe(12.5);
      expect(res.body.name).toBe('Margherita');
      expect(res.body.message).toBe('Pizza Updated Successfully!');

      const stored = await Pizza.findById(pizza._id);
      expect(stored.price).toBe(12.5);
    });

    it('returns 404 with a structured error when the pizza does not exist', async () => {
      const missingId = new mongoose.Types.ObjectId().toString();

      const res = await request(app)
        .put(`/api/pizzas/${missingId}`)
        .send({ price: 12.5 });

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('DELETE /api/pizzas/:id (deletePizzaById)', () => {
    it('deletes an existing pizza', async () => {
      const pizza = await Pizza.create(validPizzaPayload());

      const res = await request(app).delete(`/api/pizzas/${pizza._id}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Pizza Removed Successfully!');

      const stored = await Pizza.findById(pizza._id);
      expect(stored).toBeNull();
    });

    it('returns 404 with a structured error when the pizza does not exist', async () => {
      const missingId = new mongoose.Types.ObjectId().toString();

      const res = await request(app).delete(`/api/pizzas/${missingId}`);

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });
});
