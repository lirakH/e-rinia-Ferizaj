const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const WebSocket = require("ws");
require("dotenv").config();
const { Sequelize } = require("sequelize");
const volunteerRoutes = require("./routes/volunteerRoutes");
const organizationRoutes = require("./routes/organizationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const eventRoutes = require("./routes/eventRoutes");
const memberRoutes = require("./routes/memberRoutes");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

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
    console.log("Users table has been successfully created, if it does not exist");
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

// Store WebSocket connections by user ID
const connectedUsers = new Map();

wss.on("connection", (ws, req) => {
  // Assume that user ID is passed as a query parameter for simplicity
  const userId = req.url.split("?userId=")[1];
  if (userId) {
    connectedUsers.set(userId, ws);
    console.log(`User ${userId} connected`);

    ws.on("close", () => {
      connectedUsers.delete(userId);
      console.log(`User ${userId} disconnected`);
    });
  }

  ws.on("message", (message) => {
    console.log("Received message:", message);
  });
});

// Broadcast function to send notifications to all users
const broadcastEventNotification = (event) => {
  connectedUsers.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(event));
    }
  });
};

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { broadcastEventNotification };
