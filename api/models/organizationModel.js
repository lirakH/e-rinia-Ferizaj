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
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      shortname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Organization",
      tableName: "organizations",
    }
  );

  return Organization;
};
