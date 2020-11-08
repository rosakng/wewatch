import React, { useState,useEffect } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import { Container, Row, Col } from 'reactstrap';
import { Redirect } from "react-router-dom";
import queryString from 'query-string';

import socket from 'Socket'

import theme from 'styles/theme'
import StyledDiv from 'styles/styled-div';
import MovieDetail from 'views/swiping/movie-detail.js';

const SwipingContainer = (props) => {  
  const [noMatch, setNoMatch] = useState(false);

  const topTenMovies = props.location.state.topTenMovies;
  const roomId = props.location.state.roomId;

  const [index, setIndex]  = useState(0);
  const [title, setTitle] = useState(topTenMovies[index].title);
  const [imageURL, setImageUrl] = useState(topTenMovies[index].image)

  const iterateMovie = (index) => {
    setIndex(index + 1);
  };

  useEffect(() => {
    setTitle(topTenMovies[index].title);
    setImageUrl(topTenMovies[index].image);
  });
  
  const onClickDislike = () => {
    iterateMovie(index);
  };

  const onClickLike = () => {
    const movieId = topTenMovies[index].netflixid;
    socket.emit('like_event', {roomId: roomId, movieId: movieId, movieData: topTenMovies[index]});
    iterateMovie(index);
  }

    /**
     * This function returns the movie object from top10 that matches the given movie ID
     * @param {string} movieId 
     * @returns {object} movie object
     */
    const getMatchedMovie = (movieId) => {
        console.log(top10)
        console.log(top10[0])
        let i = 0;
        console.log(top10[i])
        // find movie that matches matched movie ID sent from backend
        while(top10[i].netflixid !== movieId){
            i++;
        }
        return top10[i];
    }

    useEffect(() => {
        const {room} = queryString.parse(props.location.search);
        setRoomId(room);
        console.log(top10)
    }, []);

    useEffect(() => {
        // set redirect boolean to true after match signal sent from backend
        socket.on('match found', ( {movieId} ) => {
            console.log(movieId)
            setMatchedMovie(getMatchedMovie(movieId));
            setGoMatch(true);
        })

        // socket.on('match found', () => {
        //     console.log('got match found signal from backend')
        //     // setMatchedMovie(getMatchedMovie(movieId));
        //     // setGoMatch(true);
        // })
        return () => {socket.off('match found')}
    }, []);
  //Todo: delete before deployment
  const nomatchtest = () =>{
    socket.emit('noMatch', roomId, (error) => {
        if (error) {
            alert(error);
        }
    })
  }

  //listen to the no match event
  useEffect(() => {
    socket.on('noMatchRedirect', () => {
        console.log("inside redirect")
        setNoMatch(true)
   });

  //listen to match event
    socket.on('matchRedirect', ({matchedMovieId, matchedMovieData}) => {
      console.log(matchedMovieId);
      console.log(matchedMovieData);
    });
  });

  return (
  <Container>
    { noMatch ? <Redirect to='/noMatch'/> : null }
    <button onClick={nomatchtest}>No Match test (will be removed)</button>
    <Row>
      <Col>
      {props.location.state.topTenMovies && (
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
              imageURL={imageURL}
              description="Inception is a 2010 science fiction action film written and directed by Christopher Nolan, who also produced the film with his wife, Emma Thomas. The film stars Leonardo DiCaprio as a professional thief who steals information by infiltrating the subconscious of his targets."
            />
          </StyledDiv>
          <InsertEmoticonIcon
            style={{ color: theme.colors.green, fontSize: '60px'}}
            fontSize="large"
            onClick={onClickLike}
          />
        </StyledDiv>
      )}
      </Col>
    </Row>
  </Container>
  );
};

export default SwipingContainer;
