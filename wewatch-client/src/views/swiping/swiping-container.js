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
  const [match, setMatch] = useState(false);
  const [matchedMovie, setMatchedMovie] = useState({});
  const [SwipingCompleted, setSwipingCompleted] = useState(false);

  const topTenMovies = props.location.state.topTenMovies;
  const roomId = props.location.state.roomId;

  const [index, setIndex]  = useState(0);
  const [title, setTitle] = useState(topTenMovies[index].title);
  const [imageURL, setImageUrl] = useState(topTenMovies[index].image)

  const iterateMovie = (index) => {
    if(index !== (topTenMovies.length - 1)) {
      setIndex(index + 1);
    } else {
      setSwipingCompleted(true)
    }
  };

  useEffect(() => {
    setTitle(topTenMovies[index].title);
    setImageUrl(topTenMovies[index].image);
  });
  
  const onClickDislike = () => {
    socket.emit('dislike_event', {roomId: roomId});
    iterateMovie(index);
  };

  const onClickLike = () => {
    const movieId = topTenMovies[index].netflixid;
    socket.emit('like_event', {roomId: roomId, movieId: movieId, movieData: topTenMovies[index]});
    iterateMovie(index);
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
      setMatchedMovie(matchedMovieData);
      setMatch(true);
    });
  });

  function SwipingCompletedScreen () {
    return(<Container><h1 style={{'text-align': "center", 'margin-top': '60px'}}>You've seen all potential movies for recommendation, please wait as your the others finish swiping!</h1></Container>)

  }

  if (!SwipingCompleted){
  return (
  <Container>
    { match && matchedMovie != null ? <Redirect to={{ 
                                pathname: '/match',
                                state: {matchedMovie: matchedMovie}
                            }}/>: null }
    { noMatch ? <Redirect to='/noMatch'/> : null }
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
  );}
  else if (SwipingCompleted) {
    return(<SwipingCompletedScreen/>)
  }
};

export default SwipingContainer;
