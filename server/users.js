const { generateRoomId } = require('./utils')
const users = [];

// key: value => roomId: hostName
const rooms = {}; 

// Add user to room
const addUser = ({ id, name, room: roomId }) => {
  const existingUser = users.find((user) => user.room === roomId && user.name === name);
  
  if(!name || !roomId) return { error: 'Username and room are required.' };
  if(existingUser) return { error: 'Username is taken.' };

  const user = { id, name, room: roomId };

  users.push(user);

  return { user };
}

// generate unique room ID, add host to list of users and add host
const addHost = ({ id, name: hostName }) => {
    if (!hostName) return { error: 'Username required.' };

    const roomId = generateRoomId()
    const user = { id, name: hostName, room: roomId };

    // Add user to user array, add room to room dict
    users.push(user);
    rooms[roomId] = hostName;

    return { user };
}

// Remove user from room
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
  
    if(index !== -1) return users.splice(index, 1)[0];
}

// Get all users in one room
const getUsersInRoom = (room) => users.filter((user) => user.room === room);

const getHost = (roomId) => rooms[roomId]

module.exports = { addUser, addHost, removeUser, getUsersInRoom, getHost};