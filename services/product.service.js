const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');

class ProductsService {
  constructor() {}

  async create(data) {
    const newProduct = await models.Product.create(data);
    return newProduct;
  }

  async find() {
    const { Op } = require('sequelize');
    const products = await models.Product.findAll({
      where: { stock: { [Op.gt]: 0 } },
      include: ['store', 'category']
    });
    return products;
  }
  async findAll() {
    const products = await models.Product.findAll({
      include: ['store', 'category']
    });
    return products;
  }
  async findOne(id) {
    const product = await models.Product.findByPk(id, {
      include: ['store', 'category']
    });
    if (!product) {
      throw boom.notFound('Product not found');
    }
    return product;
  }

  async update(id, changes) {
    const product = await this.findOne(id);
    // Si el stock llega a 0 y no tenía sold_at, marcarlo
    if (changes.stock === 0 && !product.sold_at) {
      changes.sold_at = new Date();
    }
    // Si se repone stock, limpiar sold_at
    if (changes.stock > 0) {
      changes.sold_at = null;
      changes.image_deleted = false;
    }
    const rta = await product.update(changes);
    return rta;
  }

  async delete(id) {
    const product = await this.findOne(id);
    await product.destroy();
    return { id };
  }
}

module.exports = ProductsService;