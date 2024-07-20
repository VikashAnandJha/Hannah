// Import dependencies
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");

// Create the app and server
const app = express();
app.use(
  cors({
    origin: "*", // Allow only the client with entering the url of client
  })
);
const server = http.createServer(app);
const io = socketIO(server);

app.get("/", (req, res) => {
  res.send("Server is running.");
});

// Handle new socket connections
io.on("connection", (socket) => {
  console.log("new client: ", socket.handshake.auth.username);
  // Handle incoming audio stream
  socket.on("audioStream", (audioData) => {
    // console.log({ audioData });
    socket.emit("audioStream", audioData);
  });
  sendParticipantsList(io);

  socket.on("disconnect", () => {
    sendParticipantsList(io);
  });
});

function sendParticipantsList(io) {
  // broadcast Users
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      username: socket.handshake.auth.username,
    });
  }
  console.log("emitting users: ", users);
  io.emit("users", users);
}

// Start the server
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
