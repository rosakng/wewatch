import React, { useState, useEffect } from "react";
import MovieDetail from 'views/swiping/movie-detail.js';
import { Container, Row, Col } from 'reactstrap';
import theme from 'styles/theme'
import StyledDiv from 'styles/styled-div';

import './Match.css';
import Layout from 'views/layout';

const Match = (props) => {
    const movieData = props.location.state.matchedMovie;
    return (
        <Layout>
            <Container>
                <Col>
                <Row>
                <div class='center'>
                <h1>It's a match!</h1>
                <span>Everyone wants to watch:</span>
                </div>
                </Row>
                <Row>
                <StyledDiv flex alignItems="center">
                <StyledDiv padding={2}>
                    <MovieDetail
                    title={movieData.title}
                    year={movieData.released}
                    lengthOfMovie={movieData.runtime}
                    rating={movieData.rating}
                    mediaType={movieData.type}
                    imageURL={movieData.image}
                    description={movieData.synopsis}
                    />
                </StyledDiv>
                </StyledDiv>
                </Row>
                </Col>
            </Container>
        </Layout>
    );
}


export default Match