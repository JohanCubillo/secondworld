const { Model, DataTypes, Sequelize } = require('sequelize');

const ORDER_ITEM_TABLE = 'order_items';

const OrderItemSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  orderId: {
    field: 'order_id',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: 'orders',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  productId: {
    field: 'product_id',
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: 'products',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Precio al momento de la compra',
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'product_name',
    comment: 'Nombre del producto al momento de la compra',
  },
  productImage: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'product_image',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
    field: 'created_at',
  },
};

class OrderItem extends Model {
  static associate(models) {
    this.belongsTo(models.Order, { as: 'order' });
    this.belongsTo(models.Product, { as: 'product' });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ORDER_ITEM_TABLE,
      modelName: 'OrderItem',
      timestamps: false,
    };
  }
}

module.exports = { ORDER_ITEM_TABLE, OrderItemSchema, OrderItem };
