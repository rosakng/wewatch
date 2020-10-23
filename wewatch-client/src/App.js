import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import Chat from 'components/Chat/Chat';
import Join from 'components/Join/Join';
import Landing from 'components/Landing/Landing';

const App = () => (
  <Router>
  <Route path='/' exact component={Landing} />
    <Route path='/join' exact component={Join} />
    <Route path='/chat' component={Chat} />
  </Router>
);

export default App;
