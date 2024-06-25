"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("members", "profilePicture", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("members", "profilePicture", {
      type: Sequelize.BLOB,
      allowNull: true,
    });
  },
};
