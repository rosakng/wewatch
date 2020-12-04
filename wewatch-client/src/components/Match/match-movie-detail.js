import React from 'react';
import styled from 'styled-components';
import BarChartIcon from '@material-ui/icons/BarChart';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import BrushIcon from '@material-ui/icons/Brush';
import WatchLaterIcon from '@material-ui/icons/WatchLater';
import _ from 'underscore'

import theme from 'styles/theme';
import StyledDiv from 'styles/styled-div';

const MatchMovieDetailContainer = styled.div`
padding: ${theme.space[4]}; 
  margin: 0 auto  ;
  line-height: 1.0;
  border: 1px ${theme.colors.black} solid;
  border-radius: ${theme.borderRadius};
  display:flex; 
  flex-direction:row;
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
  margin-top: ${theme.space[3]};
  margin-right: ${theme.space[3]};
  margin-bottom: ${theme.space[3]};  `;

const BoldText = styled.span`
  font-size: ${theme.font.size[3]};
  font-weight: bold;
  margin-top: ${theme.space[3]};
  margin-left: ${theme.space[3]};
  margin-bottom: ${theme.space[3]};
  `;

const DescriptionText = styled.span`
font-size: ${theme.font.size[3]};
`;

const PhotoContainer = styled.div`
  margin: ${theme.space[3]};
`;

const Image = styled.img`
  box-shadow: 0 0 10px #ccc;
  height: 40vh;
`;

const TextContainer = styled.div`
  width:50%
  margin: ${theme.space[3]};
`;

const unescapeString = (str) => {
  console.log(str)
  // str = _.unescape(str)
  console.log(unescape(str))
  // return _.unescape(str);
  return unescape(str)
}

const MatchMovieDetail = ({
  title,
  rating,
  year,
  mediaType,
  lengthOfMovie,
  imageURL,
  description,
}) => (
    <MatchMovieDetailContainer>
      <PhotoContainer>
        <Image src={imageURL} />
      </PhotoContainer>
      <TextContainer>
      <StyledDiv paddingVertical={3}>
        <Title>{title}</Title>
      </StyledDiv>
      <StyledDiv flex alignItems="center">
        <BarChartIcon
          style={{ fontSize: '40px' }}
        />
        <BoldText>Movie Rating:&nbsp;</BoldText>
        <DetailText>{rating + "/10"}</DetailText>
      </StyledDiv>
      <StyledDiv flex alignItems="center">
        <CalendarTodayIcon
          style={{ fontSize: '40px' }}
        />
        <BoldText>Release Year:&nbsp;</BoldText>
        <DetailText>{year}</DetailText>
      </StyledDiv>
      <StyledDiv flex alignItems="center">
        <BrushIcon
          style={{ fontSize: '40px' }}
        />
        <BoldText>Type:&nbsp;</BoldText>
        <DetailText>{mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}</DetailText>
      </StyledDiv>
      <StyledDiv flex alignItems="center">
        <WatchLaterIcon
          style={{ fontSize: '40px' }}
        />
        <BoldText>Runtime:&nbsp;</BoldText>
        <DetailText>{lengthOfMovie}</DetailText>
      </StyledDiv>
      <StyledDiv margin={2} paddingTop={2}>
        <DivBorder />
        <DescriptionText>{unescapeString(description)}</DescriptionText>
      </StyledDiv>
      </TextContainer>
    </MatchMovieDetailContainer>
  );

export default MatchMovieDetail;