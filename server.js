const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "web")));

//run io
io.on("connection", socket => {
  console.log("New Web Socket Connection");

  socket.emit("message", "Welcome Welcome!");

  // Broadcast to all the other users
  socket.broadcast.emit("message", "A user just joined!");

  // Disconnect
  socket.on("disconnect", () => {
    io.emit("message", "Someone just left");
  });

  //Emit message to server
  socket.on("chagMessage", msg => {
    io.emit("message", msg);
  });
});

server.listen(PORT, () => console.log(`Port ${PORT} is running`));
console.log(__dirname);
