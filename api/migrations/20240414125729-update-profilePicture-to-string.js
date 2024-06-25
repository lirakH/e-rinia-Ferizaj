"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("volunteers", "profilePicture", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("volunteers", "profilePicture", {
      type: Sequelize.BLOB,
      allowNull: true,
    });
  },
};
