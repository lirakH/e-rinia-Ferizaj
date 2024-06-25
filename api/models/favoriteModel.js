// "use strict";
// const { Model, DataTypes } = require("sequelize");
// const sequelize = require("../config/db");

// class FavoriteOrganizations extends Model {}
// FavoriteOrganizations.init(
//   {
//     volunteerId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: "Volunteers", // Ensure this is the correct model name
//         key: "id",
//       },
//     },
//     organizationId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: "Organizations", // Ensure this is the correct model name
//         key: "id",
//       },
//     },
//   },
//   {
//     sequelize,
//     modelName: "FavoriteOrganizations",
//     // Optionally, specify the table name if different from the model name
//     tableName: "favoriteorganizations",
//   }
// );
// module.exports = FavoriteOrganizations;
// models/favoriteOrganizationsModel.js

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class FavoriteOrganizations extends sequelize.Sequelize.Model {}

  FavoriteOrganizations.init(
    {
      volunteerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Volunteers", // This reference is symbolic and for informational purposes. Actual FK constraints are managed separately.
          key: "id",
        },
      },
      organizationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Organizations", // As above, this is primarily informational unless you're using Sequelize to manage schema migrations.
          key: "id",
        },
      },
      // You can add more fields here if necessary
    },
    {
      sequelize,
      modelName: "FavoriteOrganizations",
      tableName: "favoriteorganizations",
      // Other model options
    }
  );

  return FavoriteOrganizations;
};
