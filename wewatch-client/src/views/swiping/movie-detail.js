import React from 'react';
import styled from 'styled-components';

import theme from 'styles/theme';
import GraphIcon from 'views/swiping/assets/GraphIcon';
import CalendarIcon from 'views/swiping/assets/CalendarIcon';
import PaintBrushIcon from 'views/swiping/assets/PaintBrushIcon';
import ClockIcon from 'views/swiping/assets/ClockIcon';
import StyledDiv from 'styles/styled-div'

const MovieDetailContainer = styled.div`
  padding: ${theme.space[4]};
  line-height: 1.0;
  border: 1px ${theme.colors.black} solid;
  border-radius: ${theme.borderRadius};
  display: inline-block;
`;
const Title = styled.span`
  font-size: ${theme.font.size[4]};
  margin: ${theme.space[3]};
`;

const DetailText = styled.span`
  font-size: ${theme.font.size[4]};
  margin: ${theme.space[4]};
  `;

const PhotoContainer = styled.div`
  margin: ${theme.space[2]}
`;

const Image = styled.img`
  width: 100%;
  box-shadow: 0 0 10px #ccc;
`;

const MovieDetail = ({
  title,
  rating,
  year,
  genre,
  lengthOfMovie,
  image,
  description,
}) => (
  <MovieDetailContainer>
    <PhotoContainer>
      <Image src={image} />
    </PhotoContainer>
    <StyledDiv paddingVertical={4}>
      <Title>{title}</Title>
    </StyledDiv>
    <StyledDiv flex>
      <StyledDiv size={50} margin={2}>
        <GraphIcon />
      </StyledDiv>
      <DetailText>{rating}</DetailText>
    </StyledDiv>
    <StyledDiv flex>
      <StyledDiv size={50} margin={2}>
        <CalendarIcon />
      </StyledDiv>
      <DetailText>{year}</DetailText>
    </StyledDiv>
    <StyledDiv flex>
      <StyledDiv size={50} margin={2} paddingTop={3}>
        <PaintBrushIcon />
      </StyledDiv>
      <DetailText>{genre}</DetailText>
    </StyledDiv>
    <StyledDiv flex>
      <StyledDiv size={50} margin={2} paddingTop={3}>
        <ClockIcon />
      </StyledDiv>
      <DetailText>{lengthOfMovie}</DetailText>
    </StyledDiv>
    <StyledDiv margin={2} paddingTop={4}>
      <DetailText>{description}</DetailText>
    </StyledDiv>
  </MovieDetailContainer>
);

export default MovieDetail;
