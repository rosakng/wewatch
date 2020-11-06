import React, { useState  } from "react";
import { Redirect } from "react-router-dom";

import './noMatch.css';

const NoMatch = () => {
    const [cancel, setCancel] = useState(false);

    //takes user back to landing page
    const cancelSession = () => {
        setCancel(true);
    }
    
    return (
        <div className="noMatchHeroContainer">
        { cancel ? <Redirect to='/'/> : null }
            <h1>No Match :(</h1>
            <h2>There were no movies that the group agreed on watching </h2>
            <div className="buttonContainer">
            <button className={'button mt-20'} type="button" onClick={cancelSession}>Cancel</button>
            </div>
        </div>
    );
    }
 export default NoMatch