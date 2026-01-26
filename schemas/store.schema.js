const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string().min(3).max(100);
const description = Joi.string().max(500).allow('', null); // <-- AGREGAR
const logo = Joi.string().max(10485760).allow('', null); // <-- AGREGAR
const isActive = Joi.boolean();

const createStoreSchema = Joi.object({
  name: name.required(),
  description: description,
  logo: logo,
  isActive: isActive
});

const updateStoreSchema = Joi.object({
  name: name,
  description: description,
  logo: logo,
  isActive: isActive
});

const getStoreSchema = Joi.object({
  id: id.required(),
});

module.exports = { createStoreSchema, updateStoreSchema, getStoreSchema };