import React, { Component } from 'react';
import './App.css';

import io from 'socket.io-client';

const KEYS = {
  KeyUp: "ArrowUp",
  KeyRight: "ArrowRight",
  KeyDown: "ArrowDown",
  KeyLeft: "ArrowLeft",
}

class App extends Component {
  state = {
    players: [],
  }
  componentDidMount() {
    this.listenKeysEvents();
    // const endpoint = process.env.NODE_ENV === 'production' ? 'http://hockeyson-2-server.herokuapp.com/' : 'http://localhost:3000';
    this.socket = io('https://hockeyson-2-server.herokuapp.com/');
    this.socket.on("initial_values", initialValues => {
      console.log(initialValues)
      this.setState({ players: initialValues });
    });
    this.socket.on("update", players => { 
      this.setState({ players });
    });
  }
  
  listenKeysEvents = _ => {
    window.addEventListener("keydown", keyEvent => {
      let action;
      const { key } = keyEvent;
      if(key === KEYS.KeyUp){
        action = "up";
      } else if (key === KEYS.KeyRight) {
        action = "right";
      } else if (key === KEYS.KeyDown) {
        action = "down";
      } else if (key === KEYS.KeyLeft) {
        action = "left";
      }
      if(action) this.socket.emit("move", { direction: action, state: true });
    })
    window.addEventListener("keyup", keyEvent => {
      let action;
      const { key } = keyEvent;
      if(key === KEYS.KeyUp){
        action = "up";
      } else if (key === KEYS.KeyRight) {
        action = "right";
      } else if (key === KEYS.KeyDown) {
        action = "down";
      } else if (key === KEYS.KeyLeft) {
        action = "left";
      }
      if(action) this.socket.emit("move", { direction: action, state: false });
    })
  }

  render() {
    const { players } = this.state;
    return (
      players.map((player, index) => (
        <div 
          key={index} 
          className="player" 
          style={{ 
            position: 'absolute', 
            top: player.y - player.radius, 
            left: player.x - player.radius, 
            width: player.radius * 2,
            height: player.radius * 2,
            backgroundColor: player.color 
          }} 
          
          />
      ))
    );
  }
}

export default App;
