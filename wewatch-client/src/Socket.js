import io from "socket.io-client";

// change to http://localhost:5000 for local development
const ENDPOINT  = 'http://localhost:5000';

// change to https://wewatch-server.herokuapp.com/ for production deployment
// const ENDPOINT = 'https://wewatch-server.herokuapp.com/';

let socket = io(ENDPOINT)

export default socket
