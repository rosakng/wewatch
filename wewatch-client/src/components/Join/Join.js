import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import queryString from 'query-string';
import axios from 'axios'

import './Join.css';
import Layout from 'views/layout';
import { Redirect } from "react-router-dom";

const Join = ({location}) => {
  const [room, setRoom] = useState('');
  const { name } = queryString.parse(location.search);
  const [validRoom, setValidRoom] = useState(false);

  const checkRoom = () => {
    axios.get('http://localhost:5000/rooms').then(response => {
      let rooms = response.data
      let isValidRoom = rooms[room]

      if (isValidRoom) {
        setValidRoom(true)
      } else {
        throwError()
      }
    })
    .catch(error => {
      console.log(error)
    })
  }

  const throwError = () => {
    alert("This room does not exist!")
  }

  return (
    <Layout>
      <div className="joinOuterContainer">
        <div className="joinInnerContainer">
          <h1 className="heading">Join</h1>
          <div>
            <input placeholder="Room Code (eg. BHYZ)" className="joinInput mt-20" type="text" onChange={(event) => setRoom(event.target.value)} />
          </div>
          { validRoom && name ?
            <Redirect to={{ 
                pathname: '/lobby',
                search:`?name=${name}&room=${room}`
                }}
            />
            : null
        }
            <button className={'button mt-20'} onClick={checkRoom}>Enter Room</button>
        </div>
      </div>
    </Layout>
    
  );
}

export default Join;