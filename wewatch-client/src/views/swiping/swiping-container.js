import React, { useState,useEffect } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import { Container, Row, Col } from 'reactstrap';
import { Redirect } from "react-router-dom";

import socket from 'Socket';

import theme from 'styles/theme';
import StyledDiv from 'styles/styled-div';
import Layout from 'views/layout';
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
  const [imageURL, setImageUrl] = useState(topTenMovies[index].image);
  const [year, setYear] = useState(topTenMovies[index].released);
  const [lengthOfMovie, setLengthOfMovie] = useState(topTenMovies[index].duration);
  const [rating, setRating] = useState(topTenMovies[index].rating);
  const [mediaType, setmediaType] = useState(topTenMovies[index].type);
  const [description, setDescription] = useState(topTenMovies[index].synopsis);

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
    setYear(topTenMovies[index].released);
    setLengthOfMovie(topTenMovies[index].runtime);
    setRating(topTenMovies[index].rating);
    setmediaType(topTenMovies[index].type);
    setDescription(topTenMovies[index].synopsis);
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
        console.log("inside redirect");
        setNoMatch(true);
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
    return(
      <Layout>
        <Container>{ match && matchedMovie != null ? <Redirect to={{ 
        pathname: '/match',
        state: {matchedMovie: matchedMovie}
        }}/>: null }
        { noMatch ? <Redirect to='/noMatch'/> : null }<h1 style={{'text-align': "center", 'margin-top': '60px'}}>You've seen all potential movies for recommendation, please wait as your the others finish swiping!</h1>
        </Container>
      </Layout>
      
    )
  }

  if (!SwipingCompleted){
  return (
    <Layout>
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
                    year={year}
                    lengthOfMovie={lengthOfMovie}
                    rating={rating}
                    mediaType={mediaType}
                    imageURL={imageURL}
                    description={description}
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
    </Layout>
  );}
  else if (SwipingCompleted) {
    return(<SwipingCompletedScreen/>)
  }
};

export default SwipingContainer;
