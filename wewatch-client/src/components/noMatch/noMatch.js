import React, { useState, useEffect  } from "react";
import { Redirect } from "react-router-dom";

import socket from 'Socket';

import './noMatch.css';
import Layout from 'views/layout';

const NoMatch = (props) => {
    const [cancel, setCancel] = useState(false);
    const [tryAgain, setTryAgain] = useState(false);
    const [tryAgainHost, setTryAgainHost] = useState(false);
    const [newRoomId, setNewRoomId] = useState('');
    const isHost = props.location.state.isHost;
    const roomId = props.location.state.roomId;
    const name = props.location.state.name

    //takes user back to landing page
    const cancelSession = () => {
        setCancel(true);
    }

    const tryAgainEmit = () => {
        //emit try again event
        socket.emit('try_again_event', {roomId: roomId})

    }

    //listen to try again event
    useEffect(() => {
        
        socket.on('tryAgainRedirectHost', () => {
            console.log(props)
            if (isHost) {
                console.log("here")
                setTryAgainHost(true);
            } 
       })
       return () => { socket.off('tryAgainRedirectHost')};
    });

    //listen to try again event for users
    useEffect(() => { 
    socket.on('tryAgainRedirectUser', ({newRoomId}) => {
        setNewRoomId(newRoomId)
        setTryAgain(true);
    });
    return () => { socket.off('tryAgainRedirectUser')};
    })
    
    return (
        <Layout>
            <div className="noMatchHeroContainer">
            { tryAgainHost ? <Redirect to={`/lobby?name=${name}&reset=${true}&oldRoomId=${roomId}`}/> : null}
        	{ tryAgain ? <Redirect to={`/lobby?name=${name}&room=${newRoomId}`}/> : null}
            { cancel ? <Redirect to='/'/> : null }
                <h1>No Match :(</h1>
                <h2>There were no movies that the group agreed on watching </h2>
                <div className="buttonContainer">
                {isHost ? <button className={'button mt-20'} type="button" onClick={tryAgainEmit}>Try Again</button> : null}
                    <button className={'button mt-20'} type="button" onClick={cancelSession}>Cancel</button>
                </div>
            </div>
        </Layout>
        
    );
    }
 export default NoMatch
