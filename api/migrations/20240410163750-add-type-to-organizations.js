"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Organizations", "type", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "NGO", // Assuming 'NGO' is your default value
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Organizations", "type");
  },
};
