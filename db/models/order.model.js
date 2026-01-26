const { Model, DataTypes, Sequelize } = require('sequelize');

const ORDER_TABLE = 'orders';

const OrderSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  // Datos del cliente
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'customer_name',
  },
  customerEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'customer_email',
  },
  customerPhone: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'customer_phone',
  },
  customerIdNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'customer_id_number',
    comment: 'Cédula del cliente',
  },
  
  // Datos de envío (Correos de Costa Rica)
  shippingProvince: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'shipping_province',
  },
  shippingCanton: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'shipping_canton',
  },
  shippingDistrict: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'shipping_district',
  },
  shippingAddress: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'shipping_address',
    comment: 'Dirección exacta',
  },
  shippingPostalCode: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'shipping_postal_code',
  },
  
  // Datos de pago SINPE
  sinpePhone: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'sinpe_phone',
    comment: 'Número de teléfono desde donde se hizo el SINPE',
  },
  sinpeReference: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'sinpe_reference',
    comment: 'Número de referencia del SINPE',
  },
  sinpeAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'sinpe_amount',
  },
  sinpeProof: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'sinpe_proof',
    comment: 'URL o base64 del comprobante',
  },
  
  // Datos de la orden
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pendiente', 'pago_verificado', 'enviado', 'entregado', 'cancelado'),
    allowNull: false,
    defaultValue: 'pendiente',
  },
  trackingNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'tracking_number',
  },
  trackingToken: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true,
    field: 'tracking_token',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
    field: 'created_at',
  },
};

class Order extends Model {
  static associate(models) {
    this.hasMany(models.OrderItem, {
      as: 'items',
      foreignKey: 'orderId',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ORDER_TABLE,
      modelName: 'Order',
      timestamps: false,
    };
  }
}

module.exports = { ORDER_TABLE, OrderSchema, Order };