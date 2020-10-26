import React from 'react';
import ReactDOM from 'react-dom';
import Join from '../Join';
import { BrowserRouter as Router } from "react-router-dom";

it("renders without crashing", ()=> {
    const div = document.createElement("div");
    ReactDOM.render(<Router><Join location="url/to/be/parsed"></Join></Router>, div);
})