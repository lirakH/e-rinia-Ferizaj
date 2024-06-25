const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Organization extends sequelize.Sequelize.Model {}

  Organization.init(
    {
      // Define model attributes according to your schema
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      joinCode: {
        type: DataTypes.STRING,
        // allowNull defaults to true
      },
      picture: {
        type: DataTypes.STRING, // Changed from BLOB to STRING
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        // Or DataTypes.TEXT if you need more space
      },
      // Add a type attribute to your Organization model
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      // Add any other attributes as necessary
    },
    {
      sequelize,
      modelName: "Organization",
      tableName: "organizations",
      // Other model options
    }
  );

  return Organization;
};
