import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";
import { Link } from "react-router-dom";

import './Lobby.css';

const ENDPOINT = 'http://localhost:5000';

let socket;

const Lobby = ({location}) => {
    const [name, setName] = useState('');
    const [hostName, setHostName] = useState('');
    const [roomId, setRoomId] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        socket = io(ENDPOINT);

        const { name, room } = queryString.parse(location.search);

        // host user does not have room ID in query params
        if (room === undefined){ 
            socket.emit('create', { name }, (error) => {
                if (error) {
                    alert(error);
                }
            });
            socket.on('roomCreation', ({ room , users}) => {
                setRoomId(room)
                setUsers(users)
            })
            setHostName(name)
            setName(name);
        }
        else {
            // guest is joining room
            socket.emit('join', { name, room }, (error) => {
                if (error) {
                    alert(error);
                }
            });
            setRoomId(room);
            setName(name);
        }

        return () => {
            socket.close();
        }
    }, [ENDPOINT, location.search]);

    useEffect(() => {
        socket.on("roomData", ({ users }) => {
            setUsers(users);
        });
    }, []);

    return (
        <div className="outerContainer">
            <div className="container">
                <h1>Welcome to {hostName}'s Lobby</h1>
                <h2>Lobby ID: {roomId} </h2>
                <h2>In the lobby:</h2>
                <ul>
                    {users.map(element => {
                        return (<li>{element.name}</li>)
                    })}
                </ul>
                {name === hostName 
                    ? 
                    <Link onClick={e => (!name) ? e.preventDefault() : null} to={`/swiping?room=${roomId}`}>
                    <button className={'button mt-20'} type="submit">Start Session</button>
                    </Link> 
                    :
                    <h2>Waiting for Host to start!</h2> 
                }
            </div>
        </div>
    );
  }

  export default Lobby