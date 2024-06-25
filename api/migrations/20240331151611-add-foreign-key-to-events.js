"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint("events", {
      fields: ["organizationId"],
      type: "foreign key",
      name: "custom_fkey_organizationId",
      references: {
        table: "organizations",
        field: "id",
      },
      onDelete: "CASCADE", // Changed to CASCADE
      onUpdate: "CASCADE",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint(
      "events",
      "custom_fkey_organizationId"
    );
  },
};
