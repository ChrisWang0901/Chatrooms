const socket = io();

const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const roomUsers = document.getElementById("users");

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

// Join room
socket.emit("joinRoom", { username, room });

// Get room an users
socket.on("roomUsers", ({ room, users }) => {
  roomName.innerText = room;
  roomUsers.innerHTML = `${users
    .map(user => `<li>${user.username}</li>`)
    .join("")}`;
});

socket.on("message", message => {
  console.log(message);
  OutputMessage(message);

  //Scroll the messages down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Message submit

chatForm.addEventListener("submit", e => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;

  // Emit message to server
  socket.emit("chatMessage", msg);

  // Clear text box
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Output message to DOM

function OutputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}
