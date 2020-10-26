import React from 'react';
import ReactDOM from 'react-dom';
import Lobby from '../Lobby';
import { BrowserRouter as Router } from "react-router-dom";

it("renders without crashing", ()=> {
    const div = document.createElement("div");
    ReactDOM.render(<Router><Lobby location="url/to/be/parsed"></Lobby></Router>, div);
})