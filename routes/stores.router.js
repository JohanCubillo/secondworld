const express = require('express');
const StoreService = require('./../services/store.service');
const validatorHandler = require('./../middlewares/validator.handler');
const {
  createStoreSchema,
  updateStoreSchema,
  getStoreSchema,
} = require('./../schemas/store.schema');

const router = express.Router();
const service = new StoreService();

router.get('/', async (req, res, next) => {
  try {
    const stores = await service.find();
    res.json(stores);
  } catch (error) {
    next(error);
  }
});

router.get(
  '/:id',
  validatorHandler(getStoreSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const store = await service.findOne(id);
      res.json(store);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  validatorHandler(createStoreSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newStore = await service.create(body);
      res.status(201).json(newStore);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/:id',
  validatorHandler(getStoreSchema, 'params'),
  validatorHandler(updateStoreSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const store = await service.update(id, body);
      res.json(store);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id',
  validatorHandler(getStoreSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await service.delete(id);
      res.status(200).json({ id });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;