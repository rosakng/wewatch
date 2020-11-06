import React, { useState } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import { Container, Row, Col } from 'reactstrap';

import theme from 'styles/theme'
import StyledDiv from 'styles/styled-div';
import MovieDetail from 'views/swiping/movie-detail.js';

const SwipingContainer = () => {
  const [index, setIndex] = useState('0');
  const [title, setTitle] = useState(top10[index].title);
  const [released, setReleased] = useState(top10[index].released);
  const [runtime, setRuntime] = useState(top10[index].runtime);
  const [rating, setRating] = useState(top10[index].rating);
  const [image, setImage] = useState(top10[index].image);

  const iterateMovies = () => {
    setIndex(index + 1);
    setTitle(top10[index].title);
    setReleased(top10[index].released);
    setRuntime(top10[index].runtime);
    setRating(top10[index].rating);
    setImage(top10[index].image);
  }
  
  const onClickDislike = () => {
    iterateMovies();
    console.log("dislike");
  }
  const onClickLike = () => {
    iterateMovies();
    console.log("like");
  }
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
            year={rating}
            lengthOfMovie={runtime}
            rating={rating}
            genre="Thriller"
            imageURL={image}
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
    </Container>
  
  );
};

export default SwipingContainer;
