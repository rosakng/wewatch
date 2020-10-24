const { generateRoomId } = require('./utils')
const users = [];

// Add user to room
const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find((user) => user.room === room && user.name === name);

  if(!name || !room) return { error: 'Username and room are required.' };
  if(existingUser) return { error: 'Username is taken.' };

  const user = { id, name, room };

  users.push(user);

  return { user };
}

// generate unique room ID and add host
const addHost = ({ id, name }) => {
    name = name.trim().toLowerCase();

    if (!name) return { error: 'Username required.' };

    const room = generateRoomId()
    const user = { id, name, room };

    users.push(user);

    return { user };
}

// Remove user from room
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
  
    if(index !== -1) return users.splice(index, 1)[0];
}

// Get all users in one room
const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, addHost, removeUser, getUsersInRoom };