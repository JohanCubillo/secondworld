const { Sequelize } = require('sequelize');
const { config } = require('../config/config');
const setupModels = require('./../db/models');

console.log('🔍 DEBUG - Variables de configuración:');
console.log('   DB_USER:', config.dbUser);
console.log('   DB_DATABASE:', config.dbDatabase);
console.log('   DB_HOST:', config.dbHost);
console.log('   DB_PORT:', config.dbPort);

const sequelize = new Sequelize(config.dbDatabase, config.dbUser, config.dbPassword, {
  host: config.dbHost,
  port: config.dbPort,
  dialect: 'postgres',
  dialectOptions: {
    ssl: false
  },
  define: {
    schema: 'secondworld'
  },
  logging: console.log
});

setupModels(sequelize);

sequelize.query("SET search_path TO secondworld, public;").catch(e => 
  console.log('search_path warning:', e.message)
);

module.exports = sequelize;
