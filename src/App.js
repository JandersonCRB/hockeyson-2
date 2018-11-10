import React, { Component } from 'react';
import './App.css';

import io from 'socket.io-client';

import Grid from '@material-ui/core/Grid';

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
    const endpoint = process.env.NODE_ENV === 'production' ? 'https://hockeyson-2-server.herokuapp.com/' : 'http://localhost:3000';
    this.socket = io(endpoint);
    this.socket.on("initial_values", initialValues => {
      console.log(initialValues)
      this.setState({ players: initialValues });
    });
    this.socket.on("update", this.onUpdate);
  }
  
  drawPlayer = (context, player) => {
    context.beginPath();
    context.arc(player.x, player.y, player.radius, 0, 2 * Math.PI, false);
    context.fillStyle = player.color;
    context.fill();
  }

  onUpdate = players => {
    console.log("update");
    let c = this.canvas.getContext('2d');
    c.clearRect(0,0, 600, 300);
    players.map(player => {
      this.drawPlayer(c, player);
    })
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
      <Grid container style={{ height: '100vh'}}>
        <Grid container justify="center" alignItems="center" >
          <canvas height="300" width="600" style={{ border: '1px solid black' }} ref={ref => this.canvas = ref} />
        </Grid>
      </Grid>
    )
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
