import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import { Redirect } from "react-router-dom";

import './Lobby.css';
import Layout from 'views/layout';
import socket from 'Socket'

const Lobby = ({location}) => {
    const [name, setName] = useState('');
    const [hostName, setHostName] = useState('');
    const [roomId, setRoomId] = useState('');
    const [users, setUsers] = useState([]);
    const [goSwipe, setGoSwipe] = useState(false);
    const [topTenMovies, setTopTenMovies] = useState(null);

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
        const { name, room, reset, oldRoomId } = queryString.parse(location.search);

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

                if (reset){
                    socket.emit('tryAgainUser', {oldRoomId: oldRoomId, newRoomId: room});
                }
            })
            setName(name);
            return () => { socket.off('roomCreation')};
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


    }, [location.search]);

    useEffect(() => {
        socket.on("roomData", ({ users, host }) => {
            setUsers(users);
            setHostName(host);
        });

        return () => {socket.off('roomData')};
    }, []);

    useEffect(() => {
        // set boolean for redirecting to swipe screen to be true, renders redirect component
        socket.on('sessionMembers', ({roomId, users, host, top10}) => {
            setGoSwipe(true);
            setTopTenMovies(top10);
            socket.emit('initialize_room', {roomId: roomId, numGuests: users.length, movies: top10});
        });
        return () => {socket.off('sessionMembers')};
    }, []);

    return (
        <Layout>
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
                    { goSwipe && topTenMovies!=null ? <Redirect to={{ 
                                    pathname: '/swiping',
                                    search:`?room=${roomId}`,
                                    state: {
                                        roomId: roomId,
                                        topTenMovies: topTenMovies,
                                    }
                                }}
                                /> : null }
                </div>
            </div>            
        </Layout>

    );
  }

  export default Lobby
  
