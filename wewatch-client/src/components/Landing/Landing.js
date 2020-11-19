import React, { useState } from 'react';
import { Link } from "react-router-dom";

import './Landing.css';
import Layout from 'views/layout';

function Landing() {
  const [name, setName] = useState('');

  return (
    <Layout>
      <div className="joinOuterContainer">
        <div className="joinInnerContainer">
          <h1 className="heading">WeWatch</h1>
          <div >
            <input placeholder="Name" className="joinInput" type="text" onChange={(event) => setName(event.target.value)} />
          </div>
            <Link onClick={e => (!name) ? e.preventDefault() : null} to={`/lobby?name=${name}`}>
            <button className={'button mt-20'} type="submit">Host</button>
            </Link>
            <Link onClick={e => (!name) ? e.preventDefault() : null} to={`/join?name=${name}`}>
            <button className={'button mt-20'} type="submit">Join</button>
            </Link>
        </div>
      </div>
    </Layout>
  );
  }

export default Landing;