import React, { Component } from 'react';
import Codemirror from 'react-codemirror';
import { pause, play } from '../../actions/Game';
import { updateVisualCode, updateAntCode } from '../../actions/Code'
import { connect } from 'react-redux';

import '../../../node_modules/codemirror/mode/javascript/javascript'
import '../../../node_modules/codemirror/lib/codemirror.css'

function mapStateToProps(state) {
  return {
    code: state.Code.code,
    visualCode: state.Code.visualCode,
    paused: state.Game.paused
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateAntCode: (code) => {
      dispatch(updateAntCode(code));
    },
    updateVisualCode: (code) => {
      dispatch(updateVisualCode(code));
    },
    pause: () => {
      dispatch(pause())
    },
    play: () => {
      dispatch(play())
    }
  };
}

class EditorComponent extends Component {
	constructor(props) {
    super(props);
    this.state = {
      code: ""
    }
    this.updateCode = this.updateCode.bind(this);
    this.submitCode = this.submitCode.bind(this);
  }

  submitCode() {
    this.props.updateAntCode(this.state.code);
    this.props.play();
  }

  componentDidMount() {
    console.log(this.refs.codemirror.getCodeMirror());
    this.refs.codemirror.getCodeMirror().setSize(this.refs.div.width, this.refs.div.clientHeight-32);
  }

  componentDidUpdate() {
    if (this.state.code != this.props.visualCode) {
      this.setState({code: this.props.visualCode});
    }
  }

  updateCode(newCode) {
    if (!this.props.paused) {
      this.props.pause();
    }
    this.props.updateVisualCode(newCode);
  }

  onClick() {
    console.log("yo.");
  }

  render() {
    var options = {
        lineNumbers: true,
        mode:  "javascript"
    };
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
        <div style={{
          padding: '8px', 
          paddingTop: '2px', 
          height: '28px', 
          borderStyle: 'solid', 
          borderTopWidth: '0px', 
          borderRightWidth: '0px', 
          borderLeftWidth: '0px', 
          borderBottomWidth: '2px'
        }}>
          <a style={{position: 'relative', marginRight: '16px', top: '-18px', display: 'inline-block', cursor: 'pointer'}} onClick={this.submitCode}><i className="fa fa-play fa-2x"></i></a>
          <p style={{fontFamily: 'monospace', top: '-24px', fontSize: '24px', position: 'relative', display: 'inline-block'}}>Ant.js</p>
        </div>
        <Codemirror onClick={this.onClick} style={{display: 'block', position: 'absolute'}} ref="codemirror" value={this.state.code} onChange={this.updateCode} options={options} />
      </div>
    );
  }
}

const Editor = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditorComponent);

export default Editor;