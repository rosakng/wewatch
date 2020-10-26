import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import SwipingContainer from './swiping-container';

it('renders the Swiping container', () => {
  const div = document.createElement("div");
  ReactDOM.render(<Router><SwipingContainer/></Router>, div)
});
