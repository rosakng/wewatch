import React, { useState,useEffect } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import { Container, Row, Col } from 'reactstrap';
import { Redirect } from "react-router-dom";

import socket from 'Socket';

import theme from 'styles/theme';
import StyledDiv from 'styles/styled-div';
import Layout from 'views/layout';
import Tooltip from 'views/tooltip';
import ToolTipIcon from 'views/assets/tooltipIcon';
import MovieDetail from 'views/swiping/movie-detail.js';

const SwipingContainer = (props) => {  
  const [noMatch, setNoMatch] = useState(false);
  const [match, setMatch] = useState(false);
  const [matchedMovie, setMatchedMovie] = useState({});
  const [SwipingCompleted, setSwipingCompleted] = useState(false);

  const topTenMovies = props.location.state.topTenMovies;
  const roomId = props.location.state.roomId;
  const isHost = props.location.state.isHost;
  const name = props.location.state.name;

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
        setNoMatch(true);
   });

   return () => { socket.off('noMatchRedirect')};

  });

  useEffect(() => {
      //listen to match event
      socket.on('matchRedirect', ({matchedMovieId, matchedMovieData}) => {
        setMatchedMovie(matchedMovieData);
        setMatch(true);
      });
  
      return () => { socket.off('matchRedirect')};
  })

  function SwipingCompletedScreen () {
    return(
      <Layout>
        <Container>{ match && matchedMovie != null ? <Redirect to={{ 
      pathname: '/match',
      state: {matchedMovie: matchedMovie}
      }}/>: null }
      { noMatch ? <Redirect to={{
        pathname: '/noMatch',
        state: {isHost: isHost,
                roomId: roomId,
                name: name}
      }}/> : null }<h1 style={{'text-align': "center", 'margin-top': '60px'}}>You've seen all potential movies for recommendation, please wait as your the others finish swiping!</h1>
        </Container>
      </Layout>
      
    )
  }

  if (!SwipingCompleted){
  return (
    <Layout>
      <StyledDiv flex paddingLeft={4} marginTop={3}>
          <StyledDiv>Start Swiping!</StyledDiv>
          <Tooltip
            text={`Click the happy face if you would like to watch the movie, or click the X otherwise!`}
          >
            <ToolTipIcon fill={theme.colors.gray[2]} size="25px" />
          </Tooltip>
        </StyledDiv>
      <Container>
            { match && matchedMovie != null ? <Redirect to={{ 
                                pathname: '/match',
                                state: {matchedMovie: matchedMovie}
                            }}/>: null }
    { noMatch ? <Redirect to={{
                                pathname: '/noMatch',
                                state: {isHost: isHost,
                                        roomId: roomId,
                                        name: name}
                              }}/> : null }}
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
