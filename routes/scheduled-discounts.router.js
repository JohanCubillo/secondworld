const express = require('express');
const ScheduledDiscountService = require('./../services/scheduled-discount.service');

const router = express.Router();
const service = new ScheduledDiscountService();

// Obtener todos los descuentos programados
router.get('/', async (req, res, next) => {
  try {
    const discounts = await service.find();
    res.json(discounts);
  } catch (error) {
    next(error);
  }
});

// Obtener un descuento específico
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const discount = await service.findOne(id);
    res.json(discount);
  } catch (error) {
    next(error);
  }
});

// Crear nuevo descuento programado
router.post('/', async (req, res, next) => {
  try {
    const body = req.body;
    const newDiscount = await service.create(body);
    res.status(201).json(newDiscount);
  } catch (error) {
    next(error);
  }
});

// Actualizar descuento programado
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const discount = await service.update(id, body);
    res.json(discount);
  } catch (error) {
    next(error);
  }
});

// Eliminar descuento programado
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await service.delete(id);
    res.status(200).json({ id });
  } catch (error) {
    next(error);
  }
});

// Aplicar manualmente un descuento
router.post('/:id/apply', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await service.applyDiscount(id, true); // ← CAMBIADO AQUÍ
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Remover manualmente un descuento
router.post('/:id/remove', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await service.removeDiscount(id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Verificar y aplicar descuentos activos
router.post('/check-active', async (req, res, next) => {
  try {
    const results = await service.checkAndApplyActiveDiscounts();
    res.json(results);
  } catch (error) {
    next(error);
  }
});

module.exports = router;