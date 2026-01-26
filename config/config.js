require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'dev',
  port: process.env.PORT || 3000,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  dbDatabase: process.env.DB_DATABASE,
  resendApiKey: process.env.RESEND_API_KEY // <-- AGREGAR ESTA LÍNEA
};

module.exports = { config };