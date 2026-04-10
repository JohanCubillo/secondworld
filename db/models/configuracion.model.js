const { Model, DataTypes } = require('sequelize');

class Configuracion extends Model {
  static associate(models) {}
  static config(sequelize) {
    return {
      sequelize,
      tableName: 'configuracion',
      modelName: 'Configuracion',
      timestamps: false,
    };
  }
}

const ConfiguracionSchema = {
  id: { allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER },
  clave: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  valor: { type: DataTypes.TEXT, allowNull: true },
  updatedAt: { field: 'updated_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW }
};

module.exports = { Configuracion, ConfiguracionSchema };
