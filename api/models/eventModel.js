// const { Model, DataTypes } = require("sequelize");
// const sequelize = require("../config/db"); // Adjust this to your Sequelize connection
// const Organization = require("./organizationModel"); // Make sure the path is correct

// class Event extends Model {}

// Event.init(
//   {
//     // Model attributes are defined here
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     picture: {
//       type: DataTypes.BLOB,
//     },
//     place: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     date: {
//       type: DataTypes.DATE,
//       allowNull: false,
//     },
//     description: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     approved: {
//       type: DataTypes.BOOLEAN,
//       allowNull: false,
//       defaultValue: false,
//     },
//     organizationId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//   },
//   {
//     sequelize,
//     modelName: "Event",
//     tableName: "events",
//   }
// );

// Event.belongsTo(Organization, {
//   foreignKey: "organizationId",
//   as: "organization",
// });

// // Make sure to establish the reverse association in the place where both models are available
// // This could be in this file, another model file, or a separate associations setup file

// module.exports = Event;
// // models/eventModel.js
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {}

  Event.init(
    {
      // Model attributes
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      picture: {
        type: DataTypes.STRING, // Changed from BLOB to STRING
        allowNull: true,
      },
      place: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      approved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      organizationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Event",
      tableName: "events",
    }
  );

  Event.associate = (models) => {
    Event.belongsTo(models.Organization, {
      foreignKey: "organizationId",
      as: "organization",
    });
    // If there's a reverse association
    // models.Organization.hasMany(Event, { as: 'events' });
  };

  return Event;
};
