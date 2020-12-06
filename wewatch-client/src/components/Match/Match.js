import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

import MatchMovieDetail from 'views/swiping//match-movie-detail.js';
import { Container, Row, Col } from 'reactstrap';
import StyledDiv from 'styles/styled-div';
import './Match.css';
import Layout from 'views/layout';
import socket from 'Socket';

const Match = (props) => {
    const movieData = props.location.state.matchedMovie;
    const isHost = props.location.state.isHost;
    const roomId = props.location.state.roomId;
    const name = props.location.state.name;

    const [tryAgain, setTryAgain] = useState(false);
    const [tryAgainHost, setTryAgainHost] = useState(false);
    const [newRoomId, setNewRoomId] = useState('');

    const tryAgainEmit = () => {
        socket.emit('try_again_event', {roomId: roomId})
    }

    //listen to try again event
    useEffect(() => {
        socket.on('tryAgainRedirectHost', () => {
            if (isHost) {
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
            <Container>
                <Col>
                    <Row>
                        <div class="text-container center">
                            { tryAgainHost ? <Redirect to={`/lobby?name=${name}&reset=${true}&oldRoomId=${roomId}`}/> : null}
                            { tryAgain ? <Redirect to={`/lobby?name=${name}&room=${newRoomId}`}/> : null}
                            <h1>It's a match!</h1>
                            <span>Everyone wants to watch:</span>
                        </div>
                    </Row>
                    <Row>
                        <StyledDiv alignItems="center" flexDirection="column">
                            <StyledDiv padding={2}>
                                <MatchMovieDetail
                                    title={movieData.title}
                                    year={movieData.released}
                                    lengthOfMovie={movieData.runtime}
                                    rating={movieData.rating}
                                    mediaType={movieData.type}
                                    imageURL={movieData.image}
                                    description={movieData.synopsis}
                                />
                            </StyledDiv>
                            {isHost ?
                                <StyledDiv height="100px" marginHorizontal={7}>
                                    <button className={'button mt-20'} type="button" onClick={tryAgainEmit}>Try Again</button>
                                </StyledDiv>
                                : null
                            }
                        </StyledDiv>
                    </Row>
                </Col>
            </Container>
        </Layout>
    );
}

export default Match;
