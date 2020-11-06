import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";
import { Redirect } from "react-router-dom";

import CloseIcon from '@material-ui/icons/Close';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import theme from 'styles/theme'
import StyledDiv from 'styles/styled-div';
import MovieDetail from 'views/swiping/movie-detail.js';
import inception from 'views/swiping/assets/Inception.png';

import './Lobby.css';

// change to http://localhost:5000 f or local development
// change to https://wewatch-server.herokuapp.com/ for production deployment
const ENDPOINT = 'http://localhost:5000';

let socket = io(ENDPOINT);

const Lobby = ({location}) => {
    const [name, setName] = useState('');
    const [hostName, setHostName] = useState('');
    const [roomId, setRoomId] = useState('');
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState('Lobby')
    const [cancel, setCancel] = useState(false);

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

    const nomatchtest = () =>{
        socket.emit('noMatch', roomId, (error) => {
            if (error) {
                alert(error);
            }
        })
      }

    useEffect(() => {
        const { name, room } = queryString.parse(location.search);
        console.log(name)
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
            console.log("inside session members");
            // TODO do something with the returned data
            setPage('Swiping');
        });
    }, []);

    useEffect(() => {
        socket.on('noMatchRedirect', () => {
            console.log("lobby success")
            setPage('NoMatch')
      });
    }, []);

    //takes user back to landing page
    const cancelSession = () => {
        setCancel(true);
    }

    //MAIN PAGES
    function LobbyPage(props) {
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
                </div>
            </div>
        ); 
    }

    function NoMatch() {
        return (
            <div className="noMatchHeroContainer">
            { cancel ? <Redirect to='/'/> : null }
                <h1>No Match :(</h1>
                <h2>There were no movies that the group agreed on watching </h2>
                <div className="buttonContainer">
                <button className={'button mt-20'} type="button" onClick={cancelSession}>Cancel</button>
                </div>
            </div>
        );
    }

    function Swiping(props){
        console.log(props)
        return( <StyledDiv paddingLeft="512">
        <StyledDiv width="30%" flex alignItems="center">
        <button onClick={nomatchtest}>test</button>
        <CloseIcon
          style={{ color: theme.colors.green }}
          fontSize="large"
        />
        <MovieDetail
          title="Inception"
          year="2016"
          lengthOfMovie="2h 28m"
          rating="8/10"
          genre="Thriller"
          image={inception}
          description="Inception is a 2010 science fiction action film written and directed by Christopher Nolan, who also produced the film with his wife, Emma Thomas. The film stars Leonardo DiCaprio as a professional thief who steals information by infiltrating the subconscious of his targets."
        />
        <InsertEmoticonIcon
          style={{ color: theme.colors.red }}
          fontSize="large"
        />
        </StyledDiv>
      </StyledDiv>)
    }

    if (page == "Lobby"){
        return <LobbyPage/>;
    } else if (page == "Swiping") {
        return <Swiping data = {{movieTitle: 'Xd', rating: '10'}}/>;
    } else if (page == "NoMatch") {
        return <NoMatch/>;
    }
  }

  export default Lobby
