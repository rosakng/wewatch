import React, { useState, useEffect } from 'react';
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
  const [noMatch, setNoMatch] = useState(false);
  const [match, setMatch] = useState(false);
  const [matchedMovie, setMatchedMovie] = useState({});
  const [SwipingCompleted, setSwipingCompleted] = useState(false);

  const movieList = props.location.state.movieList;
  const roomId = props.location.state.roomId;
  const isHost = props.location.state.isHost;
  const name = props.location.state.name;

  const [index, setIndex]  = useState(0);
  const [title, setTitle] = useState(movieList[index].title);
  const [imageURL, setImageUrl] = useState(movieList[index].image);
  const [year, setYear] = useState(movieList[index].released);
  const [lengthOfMovie, setLengthOfMovie] = useState(movieList[index].duration);
  const [rating, setRating] = useState(movieList[index].rating);
  const [mediaType, setmediaType] = useState(movieList[index].type);
  const [description, setDescription] = useState(movieList[index].synopsis);

  const [endSessionUser, setEndSessionUser] = useState(false);
  const [endSessionHost, setEndSessionHost] = useState(false);
  const [newRoomId, setNewRoomId] = useState('');

  const iterateMovie = (index) => {
    if(index !== (movieList.length - 1)) {
      setIndex(index + 1);
    } else {
      setSwipingCompleted(true)
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
    setTitle(movieList[index].title);
    setImageUrl(movieList[index].image);
    setYear(movieList[index].released);
    setLengthOfMovie(movieList[index].runtime);
    setRating(movieList[index].rating);
    setmediaType(movieList[index].type);
    setDescription(movieList[index].synopsis);
  });

  const onClickDislike = () => {
    socket.emit('dislike_event', {roomId: roomId});
    iterateMovie(index);
  };

  const onClickLike = () => {
    const movieId = movieList[index].netflixid;
    socket.emit('like_event', {roomId: roomId, movieId: movieId, movieData: movieList[index]});
    iterateMovie(index);
  }

  //listen to the no match event
  useEffect(() => {
    socket.on('noMatchRedirect', () => {
      setNoMatch(true);
    });
    return () => { socket.off('noMatchRedirect') };
  });

  useEffect(() => {
    //listen to match event
    socket.on('matchRedirect', ({ matchedMovieId, matchedMovieData }) => {
      setMatchedMovie(matchedMovieData);
      setMatch(true);
    });

    return () => { socket.off('matchRedirect') };
  })

  const endSessionEmit = () => {
    socket.emit('try_again_event', { roomId: roomId })
  }

  useEffect(() => {
    socket.on('tryAgainRedirectHost', () => {
      if (isHost) {
        setEndSessionHost(true);
      }
    })
    return () => { socket.off('tryAgainRedirectHost') };
  });

  useEffect(() => {
    socket.on('tryAgainRedirectUser', ({ newRoomId }) => {
      setNewRoomId(newRoomId);
      setEndSessionUser(true);
    });
    return () => { socket.off('tryAgainRedirectUser') };
  })


  function SwipingCompletedScreen() {
    return (
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

  if (!SwipingCompleted) {
    return (
      <Layout>
        { endSessionHost ? <Redirect to={`/lobby?name=${name}&reset=${true}&oldRoomId=${roomId}`}/> : null}
        { endSessionUser ? <Redirect to={`/lobby?name=${name}&room=${newRoomId}`}/> : null}
        <StyledDiv flex paddingLeft={4} marginTop={3}>
          <StyledDiv>Start Swiping!</StyledDiv>
          <Tooltip
            text={`Click the happy face if you would like to watch the movie, or click the X otherwise!`}
          >
            <ToolTipIcon fill={theme.colors.gray[2]} size="25px" />
          </Tooltip>
        </StyledDiv>
        <Container>
          {match && matchedMovie != null ?
            <Redirect to={{
              pathname: '/match',
              state: {
                matchedMovie: matchedMovie,
                isHost: isHost,
                roomId: roomId,
                name: name
              }
            }} />
            : null}
          {noMatch ?
            <Redirect to={{
              pathname: '/noMatch',
              state: {
                isHost: isHost,
                roomId: roomId,
                name: name
              }
            }} /> : null}
          <Row>
            <Col>
              {props.location.state.movieList && (
                <StyledDiv flex alignItems="center" marginTop={2}>
                  <CloseIcon
                    style={{ color: theme.colors.red, fontSize: '60px' }}
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
                      { isHost ?
                      <button className={'button mt-20'} type="button" onClick={endSessionEmit}>End Session</button>
                      : null
                      }
                    </StyledDiv>

                  </StyledDiv>
                  <InsertEmoticonIcon
                    style={{ color: theme.colors.green, fontSize: '60px' }}
                    fontSize="large"
                    onClick={onClickLike}
                  />
                </StyledDiv>
              )}
            </Col>
          </Row>
        </Container>
      </Layout>
    );
  }
  else if (SwipingCompleted) {
    return (<SwipingCompletedScreen />)
  }
};

export default SwipingContainer;
