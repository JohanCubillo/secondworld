const { models } = require('./libs/sequelize');

async function seedPhase1() {
  try {
    console.log('🌱 Iniciando seed FASE 1...\n');

    // Limpiar datos existentes
    await models.Product.destroy({ where: {} });
    await models.Category.destroy({ where: {} });
    await models.Store.destroy({ where: {} });
    await models.User.destroy({ where: {} });
    console.log('✅ Datos anteriores eliminados\n');

    // ========================================
    // CREAR TIENDAS
    // ========================================
    console.log('🏪 Creando tiendas...');
    const stores = await models.Store.bulkCreate([
      {
        name: 'SecondKids',
        description: 'Ropa de segunda mano para niños y bebés',
        logo: 'https://picsum.photos/200/200?random=store1',
        isActive: true
      },
      {
        name: 'SecondWorld',
        description: 'Ropa de segunda mano para adultos',
        logo: 'https://picsum.photos/200/200?random=store2',
        isActive: true
      }
    ]);
    console.log(`✅ ${stores.length} tiendas creadas\n`);

    // ========================================
    // CREAR CATEGORÍAS
    // ========================================
    console.log('📁 Creando categorías...');
    const categories = await models.Category.bulkCreate([
      // Categorías para SecondKids
      { name: 'Ropa de Bebé', image: 'https://picsum.photos/200/300?random=cat1', storeId: stores[0].id },
      { name: 'Ropa Infantil', image: 'https://picsum.photos/200/300?random=cat2', storeId: stores[0].id },
      { name: 'Calzado Infantil', image: 'https://picsum.photos/200/300?random=cat3', storeId: stores[0].id },
      
      // Categorías para SecondWorld
      { name: 'Camisetas', image: 'https://picsum.photos/200/300?random=cat4', storeId: stores[1].id },
      { name: 'Pantalones', image: 'https://picsum.photos/200/300?random=cat5', storeId: stores[1].id },
      { name: 'Chaquetas', image: 'https://picsum.photos/200/300?random=cat6', storeId: stores[1].id },
      { name: 'Vestidos', image: 'https://picsum.photos/200/300?random=cat7', storeId: stores[1].id },
      { name: 'Zapatos', image: 'https://picsum.photos/200/300?random=cat8', storeId: stores[1].id },
    ]);
    console.log(`✅ ${categories.length} categorías creadas\n`);

    // ========================================
    // CREAR PRODUCTOS - SecondKids
    // ========================================
    console.log('👶 Creando productos para SecondKids...');
    const kidsProducts = await models.Product.bulkCreate([
      {
        name: 'Body de Bebé Carter\'s',
        price: 8,
        image: 'https://picsum.photos/200/300?random=kid1',
        description: 'Body de algodón suave, perfecto para bebés',
        stock: 15,
        discount: 10,
        isFlashSale: false,
        condition: 'como_nuevo',
        size: '6M',
        storeId: stores[0].id,
        categoryId: categories[0].id
      },
      {
        name: 'Pantalón Jean Infantil',
        price: 12,
        image: 'https://picsum.photos/200/300?random=kid2',
        description: 'Jean resistente para niños activos',
        stock: 8,
        discount: 15,
        isFlashSale: false,
        condition: 'usado',
        size: '4T',
        storeId: stores[0].id,
        categoryId: categories[1].id
      },
      {
        name: 'Zapatillas Nike Niño',
        price: 25,
        image: 'https://picsum.photos/200/300?random=kid3',
        description: 'Zapatillas deportivas en excelente estado',
        stock: 5,
        discount: 30,
        isFlashSale: true,
        condition: 'como_nuevo',
        size: '28',
        storeId: stores[0].id,
        categoryId: categories[2].id
      },
      {
        name: 'Vestido de Niña Floral',
        price: 10,
        image: 'https://picsum.photos/200/300?random=kid4',
        description: 'Hermoso vestido para ocasiones especiales',
        stock: 6,
        discount: 0,
        isFlashSale: false,
        condition: 'usado',
        size: '6',
        storeId: stores[0].id,
        categoryId: categories[1].id
      },
      {
        name: 'Conjunto Deportivo Adidas',
        price: 18,
        image: 'https://picsum.photos/200/300?random=kid5',
        description: 'Conjunto completo para niños deportistas',
        stock: 10,
        discount: 20,
        isFlashSale: false,
        condition: 'como_nuevo',
        size: '8',
        storeId: stores[0].id,
        categoryId: categories[1].id
      }
    ]);
    console.log(`✅ ${kidsProducts.length} productos de SecondKids creados\n`);

    // ========================================
    // CREAR PRODUCTOS - SecondWorld
    // ========================================
    console.log('👕 Creando productos para SecondWorld...');
    const worldProducts = await models.Product.bulkCreate([
      {
        name: 'Camiseta Vintage Nike',
        price: 15,
        image: 'https://picsum.photos/200/300?random=prod1',
        description: 'Camiseta clásica en excelente estado',
        stock: 20,
        discount: 0,
        isFlashSale: false,
        condition: 'usado',
        size: 'M',
        storeId: stores[1].id,
        categoryId: categories[3].id
      },
      {
        name: 'Jeans Levis 501',
        price: 35,
        image: 'https://picsum.photos/200/300?random=prod2',
        description: 'Los clásicos 501, auténticos y duraderos',
        stock: 12,
        discount: 15,
        isFlashSale: false,
        condition: 'como_nuevo',
        size: '32',
        storeId: stores[1].id,
        categoryId: categories[4].id
      },
      {
        name: 'Chaqueta de Cuero',
        price: 65,
        image: 'https://picsum.photos/200/300?random=prod3',
        description: 'Chaqueta de cuero genuino, estilo motociclista',
        stock: 3,
        discount: 40,
        isFlashSale: true,
        condition: 'usado',
        size: 'L',
        storeId: stores[1].id,
        categoryId: categories[5].id
      },
      {
        name: 'Vestido Floral Zara',
        price: 25,
        image: 'https://picsum.photos/200/300?random=prod4',
        description: 'Vestido elegante para cualquier ocasión',
        stock: 7,
        discount: 10,
        isFlashSale: false,
        condition: 'como_nuevo',
        size: 'S',
        storeId: stores[1].id,
        categoryId: categories[6].id
      },
      {
        name: 'Zapatillas Adidas Superstar',
        price: 40,
        image: 'https://picsum.photos/200/300?random=prod5',
        description: 'Icónicas zapatillas en perfecto estado',
        stock: 15,
        discount: 25,
        isFlashSale: false,
        condition: 'como_nuevo',
        size: '42',
        storeId: stores[1].id,
        categoryId: categories[7].id
      },
      {
        name: 'Sudadera Champion',
        price: 28,
        image: 'https://picsum.photos/200/300?random=prod6',
        description: 'Sudadera cómoda y abrigada',
        stock: 18,
        discount: 0,
        isFlashSale: false,
        condition: 'usado',
        size: 'L',
        storeId: stores[1].id,
        categoryId: categories[3].id
      },
      {
        name: 'Pantalón Cargo',
        price: 22,
        image: 'https://picsum.photos/200/300?random=prod7',
        description: 'Pantalón versátil con múltiples bolsillos',
        stock: 10,
        discount: 5,
        isFlashSale: false,
        condition: 'usado',
        size: '34',
        storeId: stores[1].id,
        categoryId: categories[4].id
      },
      {
        name: 'Bomber Jacket',
        price: 55,
        image: 'https://picsum.photos/200/300?random=prod8',
        description: 'Chaqueta bomber de moda',
        stock: 4,
        discount: 50,
        isFlashSale: true,
        condition: 'nuevo',
        size: 'M',
        storeId: stores[1].id,
        categoryId: categories[5].id
      },
      {
        name: 'Vestido de Noche',
        price: 45,
        image: 'https://picsum.photos/200/300?random=prod9',
        description: 'Elegante vestido para eventos especiales',
        stock: 2,
        discount: 30,
        isFlashSale: true,
        condition: 'como_nuevo',
        size: 'M',
        storeId: stores[1].id,
        categoryId: categories[6].id
      },
      {
        name: 'Botas Timberland',
        price: 70,
        image: 'https://picsum.photos/200/300?random=prod10',
        description: 'Botas resistentes para todas las estaciones',
        stock: 6,
        discount: 20,
        isFlashSale: false,
        condition: 'usado',
        size: '43',
        storeId: stores[1].id,
        categoryId: categories[7].id
      }
    ]);
    console.log(`✅ ${worldProducts.length} productos de SecondWorld creados\n`);

    // ========================================
    // CREAR USUARIOS
    // ========================================
    console.log('👥 Creando usuarios...');
    await models.User.bulkCreate([
      { name: 'Carlos Ramírez', email: 'carlos@mail.com', password: 'pass123', role: 'customer' },
      { name: 'Ana López', email: 'ana@mail.com', password: 'pass456', role: 'customer' },
      { name: 'Lucía Fernández', email: 'lucia@mail.com', password: 'pass789', role: 'customer' },
      { name: 'Administrador', email: 'admin@tienda.com', password: 'admin123', role: 'admin' },
    ]);
    console.log('✅ 4 usuarios creados\n');

    // ========================================
    // RESUMEN
    // ========================================
    console.log('════════════════════════════════════════');
    console.log('🎉 ¡FASE 1 COMPLETADA EXITOSAMENTE!');
    console.log('════════════════════════════════════════');
    console.log(`🏪 Tiendas: ${stores.length}`);
    console.log(`📁 Categorías: ${categories.length}`);
    console.log(`📦 Productos: ${kidsProducts.length + worldProducts.length}`);
    console.log(`   - SecondKids: ${kidsProducts.length}`);
    console.log(`   - SecondWorld: ${worldProducts.length}`);
    console.log(`   - En Remate: ${[...kidsProducts, ...worldProducts].filter(p => p.isFlashSale).length}`);
    console.log(`👥 Usuarios: 4`);
    console.log('════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

seedPhase1();