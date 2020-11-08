import React, { useState, useEffect } from "react";
import MovieDetail from 'views/swiping/movie-detail.js';
import { Container, Row, Col } from 'reactstrap';
import theme from 'styles/theme'
import StyledDiv from 'styles/styled-div';

import './Match.css';

const Match = (props) => {
    const movieData = props.location.state.matchedMovie;
    return (
        <Container>
            <Col>
            <Row>
            <div class='center'>
            <h1>It's a match!</h1>
            <p>Everyone wants to watch:</p>
            </div>
            </Row>
            <Row>
            <StyledDiv flex alignItems="center" marginTop={2}>
            <StyledDiv padding={2}>
                <MovieDetail
                title={movieData.title}
                year={movieData.released}
                lengthOfMovie={movieData.runtime}
                rating={movieData.rating}
                genre="Thriller"
                imageURL={movieData.largeimage}
                description={movieData.synopsis}
                />
            </StyledDiv>
            </StyledDiv>
            </Row>
            </Col>
        </Container>
       
    );
}


export default Match