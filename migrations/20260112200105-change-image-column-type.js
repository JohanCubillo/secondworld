'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('categories', 'image', {
      type: Sequelize.TEXT,
      allowNull: true
    });
    
    await queryInterface.changeColumn('products', 'image', {
      type: Sequelize.TEXT,
      allowNull: true
    });
    
    await queryInterface.changeColumn('stores', 'logo', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('categories', 'image', {
      type: Sequelize.STRING(255),
      allowNull: true
    });
    
    await queryInterface.changeColumn('products', 'image', {
      type: Sequelize.STRING(255),
      allowNull: true
    });
    
    await queryInterface.changeColumn('stores', 'logo', {
      type: Sequelize.STRING(255),
      allowNull: true
    });
  }
};