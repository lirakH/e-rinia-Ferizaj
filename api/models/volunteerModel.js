// // models/volunteerModel.js

// const { Model, DataTypes } = require("sequelize");
// const sequelize = require("../config/db");
// const Organization = require("./organizationModel");
// const FavoriteOrganizations = require("./favoriteModel");

// class Volunteer extends Model {
//   // Optionally, you can still include simple instance methods related to the volunteer's data here
//   // For example, methods to get a formatted name, or to validate data fields, etc.
// }

// Volunteer.init(
//   {
//     // Model attributes are defined here
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//     },
//     password: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     profilePicture: {
//       type: DataTypes.BLOB, // Or DataTypes.STRING if you store URLs to images
//     },
//     // Add other attributes based on your requirements
//   },
//   {
//     sequelize,
//     modelName: "Volunteer",
//     tableName: "volunteers", // Define the table name if you don't want Sequelize to infer it
//     timestamps: true, // True if you want Sequelize to handle createdAt and updatedAt
//     // You can also set other model options here
//   }
// );

// // Here you would also define any associations this model has with other models
// // For example:
// // Volunteer.belongsTo(Organization);
// // Volunteer.hasMany(Event);
// // Volunteer.associate = function (models) {
// //   Volunteer.belongsToMany(models.Organization, {
// //     through: "FavoriteOrganizations",
// //     foreignKey: "volunteerId",
// //   });
// // };
// // Assuming Volunteer model is defined above
// // Volunteer.associate = (models) => {
// //   Volunteer.belongsToMany(Organization, {
// //     through: FavoriteOrganizations,
// //     foreignKey: "volunteerId",
// //     otherKey: "organizationId",
// //   });
// // };

// module.exports = Volunteer;
// models/volunteerModel.js

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Volunteer extends sequelize.Sequelize.Model {}

  Volunteer.init(
    {
      // Model attributes are defined here
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profilePicture: {
        type: DataTypes.STRING, // Changed from BLOB to STRING
        allowNull: true, // Or DataTypes.STRING if you store URLs to images
      },
      // Add other attributes based on your requirements
    },
    {
      sequelize,
      modelName: "Volunteer",
      tableName: "volunteers",
      timestamps: true,
    }
  );

  return Volunteer;
};
