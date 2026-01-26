const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');

class StoreService {
  constructor() {}

  async create(data) {
    const newStore = await models.Store.create(data);
    return newStore;
  }

  async find() {
    const stores = await models.Store.findAll({
      include: ['categories', 'products']
    });
    return stores;
  }

  async findOne(id) {
    const store = await models.Store.findByPk(id, {
      include: ['categories', 'products']
    });
    if (!store) {
      throw boom.notFound('Store not found');
    }
    return store;
  }

  async update(id, changes) {
    const store = await this.findOne(id);
    const rta = await store.update(changes);
    return rta;
  }

  async delete(id) {
    const store = await this.findOne(id);
    await store.destroy();
    return { id };
  }
}

module.exports = StoreService;