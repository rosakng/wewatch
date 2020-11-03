import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';

import theme from 'styles/theme'
import StyledDiv from 'styles/styled-div';
import MovieDetail from 'views/swiping/movie-detail.js';
import inception from 'views/swiping/assets/Inception.png';


const SwipingContainer = () => {
  return (
    <StyledDiv paddingLeft="512">
      <StyledDiv width="30%" flex alignItems="center">
      <CloseIcon
        style={{ color: theme.colors.green }}
        fontSize="large"
      />
      <MovieDetail
        title="Inception"
        year="2016"
        lengthOfMovie="2h 28m"
        rating="8/10"
        genre="Thriller"
        image={inception}
        description="Inception is a 2010 science fiction action film written and directed by Christopher Nolan, who also produced the film with his wife, Emma Thomas. The film stars Leonardo DiCaprio as a professional thief who steals information by infiltrating the subconscious of his targets."
      />
      <InsertEmoticonIcon
        style={{ color: theme.colors.red }}
        fontSize="large"
      />
      </StyledDiv>
    </StyledDiv>
    
  );
};

export default SwipingContainer;
