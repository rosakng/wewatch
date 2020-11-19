import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";

import './Chat.css';
import Layout from 'views/layout';

const ENDPOINT = 'http://localhost:5000';

let socket;

const Chat = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const { name, room } = queryString.parse(location.search);

        socket = io(ENDPOINT);

        setRoom(room);
        setName(name);

        socket.emit('join', { name, room }, (error) => {
            if (error) {
                alert(error);
            }
        });
    }, [ENDPOINT, location.search]);

    useEffect(() => {
        socket.on("roomData", ({ users }) => {
            setUsers(users);
        });
    }, []);

    return (
        <Layout>
            <div className="outerContainer">
                <div className="container">
                    <ul>
                        {users.map(element => {
                            return (<li>{element.name}</li>)
                        })}
                    </ul>
                </div>
            </div>            
        </Layout>

    );
}

export default Chat;
