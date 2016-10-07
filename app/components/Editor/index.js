import React, { Component } from 'react';
import Codemirror from 'react-codemirror';
import { pause, play, showAPI } from '../../actions/Game';
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
    },
    showAPI: () => {
      dispatch(showAPI())
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
    this.onClick = this.onClick.bind(this);
    this.showAPI = this.showAPI.bind(this);
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
    this.props.updateVisualCode(newCode);
  }

  onClick() {
    if (!this.props.paused) {
      this.props.pause();
    }
  }

  showAPI() {
    this.props.pause();
    this.props.showAPI();
  }

  render() {
    var options = {
        lineNumbers: true,
        mode:  "javascript"
    };
    return (
      <div>
        <div
          onClick={this.onClick}
          style={{
            display: this.props.paused ? 'none' : 'inline',
            opacity: 0.2,
            background: 'black',
            position: 'absolute',
            top: 0,
            width: '100%',
            height: '100%',
            zIndex: 204,
            top: -4
          }}
        />

        <div
        ref="div" 
        style={{
          width: '100%', 
          height: '100%',
          overflow: 'hidden',
          position: 'absolute'
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
            <a onClick={this.showAPI} style={{fontFamily: 'monospace', cursor: 'pointer', top: '-24px', float: 'right', fontSize: '24px', position: 'relative', display: 'block'}}> 
              <p>[API]</p>
            </a>
          </div>
          <div style={{display: 'block', position: 'absolute', width: '100%'}}>
            <Codemirror ref="codemirror" value={this.state.code} onChange={this.updateCode} options={options} />
          </div>
        </div>
      </div>
    );
  }
}

const Editor = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditorComponent);

export default Editor;