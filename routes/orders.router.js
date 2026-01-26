const express = require('express');
const OrderService = require('./../services/order.service');

const router = express.Router();
const service = new OrderService();

// Obtener todas las órdenes (para admin)
router.get('/', async (req, res, next) => {
  try {
    const orders = await service.find();
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

// Buscar orden por email y ID (para clientes)
router.get('/track', async (req, res, next) => {
  try {
    const { email, orderId } = req.query;
    const order = await service.findByEmailAndId(email, orderId);
    res.json(order);
  } catch (error) {
    next(error);
  }
});

// Obtener una orden específica
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await service.findOne(id);
    res.json(order);
  } catch (error) {
    next(error);
  }
});

// Crear nueva orden con items
router.post('/', async (req, res, next) => {
  try {
    const { orderData, items } = req.body;
    const result = await service.createWithItems(orderData, items);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// Actualizar estado de orden
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const order = await service.update(id, body);
    res.json(order);
  } catch (error) {
    next(error);
  }
});

// Eliminar orden
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await service.delete(id);
    res.status(200).json({ id });
  } catch (error) {
    next(error);
  }
});

module.exports = router;