import React, { useState } from 'react';
import { Link } from "react-router-dom";
import queryString from 'query-string';

import './Join.css';

const Join = ({location}) => {
  const [room, setRoom] = useState('');
  const { name } = queryString.parse(location.search);
  return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h1 className="heading">Join</h1>
        <div>
          <input placeholder="Room Code (eg. BHYZ)" className="joinInput mt-20" type="text" onChange={(event) => setRoom(event.target.value)} />
        </div>
        <Link onClick={e => (!name || !room) ? e.preventDefault() : null} to={`/lobby?name=${name}&room=${room}`}>
          <button className={'button mt-20'} type="submit">Enter Room</button>
        </Link>
      </div>
    </div>
  );
}

export default Join;