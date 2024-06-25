// models/index.js

const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const initVolunteer = require("./volunteerModel");
const initOrganization = require("./organizationModel");
const initFavoriteOrganizations = require("./favoriteModel");
const initAdmin = require("./adminModel");
const initEvent = require("./eventModel");
const initMember = require("./memberModel");

const Volunteer = initVolunteer(sequelize, DataTypes);
const Organization = initOrganization(sequelize, DataTypes);
const FavoriteOrganizations = initFavoriteOrganizations(sequelize, DataTypes);
const Admin = initAdmin(sequelize, DataTypes);
const Event = initEvent(sequelize, DataTypes);
const Member = initMember(sequelize, DataTypes);
// After initializing all models...
// Example association setup within models/index.js

Volunteer.belongsToMany(Organization, {
  through: FavoriteOrganizations,
  foreignKey: "volunteerId",
});
Organization.belongsToMany(Volunteer, {
  through: FavoriteOrganizations,
  foreignKey: "organizationId",
});

// Additionally, if you want to be able to directly query FavoriteOrganizations
// and include the Organization model, you need to explicitly define that relationship too.
FavoriteOrganizations.belongsTo(Organization, { foreignKey: "organizationId" });
Organization.hasMany(FavoriteOrganizations, { foreignKey: "organizationId" });

// In your model associations file or wherever you set them up
Organization.hasMany(Member, { as: "members" });
Member.belongsTo(Organization);

// Setup associations
Object.values(sequelize.models).forEach((model) => {
  if (model.associate) {
    model.associate(sequelize.models);
  }
});

module.exports = {
  sequelize,
  Volunteer,
  Organization,
  FavoriteOrganizations,
  Admin,
  Event,
  Member,
};
