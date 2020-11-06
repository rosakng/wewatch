import React, { useState,useEffect } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import { Container, Row, Col } from 'reactstrap';
import { Redirect } from "react-router-dom";

import theme from 'styles/theme'
import StyledDiv from 'styles/styled-div';
import MovieDetail from 'views/swiping/movie-detail.js';


let socket;

const SwipingContainer = (props) => {

  const [title, setTitle] = useState('Inception')
  const [goMatch, setGoMatch] = useState(false);

  const onClickDislike = () => {
    console.log("dislike");
  }
  const onClickLike = () => {
    console.log("like");
    setTitle("Monkey");
  }

  const matchTest = () => {
    setGoMatch(true);
  }

  useEffect(()=>{
    socket = props.location.state.socket
    socket.emit('emitting from swipe page, i am a passed socket')


  });
  console.log(props)
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
                                state: {matched: props.location.state.top10[0]}
                            }}
                            /> : null }
    </Row>
    </Container>
  
  );
};

export default SwipingContainer;
