const { Sequelize } = require("sequelize");

// Option 1: Passing parameters separately to the constructor
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST, // e.g. 'localhost'
    dialect: "mysql", // Here we specify we're using MySQL
    port: process.env.DB_PORT || 3306, // Default MySQL port
    logging: false, // Disable logging; default is console.log. Set true if you want to see SQL queries in the console.
    pool: {
      // Connection pool settings
      max: 5, // Maximum number of connection in pool
      min: 0, // Minimum number of connection in pool
      acquire: 30000, // The maximum time, in milliseconds, that a connection can be idle before being released
      idle: 10000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
    },
  }
);

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = sequelize;
