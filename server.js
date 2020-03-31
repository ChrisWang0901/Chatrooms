const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketio(server);
// Function to get a message
const getMessage = require("./messages");
const {
  joinUser,
  getCurrentUser,
  leaveChat,
  getRoomUsers
} = require("./users");
const chatBot = "ChatBot";

app.use(express.static(path.join(__dirname, "web")));

//run io
io.on("connection", socket => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = joinUser(socket.id, username, room);

    socket.join(user.room);

    socket.emit("message", getMessage(chatBot, "Welcome to the Chat!"));

    // Broadcast to all the other users
    socket.broadcast
      .to(user.room)
      .emit("message", getMessage(chatBot, `${user.username} just joined!`));

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // Disconnect
  //Emit message to server
  socket.on("chatMessage", msg => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", getMessage(user.username, msg));
  });

  socket.on("disconnect", () => {
    const user = leaveChat(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        getMessage(chatBot, `${user.username}  just left the chat`)
      );
    }
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });
});

server.listen(PORT, () => console.log(`Port ${PORT} is running`));
console.log(__dirname);
