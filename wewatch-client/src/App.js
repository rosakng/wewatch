import React from 'react';

import Chat from 'components/Chat/Chat';
import Join from 'components/Join/Join';
import Landing from 'components/Landing/Landing';
import Lobby from 'components/Lobby/Lobby';
import Swiping from 'views/swiping/swiping-container';
import history from 'router-history';

import { BrowserRouter as Router, Route } from "react-router-dom";

const App = () => {
  return (
    <Router history={history}>
      <Route path='/' exact component={Landing} />
      <Route path='/join' exact component={Join} />
      <Route path="/chat" component={Chat} />
      <Route path="/lobby" component={Lobby}/>
      <Route path="/swiping" component={Swiping}/>
    </Router>
  );
}

export default App;
