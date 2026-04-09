const { Model, DataTypes, Sequelize } = require('sequelize');

const PRODUCT_TABLE = 'products';

const ProductSchema = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  discount: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Porcentaje de descuento (0-100)',
  },
  isFlashSale: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_flash_sale',
    comment: 'Indica si está en remate/super descuento',
  },
  condition: {
    type: DataTypes.ENUM('nuevo', 'como_nuevo', 'usado', 'muy_usado'),
    allowNull: false,
    defaultValue: 'usado',
  },
  size: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Talla: XS, S, M, L, XL, XXL, etc.',
  },
  storeId: {
    field: 'store_id',
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: 'stores',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  categoryId: {
    field: 'category_id',
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: 'categories',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  soldAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'sold_at',
    comment: 'Fecha en que el stock llegó a 0',
  },
  imageDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
    field: 'image_deleted',
    comment: 'Indica si la imagen fue borrada por expiración',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
    field: 'created_at',
  },
};

class Product extends Model {
  static associate(models) {
    // Un producto pertenece a una tienda
    this.belongsTo(models.Store, { as: 'store' });
    // Un producto pertenece a una categoría
    this.belongsTo(models.Category, { as: 'category' });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: PRODUCT_TABLE,
      modelName: 'Product',
      timestamps: false,
    };
  }
}

module.exports = { PRODUCT_TABLE, ProductSchema, Product };
