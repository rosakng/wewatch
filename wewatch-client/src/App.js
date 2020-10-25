import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import Chat from 'components/Chat/Chat';
import Join from 'components/Join/Join';
import SwipingContainer from 'views/swiping/swiping-container';

const App = () => (
  <Router>
    <Route path='/' exact component={Join} />
    <Route path='/chat' component={Chat} />
    {/* <Route path='/swiping' component={SwipingContainer} /> */}
  </Router>
);

export default App;
