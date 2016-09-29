import React, { Component } from 'react';
import GameEngine from './engine';
import { pause, play } from '../../actions/Game';
import { successAntCode } from '../../actions/Code';
import { connect } from 'react-redux';

function mapStateToProps(state) {
  return {
    code: state.Code.code,
    paused: state.Game.paused,
    pushed: state.Code.pushed
  };
}

function mapDispatchToProps(dispatch) {
  return {
    pause: () => {
      dispatch(pause());
    },
    play: () => {
      dispatch(play());
    },
    successAntCode: () => {
      dispatch(successAntCode());
    }
  };
}

class GameComponent extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.state = {
      game: null
    };
  }

  componentDidUpdate() {
    if (this.state.game != null) {
      if (this.props.paused) {
        this.state.game.pause();
      } else {
        this.state.game.play();
      }
    }

    if (!this.props.pushed) {
      this.state.game.submitCode(this.props.code, function(err, res) {
        if (typeof(err) === 'undefined') {
          this.props.successAntCode();
        } else {
          console.error(err);
        }
      }.bind(this));
    }
  }

  onClick() {
    if (this.props.paused) {
      this.props.play();
    }
  }

	componentDidMount() {
		var canvas = this.refs.canvas;
		var ctx = canvas.getContext('2d');
		canvas.style.zIndex = -100;
		var engine = new GameEngine(1024, 768, this.refs.div, canvas, ctx, 30);
		engine.start();
    this.setState({game: engine});
	}

  render() {
    return (
      <div 
        onClick={this.onClick}
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

const Game = connect(
  mapStateToProps,
  mapDispatchToProps
)(GameComponent);

export default Game;