import React, { useState, useEffect } from "react";
import MovieDetail from 'views/swiping/movie-detail.js';
import { Container, Row, Col } from 'reactstrap';
import theme from 'styles/theme'
import StyledDiv from 'styles/styled-div';

import './Match.css';

const Match = (props) => {

    const stubbedMovie = {
        netflixid: '70059700',
        title: 'Eddie Murphy: Delirious',
        image: 'http://occ-0-2851-38.1.nflxso.net/dnm/api/v6/evlCitJPPCVCry0BZlEFb5-QjKc/AAAABYPPpoTVD9QQT1SzX3E83wx6_9ySxVJvFRdPAY8bvgUK_HJtwKV9TDny_zkD9-W0lFMy6wln-8C9YtRST0RbGshxkA.jpg?r=05d',
        synopsis: 'Flashing the wild stand-up comedy that made him a household name, Eddie Murphy unleashes uncensored observations and parodies in this 1983 live show.',
        rating: '8.2',
        type: 'movie',
        released: '1983',
        runtime: '1h8m',
        largeimage: 'https://occ-0-2218-2219.1.nflxso.net/dnm/api/v6/evlCitJPPCVCry0BZlEFb5-QjKc/AAAABSY7U_XUxOwX15HcmsI4qkTjtbKQG-0I7dIWCgI9LsBDzuhSysQg_TPhpEuXmA4OfcCy2-xQ7MBTallKLrV6NyEMU9Fl.jpg?r=05d',
        unogsdate: '2015-04-14',
        imdbid: 'tt0085474',
        download: '0'
    };
    const movieData = stubbedMovie
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