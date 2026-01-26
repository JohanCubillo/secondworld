const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');
const { Op } = require('sequelize');

class ScheduledDiscountService {
  constructor() {}

  async create(data) {
    const newDiscount = await models.ScheduledDiscount.create(data);
    
    // Si está activo, aplicar descuentos
    if (newDiscount.isActive) {
      await this.applyDiscount(newDiscount.id, true); // Forzar aplicación
    }
    
    return newDiscount;
  }

  async find() {
    const discounts = await models.ScheduledDiscount.findAll({
      include: ['store'],
      order: [['createdAt', 'DESC']]
    });
    return discounts;
  }

  async findOne(id) {
    const discount = await models.ScheduledDiscount.findByPk(id, {
      include: ['store']
    });
    if (!discount) {
      throw boom.notFound('Scheduled discount not found');
    }
    return discount;
  }

  async update(id, changes) {
    const discount = await this.findOne(id);
    const result = await discount.update(changes);
    
    // Si se activó, aplicar descuentos
    if (changes.isActive) {
      await this.applyDiscount(id, true); // Forzar aplicación
    }
    
    return result;
  }

  async delete(id) {
    const discount = await this.findOne(id);
    
    // Remover descuentos antes de eliminar
    await this.removeDiscount(id);
    
    await discount.destroy();
    return { id };
  }

  // Aplicar descuento a productos
  async applyDiscount(discountId, forceApply = false) {
    console.log('🔍 Aplicando descuento ID:', discountId, 'forceApply:', forceApply);
    
    const discount = await this.findOne(discountId);
    console.log('📋 Descuento:', discount.name, discount.discountPercentage + '%');
    
    // Verificar que esté en el rango de fechas (solo si no es forzado)
    if (!forceApply) {
      const now = new Date();
      if (now < new Date(discount.startDate) || now > new Date(discount.endDate)) {
        console.log('❌ Fuera de rango de fechas');
        return { message: 'Discount not in valid date range', productsAffected: 0 };
      }
    } else {
      console.log('⚡ Aplicación forzada');
    }

    // Construir condición de búsqueda
    const whereCondition = {};
    if (discount.applyToStoreId) {
      whereCondition.storeId = discount.applyToStoreId;
      console.log('🏪 Solo tienda ID:', discount.applyToStoreId);
    } else {
      console.log('🌍 Todas las tiendas');
    }

    // Actualizar productos
    const products = await models.Product.findAll({ where: whereCondition });
    console.log('📦 Productos encontrados:', products.length);
    
    let affectedCount = 0;
    const newDiscount = parseFloat(discount.discountPercentage);
    
    // Aplicar descuento a TODOS los productos (sin condición)
    for (const product of products) {
      console.log(`  ✏️ ${product.name}: ${product.discount}% -> ${newDiscount}%`);
      
      await product.update({ 
        discount: newDiscount,
        isFlashSale: newDiscount >= 30 // Marcar como remate si >= 30%
      });
      affectedCount++;
    }
    
    console.log('✅ Total actualizados:', affectedCount);
    
    return { 
      message: 'Discount applied successfully',
      productsAffected: affectedCount
    };
  }

  // Remover descuento de productos
  async removeDiscount(discountId) {
    const discount = await this.findOne(discountId);
    
    const whereCondition = {
      discount: discount.discountPercentage
    };
    
    if (discount.applyToStoreId) {
      whereCondition.storeId = discount.applyToStoreId;
    }

    await models.Product.update(
      { discount: 0, isFlashSale: false },
      { where: whereCondition }
    );

    return { message: 'Discount removed successfully' };
  }

  // Verificar y aplicar descuentos activos
  async checkAndApplyActiveDiscounts() {
    const now = new Date();
    
    const activeDiscounts = await models.ScheduledDiscount.findAll({
      where: {
        isActive: true,
        startDate: { [Op.lte]: now },
        endDate: { [Op.gte]: now }
      }
    });

    const results = await Promise.all(
      activeDiscounts.map(discount => this.applyDiscount(discount.id))
    );

    return results;
  }
}

module.exports = ScheduledDiscountService;

module.exports = ScheduledDiscountService;