const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
require("dotenv").config();
const { Sequelize } = require("sequelize");
const volunteerRoutes = require("./routes/volunteerRoutes");
const organizationRoutes = require("./routes/organizationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const eventRoutes = require("./routes/eventRoutes");
const memberRoutes = require("./routes/memberRoutes");
const { wss } = require("./websocketUtils"); // Import the WebSocket server from the new module

const app = express();
const server = http.createServer(app);

const sequelize = require("./config/db");
const User = require("./models/volunteerModel");

const corsOptions = {
  origin: "*",
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

// Middleware to parse JSON bodies
app.use(express.json());

// Use routes
app.use("/api/volunteer", volunteerRoutes);
app.use("/api/organization", organizationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/member", memberRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 3000;

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
