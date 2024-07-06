// const { sequelize } = require("../config/db");
// const DataTypes = require("sequelize").DataTypes;

// const Volunteer = require("./volunteerModel")(sequelize, DataTypes);
// const Organization = require("./organizationModel")(sequelize, DataTypes);
// const FavoriteOrganizations = require("./favoriteOrganizationsModel")(
//   sequelize,
//   DataTypes
// );

// // Set up associations
// Volunteer.belongsToMany(Organization, {
//   through: FavoriteOrganizations,
//   foreignKey: "volunteerId",
//   otherKey: "organizationId",
// });
// Organization.belongsToMany(Volunteer, {
//   through: FavoriteOrganizations,
//   foreignKey: "organizationId",
//   otherKey: "volunteerId",
// });

// // Export models after association
// module.exports = {
//   Volunteer,
//   Organization,
//   FavoriteOrganizations,
// };
