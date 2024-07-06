const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  class Member extends sequelize.Sequelize.Model {}

  Member.init(
    {
      // Define model attributes according to your schema
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      organizationId: {
        type: DataTypes.INTEGER,
        references: {
          model: "organizations", // Reference to the table, should be in lowercase if that's how it's defined
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      position: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      profilePicture: {
        type: DataTypes.STRING, // Changed from BLOB to STRING
        allowNull: true, // Or DataTypes.STRING if you store URLs to images
      },
      // Add any other attributes as necessary
    },
    {
      sequelize,
      modelName: "Member",
      tableName: "members",
      // Other model options
    }
  );

  return Member;
};
