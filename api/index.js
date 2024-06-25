const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const { Sequelize } = require("sequelize");
const volunteerRoutes = require("./routes/volunteerRoutes"); // Adjust the path as necessary
const organizationRoutes = require("./routes/organizationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const eventRoutes = require("./routes/eventRoutes");
const memberRoutes = require("./routes/memberRoutes"); // Adjust the path as necessary

const app = express();

const sequelize = require("./config/db"); // Adjust the path as necessary
const User = require("./models/volunteerModel"); // Adjust the path as necessary
const corsOptions = {
  origin: "http://localhost:5173", // Adjust this to match your frontend's origin
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Sync all models that are not already in the database
sequelize
  .sync()
  .then(() => {
    console.log(
      "Users table has been successfully created, if it does not exist"
    );
  })
  .catch((error) => {
    console.error("This error occurred", error);
  });

// Your server setup continues here...

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(express.json()); // Middleware to parse JSON bodies

// Use volunteer routes
app.use("/api/volunteer", volunteerRoutes);
// Use organization routes
app.use("/api/organization", organizationRoutes);
// Use admin routes
app.use("/api/admin", adminRoutes);
// Use event routes
app.use("/api/events", eventRoutes);

app.use("/api/member", memberRoutes);
//app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
