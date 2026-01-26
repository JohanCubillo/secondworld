const sequelize = require('./libs/sequelize');

async function syncDatabase() {
  try {
    await sequelize.sync({ force: true }); // CUIDADO: esto borra las tablas existentes
    console.log('✅ Base de datos sincronizada');
    console.log('✅ Tablas creadas correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

syncDatabase();