const { Model, DataTypes, Sequelize } = require('sequelize');

const STORE_TABLE = 'stores';

const StoreSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  logo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
    field: 'created_at',
  },
};

class Store extends Model {
  static associate(models) {
    // Una tienda tiene muchos productos
    this.hasMany(models.Product, {
      as: 'products',
      foreignKey: 'storeId',
    });
    // Una tienda tiene muchas categorías
    this.hasMany(models.Category, {
      as: 'categories',
      foreignKey: 'storeId',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: STORE_TABLE,
      modelName: 'Store',
      timestamps: false,
    };
  }
}

module.exports = { STORE_TABLE, StoreSchema, Store };