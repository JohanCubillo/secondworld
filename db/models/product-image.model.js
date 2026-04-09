const { Model, DataTypes } = require('sequelize');

class ProductImage extends Model {
  static associate(models) {
    this.belongsTo(models.Product, { as: 'product', foreignKey: 'product_id' });
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: 'product_images',
      modelName: 'ProductImage',
      timestamps: false,
    };
  }
}

const ProductImageSchema = {
  id: { allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER },
  productId: { field: 'product_id', type: DataTypes.UUID, allowNull: false },
  image: { type: DataTypes.TEXT, allowNull: false },
  orden: { type: DataTypes.INTEGER, defaultValue: 0 },
  createdAt: { field: 'created_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW }
};

module.exports = { ProductImage, ProductImageSchema };
