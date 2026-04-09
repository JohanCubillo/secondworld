const express = require('express');
const router = express.Router();

// Enviar mensaje de contacto
router.post('/', async (req, res, next) => {
  try {
    const { models } = require('../libs/sequelize');
    const { nombre, email, telefono, asunto, mensaje } = req.body;
    if (!nombre || !email || !asunto || !mensaje) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    const contacto = await models.Contacto.create({ nombre, email, telefono, asunto, mensaje });
    res.status(201).json({ success: true, id: contacto.id });
  } catch(e) { next(e); }
});

// Obtener todos los mensajes (admin)
router.get('/', async (req, res, next) => {
  try {
    const { models } = require('../libs/sequelize');
    const mensajes = await models.Contacto.findAll({
      order: [['created_at', 'DESC']]
    });
    res.json(mensajes);
  } catch(e) { next(e); }
});

// Marcar como leído
router.patch('/:id/leer', async (req, res, next) => {
  try {
    const { models } = require('../libs/sequelize');
    await models.Contacto.update({ leido: true }, { where: { id: req.params.id } });
    res.json({ success: true });
  } catch(e) { next(e); }
});

// Eliminar mensaje
router.delete('/:id', async (req, res, next) => {
  try {
    const { models } = require('../libs/sequelize');
    await models.Contacto.destroy({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch(e) { next(e); }
});

module.exports = router;
