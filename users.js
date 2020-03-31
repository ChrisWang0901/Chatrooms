const users = [];

//Join user to chat

function joinUser(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return user;
}

function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

function leaveChat(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    const user = users.splice(index, 1)[0];
    console.log(user);
    return user;
  }
}
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

module.exports = { joinUser, getCurrentUser, leaveChat, getRoomUsers };
