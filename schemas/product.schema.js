const Joi = require('joi');

const id = Joi.string().uuid();
const name = Joi.string().min(3).max(100);
const price = Joi.number().min(0);
const image = Joi.string().max(10485760).allow('', null); // <-- AGREGAR .allow('', null)
const description = Joi.string().max(1000).allow('', null); // <-- AGREGAR .allow('', null)
const stock = Joi.number().integer().min(0);
const discount = Joi.number().min(0).max(100);
const isFlashSale = Joi.boolean();
const condition = Joi.string().valid('nuevo', 'como_nuevo', 'usado', 'muy_usado');
const size = Joi.string().max(10).allow('', null); // <-- AGREGAR .allow('', null)
const storeId = Joi.number().integer();
const categoryId = Joi.number().integer();

const createProductSchema = Joi.object({
  name: name.required(),
  price: price.required(),
  image: image.required(),
  description: description,
  stock: stock,
  discount: discount,
  isFlashSale: isFlashSale,
  condition: condition,
  size: size,
  storeId: storeId,
  categoryId: categoryId
});

const updateProductSchema = Joi.object({
  name: name,
  price: price,
  image: image, // <-- En update la imagen NO es requerida
  description: description,
  stock: stock,
  discount: discount,
  isFlashSale: isFlashSale,
  condition: condition,
  size: size,
  storeId: storeId,
  categoryId: categoryId
});

const getProductSchema = Joi.object({
  id: id.required(),
});

module.exports = { createProductSchema, updateProductSchema, getProductSchema };