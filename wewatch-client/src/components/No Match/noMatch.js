import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";
import { Redirect } from "react-router-dom";

import './noMatch.css';

let socket;

// change to http://localhost:5000 for local development
// change to https://wewatch-server.herokuapp.com/ for production deployment
const ENDPOINT = 'https://wewatch-server.herokuapp.com/';

const cancelSession = () => {
    //todo: build out emission
    console.log("emit event to end session")
}

const tryAgain = () => {
    //todo: build out try again emission
    console.log("trying again")
}

const NoMatch = () => {
    const [name, setName] = useState('');
    const [hostName, setHostName] = useState('');
    const [roomId, setRoomId] = useState('');
    const [users, setUsers] = useState([]);

    const onClickStartSession = () => {
    }

    const cancelSession = () => {
    }
    
    return (
        <div className="noMatchHeroContainer">
            <h1>No Match :(</h1>
            <h2>There were no movies that the group agreed on watching </h2>
            <div className="buttonContainer">
            <button className={'button mt-20'} type="button" onClick={cancelSession}>Cancel</button>
            </div>
        </div>
    );
    }
 export default NoMatch