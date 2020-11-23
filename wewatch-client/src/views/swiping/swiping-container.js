import React, { useState,useEffect } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import { Container, Row, Col } from 'reactstrap';
import { Redirect } from "react-router-dom";
import queryString from 'query-string';

import socket from 'Socket';

import theme from 'styles/theme';
import StyledDiv from 'styles/styled-div';
import MovieDetail from 'views/swiping/movie-detail.js';

const SwipingContainer = (props) => {  
    const [tryAgain, setTryAgain] = useState(false);
    const [tryAgainHost, setTryAgainHost] = useState(false);
    const [newRoomId, setNewRoomId] = useState('');
      
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

    const tryAgainEmit = () => {
      //emit try again event
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

  //listen to match event
    socket.on('matchRedirect', ({matchedMovieId, matchedMovieData}) => {
      console.log(matchedMovieId);
      console.log(matchedMovieData);
      setMatchedMovie(matchedMovieData);
      setMatch(true);
    });
  });

  function SwipingCompletedScreen () {
    return(<Container>{ match && matchedMovie != null ? <Redirect to={{ 
      pathname: '/match',
      state: {matchedMovie: matchedMovie}
      }}/>: null }
      { noMatch ? <Redirect to='/noMatch'/> : null }<h1 style={{'text-align': "center", 'margin-top': '60px'}}>You've seen all potential movies for recommendation, please wait as your the others finish swiping!</h1></Container>)
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
              year={year}
              lengthOfMovie={lengthOfMovie}
              rating={rating}
              mediaType={mediaType}
              imageURL={imageURL}
              description={description}
            />
            <StyledDiv>
            <div className="buttonContainer">
                {isHost ? <button className={'button mt-20'} type="button" onClick={tryAgainEmit}>End Session</button> : null}
            </div>
            </StyledDiv>
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
    {/* {name === hostName 
        ? 
        <button className={'button mt-20'} type="button" onClick={}>End Session</button> 
        :
        <h2>only the host may end the session</h2> 
    } */}
  </Container>
  );}
  else if (SwipingCompleted) {
    return(<SwipingCompletedScreen/>)
  }
};

export default SwipingContainer;
