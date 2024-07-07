const WebSocket = require("ws");

const wss = new WebSocket.Server({ noServer: true });

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

const broadcastEventNotification = (event) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(event));
    }
  });
};

module.exports = { wss, broadcastEventNotification };
