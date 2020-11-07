import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

const Match = (props) => {
    console.log(props)
    return (
        <div className="outerContainer">
            <div className="container">
                <h1>Movie you were matched with: {props.location.state.matched.title} </h1>
                <h2>rating: {props.location.state.matched.rating} </h2>
                <h2>synopsis: {props.location.state.matched.synopsis} </h2>
            </div>
        </div>
    );
}


export default Match