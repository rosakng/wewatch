import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import { Container, Row, Col } from 'reactstrap';


import theme from 'styles/theme'
import StyledDiv from 'styles/styled-div';
import MovieDetail from 'views/swiping/movie-detail.js';
import inception from 'views/swiping/assets/Inception.png';

const SwipingContainer = () => {
  return (
    <Container>
    <Row>
      <Col>
      <StyledDiv flex alignItems="center" marginTop={5}>
        <CloseIcon
          style={{ color: theme.colors.red, fontSize: '60px'}}
        />
        <StyledDiv padding={3}>
          <MovieDetail
            title="Inception"
            year="2016"
            lengthOfMovie="2h 28m"
            rating="8/10"
            genre="Thriller"
            image={inception}
            description="Inception is a 2010 science fiction action film written and directed by Christopher Nolan, who also produced the film with his wife, Emma Thomas. The film stars Leonardo DiCaprio as a professional thief who steals information by infiltrating the subconscious of his targets."
          />
        </StyledDiv>
        <InsertEmoticonIcon
          style={{ color: theme.colors.green, fontSize: '60px'}}
          fontSize="large"
        />
        </StyledDiv>
      </Col>
    </Row>
    </Container>
  
  );
};

export default SwipingContainer;
