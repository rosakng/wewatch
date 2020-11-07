import React, { useState,useEffect } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import { Container, Row, Col } from 'reactstrap';
import { Redirect } from "react-router-dom";
import queryString from 'query-string';

import theme from 'styles/theme'
import StyledDiv from 'styles/styled-div';
import MovieDetail from 'views/swiping/movie-detail.js';
import socket from 'Socket'


const SwipingContainer = (props) => {
    socket.emit('I am emitted from an imported socket!');
    console.log(socket);
    // socket.emit('match test');
    const [roomId, setRoomId] = useState('');
    const [title, setTitle] = useState('Inception');
    const [top10, setTop10] = useState(props.location.state.top10);
    const [goMatch, setGoMatch] = useState(false);
    const [matchedMovie, setMatchedMovie] = useState({});

    const onClickDislike = () => {
        console.log("dislike");
    }
    const onClickLike = () => {
        console.log("like");
    setTitle("Monkey");
    }

    const matchTest = () => {
        console.log('attempting to emit')
        let movieId = 70059700;
        let user = {room: roomId};
        socket.emit('match test');
    }

    /**
     * This function returns the movie object from top10 that matches the given movie ID
     * @param {string} movieId 
     * @returns {object} movie object
     */
    const getMatchedMovie = (movieId) => {
        let i = 0;
        // find movie that matches matched movie ID sent from backend
        while(top10[i].netflixid !== movieId){
            i++;
        }
        return top10[i];
    }

    useEffect(() => {
        const {room} = queryString.parse(props.location.search)
        console.log(room)
        setRoomId(room)
        console.log(props)
    }, []);

    useEffect(() => {
        // set redirect boolean to true after match signal sent from backend
        // socket.on('match found', ( {movieId} ) => {
        //     console.log(movieId)
        //     setMatchedMovie(getMatchedMovie(movieId));
        //     setGoMatch(true);
        // })

        socket.on('match found', () => {
            console.log('got match found signal from backend')
            // setMatchedMovie(getMatchedMovie(movieId));
            // setGoMatch(true);
        })
    }, []);
    return (
    <Container>
    <Row>
        <Col>
        <StyledDiv flex alignItems="center" marginTop={2}>
        <CloseIcon
            style={{ color: theme.colors.red, fontSize: '60px'}}
            onClick={onClickDislike}
        />
        <StyledDiv padding={2}>
            <MovieDetail
            title={title}
            year="2016"
            lengthOfMovie="2h 28m"
            rating="8/10"
            genre="Thriller"
            imageURL="https://2.bp.blogspot.com/_Iau3R3yMIr4/TMBDGzcvwSI/AAAAAAAACbQ/77grl8TYdK4/s1600/inception1.jpg"
            description="Inception is a 2010 science fiction action film written and directed by Christopher Nolan, who also produced the film with his wife, Emma Thomas. The film stars Leonardo DiCaprio as a professional thief who steals information by infiltrating the subconscious of his targets."
            />
        </StyledDiv>
        <InsertEmoticonIcon
            style={{ color: theme.colors.green, fontSize: '60px'}}
            fontSize="large"
            onClick={onClickLike}
        />
        </StyledDiv>
        </Col>
    </Row>
    <Row>
    <button className={'button mt-20'} type="button" onClick={matchTest}>Match</button> 
    { goMatch ? <Redirect to={{ 
                        pathname: "/match",
                        state: {matched: matchedMovie}
                    }}
                /> : null }
    </Row>
    </Container>

    );
};

export default SwipingContainer;
