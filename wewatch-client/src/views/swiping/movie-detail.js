import React from 'react';
import styled from 'styled-components';
import BarChartIcon from '@material-ui/icons/BarChart';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import BrushIcon from '@material-ui/icons/Brush';
import WatchLaterIcon from '@material-ui/icons/WatchLater';

import theme from 'styles/theme';
import StyledDiv from 'styles/styled-div'

const MovieDetailContainer = styled.div`
  padding: ${theme.space[4]};
  line-height: 1.0;
  border: 1px ${theme.colors.black} solid;
  border-radius: ${theme.borderRadius};
`;
const Title = styled.span`
  font-size: ${theme.font.size[4]};
  font-weight: bold;
  margin: ${theme.space[2]};
`;

const DivBorder = styled.div`
  border-bottom: 1px ${theme.colors.black} solid;
  margin-top: ${theme.space[2]};
  margin-bottom: ${theme.space[3]};
`;

const DetailText = styled.span`
  font-size: ${theme.font.size[3]};
  margin: ${theme.space[3]};
  `;

const PhotoContainer = styled.div`
  margin: ${theme.space[2]}
`;

const Image = styled.img`
  box-shadow: 0 0 10px #ccc;
  width: 100%;
  height: 50vh;
`;

const MovieDetail = ({
  title,
  rating,
  year,
  genre,
  lengthOfMovie,
  imageURL,
  description,
}) => (
  <MovieDetailContainer>
    <PhotoContainer>
      <Image src={imageURL} />
    </PhotoContainer>
    <StyledDiv paddingVertical={3}>
      <Title>{title}</Title>
    </StyledDiv>
    <StyledDiv flex alignItems="center">
      <BarChartIcon
          style={{fontSize: '40px'}}
      />
      <DetailText>{rating}</DetailText>
    </StyledDiv>
    <StyledDiv flex alignItems="center">
      <CalendarTodayIcon
          style={{fontSize: '40px'}}
      />
      <DetailText>{year}</DetailText>
    </StyledDiv>
    <StyledDiv flex alignItems="center">
      <BrushIcon
          style={{fontSize: '40px'}}
      />
      <DetailText>{genre}</DetailText>
    </StyledDiv>
    <StyledDiv flex alignItems="center">
      <WatchLaterIcon
          style={{fontSize: '40px'}}
      />
      <DetailText>{lengthOfMovie}</DetailText>
    </StyledDiv>
    <StyledDiv margin={2} paddingTop={2}>
      <DivBorder />
      <DetailText>{description}</DetailText>
    </StyledDiv>
  </MovieDetailContainer>
);

export default MovieDetail;
