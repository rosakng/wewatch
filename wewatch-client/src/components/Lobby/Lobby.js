import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import { Redirect } from "react-router-dom";

import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

import './Lobby.css';
import Layout from 'views/layout';
import socket from 'Socket'

const Lobby = ({location}) => {
    const [name, setName] = useState('');
    const [hostName, setHostName] = useState('');
    const [roomId, setRoomId] = useState('');
    const [users, setUsers] = useState([]);
    const [goSwipe, setGoSwipe] = useState(false);
    const [movieList, setMovieList] = useState(null);

    // filters
    const [genreIds, setGenreIds] = useState(null);
    const [genre, setGenre] = useState('all');
    const [sliderIrate, setSliderIrate] = useState([0, 10]);
    const [sliderNrate, setSliderNrate] = useState([0, 5]);

    const createGenreDropdown = () => {
        let genres = [];
        for (const key in genreIds){
            genres.push(<option value={key}>{key}</option>)
        }
        return genres;
    }

    const onClickStartSession = () => {
        // TODO emit a specific user instead of the first of the user array
        console.log(users[0])
        const filters = {genre: genre, genreId: genreIds[genre][0], minIrate:sliderIrate[0], maxIrate:sliderIrate[1],  minNrate:sliderNrate[0], maxNrate:sliderNrate[1]};
        socket.emit('begin', users[0], filters, (error) => {
            if (error) {
                alert(error);
            }
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
        
            socket.on('roomCreation', ({ room , users, host, genreIds }) => {
                setRoomId(room)
                setUsers(users)
                setHostName(host)
                setGenreIds(genreIds);

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
        socket.on('sessionMembers', ({roomId, users, host, movieList}) => {
            setGoSwipe(true);
            setMovieList(movieList);
            socket.emit('initialize_room', {roomId: roomId, numGuests: users.length, movies: movieList});
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
                    { goSwipe && movieList!=null ?
                        <Redirect to={{ 
                            pathname: '/swiping',
                            search:`?room=${roomId}`,
                            state: {
                                isHost: name == hostName,
                                name: name,
                                roomId: roomId,
                                movieList: movieList,
                            }}}
                        />
                        : null
                    }
                </div>
                { name === hostName && genreIds !== null?
                    <div className="container">
                    <h1>Filter by:</h1>
                    { genre !== 'all' || sliderIrate[0] >= 4 || sliderNrate[0] >= 2 ?
                        <div>
                        <Typography variant="body1" gutterBottom>
                            Note: This combination of filters might give you no movies!
                        </Typography>
                        </div> : null
                    }
                    <label>
                        Genre:
                        <select value={genre} onChange={(event) => {setGenre(event.target.value)}}>
                            {createGenreDropdown()}
                        </select>
                    </label>
                    <div>
                    <Typography id="range-slider" gutterBottom>
                        IMDB Rating range
                    </Typography>
                    <Slider
                        aria-labelledby="range-slider"
                        valueLabelDisplay="auto"
                        marks={true}
                        step={1}
                        min={0}
                        max={10}
                        value={sliderIrate}
                        onChange={(event, newValue) => {setSliderIrate(newValue)}}
                    />
                    </div>
                    <div>
                    <Typography id="range-slider" gutterBottom>
                        Netflix Rating range
                    </Typography>
                    <Slider
                        aria-labelledby="range-slider"
                        valueLabelDisplay="auto"
                        marks={true}
                        step={1}
                        min={0}
                        max={5}
                        value={sliderNrate}
                        onChange={(event, newValue) => {setSliderNrate(newValue)}}
                    />
                    </div>
                    </div> : null
                }
                
            </div>            
        </Layout>

    );
  }

  export default Lobby;
  
