const uniqid =require('uniqid');

const generateRoomId = () => {
    randRoomId = uniqid.time();
    return randRoomId
}

module.exports = {generateRoomId}