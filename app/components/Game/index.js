import React, { Component } from 'react';
import GameEngine from './engine';
import { pause, play, setLevel } from '../../actions/Game';
import { updateVisualCode, successAntCode } from '../../actions/Code';
import { changeModal, hideModal, showModal } from '../../actions/Modal';
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
    setLevel: (level) => {
      dispatch(setLevel(level));
    },
    pause: () => {
      dispatch(pause());
    },
    play: () => {
      dispatch(play());
    },
    successAntCode: () => {
      dispatch(successAntCode());
    },
    updateVisualCode: (code) => {
      dispatch(updateVisualCode(code));
    },
    changeModal: (contents) => {
      dispatch(changeModal(contents))
    },
    hideModal: () => {
      dispatch(hideModal())
    },
    showModal: () => {
      dispatch(showModal())
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
    console.log("click!", this.props.paused);
    if (this.props.paused) {
      this.props.play();
    }
  }

	componentDidMount() {
		var canvas = this.refs.canvas;
		var ctx = canvas.getContext('2d');
		canvas.style.zIndex = -100;
		var engine = new GameEngine(1024, 768, this.refs.div, canvas, ctx, 30, function() {
      
    }.bind(this));
    engine._showModal = this.showModal.bind(this);
		engine.playGame = this.props.play.bind(this);
    engine.pauseGame = this.props.pause.bind(this);
    engine.setLevel = this.setLevel.bind(this);
    engine.campaign.start();
    this.setState({game: engine});
    var split = engine.antFunction.toString().split('\n');
    var str = '';
    for (var i = 2; i < split.length - 1; i++) {
      str += split[i] + '\n';
    }
    console.log(str);
    this.props.updateVisualCode(str);
	}

  setLevel(level) {
    this.props.setLevel(level);
  }

  showModal(showing, contents) {
    if (contents) {
      this.props.changeModal(contents);
    }

    if (showing) {
      this.props.showModal();
    } else {
      this.props.hideModal();
    }
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
      		position: 'relative',
          borderStyle: 'solid',
          borderTopWidth: '0px',
          borderLeftWidth: '4px'
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