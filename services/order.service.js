const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');
const EmailService = require('./email.service');
const crypto = require('crypto');

class OrderService {
  constructor() {
    this.emailService = new EmailService();
  }

  // Generar token único para rastreo
  generateTrackingToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  async create(data) {
    const newOrder = await models.Order.create(data);
    return newOrder;
  }

  async createWithItems(orderData, items) {
    // Generar token único
    const trackingToken = this.generateTrackingToken();
    
    // Crear orden con token
    const order = await models.Order.create({
      ...orderData,
      trackingToken
    });
    
    // Crear items y reducir stock
    const orderItems = await Promise.all(
      items.map(async (item) => {
        // Reducir stock del producto
        const product = await models.Product.findByPk(item.productId);
        if (product) {
          const newStock = product.stock - item.quantity;
          await product.update({ stock: newStock });
        }
        
        return await models.OrderItem.create({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          productName: item.productName,
          productImage: item.productImage
        });
      })
    );
    
    // Obtener orden completa con items
    const fullOrder = await this.findOne(order.id);
    
    // Enviar email de confirmación
    try {
      await this.emailService.sendOrderConfirmation(fullOrder);
      console.log('✅ Email de confirmación enviado a:', fullOrder.customerEmail);
    } catch (error) {
      console.error('❌ Error enviando email:', error);
      // No fallar la orden si el email falla
    }
    
    return fullOrder;
  }

  async find() {
    const orders = await models.Order.findAll({
      include: [
        {
          association: 'items',
          include: ['product']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    return orders;
  }

  async findOne(id) {
    const order = await models.Order.findByPk(id, {
      include: [
        {
          association: 'items',
          include: ['product']
        }
      ]
    });
    if (!order) {
      throw boom.notFound('Order not found');
    }
    return order;
  }

  async findByToken(token) {
    const order = await models.Order.findOne({
      where: {
        trackingToken: token
      },
      include: [
        {
          association: 'items',
          include: ['product']
        }
      ]
    });
    if (!order) {
      throw boom.notFound('Order not found');
    }
    return order;
  }

  async findByEmailAndId(email, orderId) {
    const order = await models.Order.findOne({
      where: {
        id: orderId,
        customerEmail: email
      },
      include: [
        {
          association: 'items',
          include: ['product']
        }
      ]
    });
    if (!order) {
      throw boom.notFound('Order not found');
    }
    return order;
  }

  async update(id, changes) {
    const order = await this.findOne(id);
    const result = await order.update(changes);
    return result;
  }

  async delete(id) {
    const order = await this.findOne(id);
    await order.destroy();
    return { id };
  }
}

module.exports = OrderService;