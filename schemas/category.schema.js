const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string().min(3).max(50);
const image = Joi.string().max(10485760).allow('', null); // <-- AGREGAR .allow('', null)
const storeId = Joi.number().integer();

const createCategorySchema = Joi.object({
  name: name.required(),
  image: image,
  storeId: storeId
});

const updateCategorySchema = Joi.object({
  name: name,
  image: image,
  storeId: storeId
});

const getCategorySchema = Joi.object({
  id: id.required(),
});

module.exports = { createCategorySchema, updateCategorySchema, getCategorySchema };