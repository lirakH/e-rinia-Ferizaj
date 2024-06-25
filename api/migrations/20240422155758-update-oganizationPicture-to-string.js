"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("organizations", "picture", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("organizations", "picture", {
      type: Sequelize.BLOB,
      allowNull: true,
    });
  },
};
