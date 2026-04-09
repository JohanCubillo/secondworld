const { User, UserSchema } = require('./user.model');
const { Product, ProductSchema } = require('./product.model');
const { Category, CategorySchema } = require('./category.model');
const { Store, StoreSchema } = require('./store.model');
const { Order, OrderSchema } = require('./order.model');
const { OrderItem, OrderItemSchema } = require('./order-item.model');
const { ScheduledDiscount, ScheduledDiscountSchema } = require('./scheduled-discount.model');
const { Contacto, ContactoSchema } = require('./contacto.model');

function setupModels(sequelize) {
  User.init(UserSchema, User.config(sequelize));
  Product.init(ProductSchema, Product.config(sequelize));
  Category.init(CategorySchema, Category.config(sequelize));
  Store.init(StoreSchema, Store.config(sequelize));
  Order.init(OrderSchema, Order.config(sequelize));
  OrderItem.init(OrderItemSchema, OrderItem.config(sequelize));
  ScheduledDiscount.init(ScheduledDiscountSchema, ScheduledDiscount.config(sequelize));
  Contacto.init(ContactoSchema, Contacto.config(sequelize));

  // Asociaciones
  User.associate(sequelize.models);
  Product.associate(sequelize.models);
  Category.associate(sequelize.models);
  Store.associate(sequelize.models);
  Order.associate(sequelize.models);
  OrderItem.associate(sequelize.models);
  ScheduledDiscount.associate(sequelize.models);
  // Contacto no tiene asociaciones
}

module.exports = setupModels;