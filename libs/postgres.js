const { Pool } = require('pg');
const { config } = require('../config/config');

console.log('🔍 DEBUG postgres.js - Variables de configuración:');
console.log('   DB_USER:', config.dbUser);
console.log('   DB_DATABASE:', config.dbDatabase);

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbDatabase}`;

const pool = new Pool({
  connectionString: URI,
});

module.exports = { connection: pool };
