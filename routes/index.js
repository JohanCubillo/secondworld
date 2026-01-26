const express = require('express');
const productsRouter = require('./products.router');
const categoriesRouter = require('./categories.router');
const usersRouter = require('./users.router');
const orderRouter = require('./orders.router');
const storesRouter = require('./stores.router');
const scheduledDiscountsRouter = require('./scheduled-discounts.router');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/products', productsRouter);
  router.use('/categories', categoriesRouter);
  router.use('/users', usersRouter);
  router.use('/orders', orderRouter);
  router.use('/stores', storesRouter);
  router.use('/scheduled-discounts', scheduledDiscountsRouter);
}

module.exports = routerApi;