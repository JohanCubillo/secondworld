const { Model, DataTypes } = require('sequelize');

class Contacto extends Model {
  static associate(models) {}
  static config(sequelize) {
    return {
      sequelize,
      tableName: 'contacto',
      modelName: 'Contacto',
      timestamps: false,
    };
  }
}

const ContactoSchema = {
  id: { allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER },
  nombre: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  telefono: { type: DataTypes.STRING, allowNull: true },
  asunto: { type: DataTypes.STRING, allowNull: false },
  mensaje: { type: DataTypes.TEXT, allowNull: false },
  leido: { type: DataTypes.BOOLEAN, defaultValue: false },
  createdAt: { type: DataTypes.DATE, field: 'created_at', defaultValue: DataTypes.NOW }
};

module.exports = { Contacto, ContactoSchema };
