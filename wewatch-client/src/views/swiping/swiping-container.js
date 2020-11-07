import React, { useState, useEffect } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import { Container, Row, Col } from 'reactstrap';
import { Redirect } from "react-router-dom";

import socket from 'Socket'

import theme from 'styles/theme'
import StyledDiv from 'styles/styled-div';
import MovieDetail from 'views/swiping/movie-detail.js';

const SwipingContainer = (props) => {
  // test emit to be replaced by swiping actions
  //socket.emit('I am emitted from an imported socket!')
  
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
    iterateMovie(index);
    const movieId = topTenMovies[index].netflixid;
    socket.emit('like_event', {roomId: roomId, movieId: movieId});
  }

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
        console.log("insinde redirect")
        setNoMatch(true)
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
