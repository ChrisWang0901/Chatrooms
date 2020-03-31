const socket = io();

const chatForm = document.getElementById("chat-form");

socket.on("message", message => {
  console.log(message);
});

//Message submit

chatForm.addEventListener("submit", e => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;

  // Emit message to server
  socket.emit("chatMessage", msg);
});

// Output message to DOM

function OutputMessage(message) {
  const div = document.createElement("div");
}
