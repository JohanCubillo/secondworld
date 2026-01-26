'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('order_items', 'product_image', {
      type: Sequelize.TEXT,
      allowNull: true
    });
    
    await queryInterface.changeColumn('orders', 'sinpe_proof', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('order_items', 'product_image', {
      type: Sequelize.STRING(255),
      allowNull: true
    });
    
    await queryInterface.changeColumn('orders', 'sinpe_proof', {
      type: Sequelize.STRING(255),
      allowNull: true
    });
  }
};