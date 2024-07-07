// websocketUtils.js
const WebSocket = require("ws");

const connectedUsers = new Map();

const wss = new WebSocket.Server({ noServer: true });

wss.on("connection", (ws, req) => {
  const userId = req.url.split("?userId=")[1];
  if (userId) {
    connectedUsers.set(userId, ws);
    //console.log(`User ${userId} connected`);

    ws.on("close", () => {
      connectedUsers.delete(userId);
      //console.log(`User ${userId} disconnected`);
    });
  }

  ws.on("message", (message) => {
    console.log("Received message:", message);
  });
});

const broadcastEventNotification = (event) => {
  connectedUsers.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(event));
    }
  });
};

module.exports = { wss, broadcastEventNotification };
