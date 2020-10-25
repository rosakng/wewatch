const generateRoomId = () => {
    //stubbedRoomId = 'ABCD' commented out just for now
    var uniqid =require('uniqid');

    randRoomId = uniqid.time();
    return randRoomId
}

module.exports = {generateRoomId}