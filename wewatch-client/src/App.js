import React from 'react';

import Chat from 'components/Chat/Chat';
import Join from 'components/Join/Join';
import Landing from 'components/Landing/Landing';
import Lobby from 'components/Lobby/Lobby';
import Swiping from 'views/swiping/swiping-container';
import NoMatch from 'components/No Match/noMatch'; 

import { BrowserRouter as Router, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Route path='/' exact component={Landing} />
      <Route path='/join' exact component={Join} />
      <Route path="/chat" component={Chat} />
      <Route path="/lobby" component={Lobby}/>
      <Route path="/swiping" component={Swiping}/>
      <Route path="/noMatch" exact component={NoMatch}/>
    </Router>
  );
}

export default App;
