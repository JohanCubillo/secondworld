const { Sequelize } = require('sequelize');
const { config } = require('../config/config');
const setupModels = require('./../db/models');

console.log('🔍 DEBUG - Variables de configuración:');
console.log('   DB_USER:', config.dbUser);
console.log('   DB_DATABASE:', config.dbDatabase);
console.log('   DB_HOST:', config.dbHost);
console.log('   DB_PORT:', config.dbPort);

// Usar opciones explícitas en lugar de URI
const sequelize = new Sequelize(config.dbDatabase, config.dbUser, config.dbPassword, {
  host: config.dbHost,
  port: config.dbPort,
  dialect: 'postgres',
  dialectOptions: {
    ssl: false
  },
  logging: console.log // Para ver las queries SQL
});

setupModels(sequelize);

module.exports = sequelize;
