const { Model, DataTypes, Sequelize } = require('sequelize');

const SCHEDULED_DISCOUNT_TABLE = 'scheduled_discounts';

const ScheduledDiscountSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Nombre de la promoción (ej: Black Friday, Cyber Monday)',
  },
  discountPercentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    field: 'discount_percentage',
    comment: 'Porcentaje de descuento general (0-100)',
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'start_date',
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'end_date',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active',
  },
  applyToStoreId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'apply_to_store_id',
    references: {
      model: 'stores',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    comment: 'Si es null, aplica a todas las tiendas',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
    field: 'created_at',
  },
};

class ScheduledDiscount extends Model {
  static associate(models) {
    this.belongsTo(models.Store, { as: 'store', foreignKey: 'applyToStoreId' });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: SCHEDULED_DISCOUNT_TABLE,
      modelName: 'ScheduledDiscount',
      timestamps: false,
    };
  }
}

module.exports = { SCHEDULED_DISCOUNT_TABLE, ScheduledDiscountSchema, ScheduledDiscount };