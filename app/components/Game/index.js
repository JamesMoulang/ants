import React, { Component } from 'react';
import GameEngine from './engine';

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      game: null
    };
  }

	componentDidMount() {
		var canvas = this.refs.canvas;
		var ctx = canvas.getContext('2d');
		canvas.style.zIndex = -100;
		var engine = new GameEngine(1024, 768, this.refs.div, canvas, ctx, 30);
		engine.start();
	}

  render() {
    return (
      <div 
      	ref="div"
      	style={{
      		width: '100%', 
      		height: '100%',
      		overflow: 'hidden',
      		position: 'relative'
      	}}
      >
        <canvas 
        	ref="canvas" 
        	style={{
	        	display: 'block', 
	        	position: 'absolute', 
	        	zIndex: 1
        	}}
        />
      </div>
    );
  }
}

export default Game;
