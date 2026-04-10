const express = require('express');
const router = express.Router();

// Obtener toda la configuración
router.get('/', async (req, res, next) => {
  try {
    const { models } = require('../libs/sequelize');
    const config = await models.Configuracion.findAll();
    const obj = {};
    config.forEach(c => obj[c.clave] = c.valor);
    res.json(obj);
  } catch(e) { next(e); }
});

// Actualizar configuración
router.post('/', async (req, res, next) => {
  try {
    const { models } = require('../libs/sequelize');
    const updates = req.body;
    for (const [clave, valor] of Object.entries(updates)) {
      await models.Configuracion.upsert({ clave, valor, updatedAt: new Date() });
    }
    res.json({ success: true });
  } catch(e) { next(e); }
});

module.exports = router;
