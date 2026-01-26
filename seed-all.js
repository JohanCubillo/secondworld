const { models } = require('./libs/sequelize');

async function seedDatabase() {
  try {
    console.log('🌱 Iniciando seed de la base de datos...');

    // Limpiar datos existentes
    await models.Product.destroy({ where: {} });
    await models.User.destroy({ where: {} });
    console.log('✅ Datos anteriores eliminados');

    // Crear productos de ropa de segunda
    await models.Product.bulkCreate([
      { name: 'Camiseta Vintage Nike', price: 15, image: 'https://picsum.photos/200/300?random=1' },
      { name: 'Jeans Levis 501', price: 35, image: 'https://picsum.photos/200/300?random=2' },
      { name: 'Chaqueta de Cuero', price: 65, image: 'https://picsum.photos/200/300?random=3' },
      { name: 'Vestido Floral', price: 25, image: 'https://picsum.photos/200/300?random=4' },
      { name: 'Zapatillas Adidas', price: 40, image: 'https://picsum.photos/200/300?random=5' },
      { name: 'Sudadera Champion', price: 28, image: 'https://picsum.photos/200/300?random=6' },
      { name: 'Pantalón Cargo', price: 22, image: 'https://picsum.photos/200/300?random=7' },
      { name: 'Bomber Jacket', price: 55, image: 'https://picsum.photos/200/300?random=8' },
      { name: 'Vestido de Noche', price: 45, image: 'https://picsum.photos/200/300?random=9' },
      { name: 'Botas Timberland', price: 70, image: 'https://picsum.photos/200/300?random=10' },
      { name: 'Camisa Vaquera', price: 18, image: 'https://picsum.photos/200/300?random=11' },
      { name: 'Falda Plisada', price: 20, image: 'https://picsum.photos/200/300?random=12' },
    ]);
    console.log('✅ Productos de ropa creados');

    // Crear usuarios (ahora con nombres)
    await models.User.bulkCreate([
      { name: 'Carlos Ramírez', email: 'carlos@mail.com', password: 'pass123', role: 'customer' },
      { name: 'Ana López', email: 'ana@mail.com', password: 'pass456', role: 'customer' },
      { name: 'Lucía Fernández', email: 'lucia@mail.com', password: 'pass789', role: 'customer' },
      { name: 'Administrador', email: 'admin@tienda.com', password: 'admin123', role: 'admin' },
    ]);
    console.log('✅ Usuarios creados');

    console.log('🎉 ¡Tienda de ropa de segunda creada exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error.message);
    process.exit(1);
  }
}

seedDatabase();