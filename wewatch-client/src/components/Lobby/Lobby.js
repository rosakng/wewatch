import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";
import { Redirect } from "react-router-dom";

import './Lobby.css';

// change to http://localhost:5000 for local development
const ENDPOINT = 'https://wewatch-server.herokuapp.com/';

let socket;

const Lobby = ({location}) => {
    const [name, setName] = useState('');
    const [hostName, setHostName] = useState('');
    const [roomId, setRoomId] = useState('');
    const [users, setUsers] = useState([]);
    const [goSwipe, setGoSwipe] = useState(false);

    const onClickStartSession = () => {
        // TODO emit a specific user instead of the first of the user array
        console.log(users[0])
        socket.emit('begin', users[0], (error) => {
            console.log('inside')
            if (error) {
                alert(error);
            }
            console.log('starting');
        })
    }

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
            socket.on('roomCreation', ({ room , users, host}) => {
                setRoomId(room)
                setUsers(users)
                setHostName(host)
            })
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
        socket.on("roomData", ({ users, host }) => {
            setUsers(users);
            setHostName(host);
        });
    }, []);

    useEffect(() => {
        // set boolean for redirecting to swipe screen to be true, renders redirect component
        socket.on('sessionMembers', ({roomId, users, host}) => {
            // TODO do something with the returned data
            setGoSwipe(true);
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
                        if(element.name === name) {
                            return (<li>{element.name + " (You)"}</li>)
                        } else if (element.name === hostName) {
                            return (<li>{element.name + " (Host)"}</li>)
                        } else {
                            return (<li>{element.name}</li>)
                        }
                    })}
                </ul>
                {name === hostName 
                    ? 
                    <button className={'button mt-20'} type="button" onClick={onClickStartSession}>Start Session</button> 
                    :
                    <h2>Waiting for Host to start!</h2> 
                }
                { goSwipe ? <Redirect to='/swiping?room=${roomId}'/> : null }
            </div>
        </div>
    );
  }

  export default Lobby