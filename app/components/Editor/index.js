import React, { Component } from 'react';
import Codemirror from 'react-codemirror';
import { pause, play } from '../../actions/Game';
import { updateAntCode } from '../../actions/Code'
import { connect } from 'react-redux';

import '../../../node_modules/codemirror/mode/javascript/javascript'
import '../../../node_modules/codemirror/lib/codemirror.css'

function mapStateToProps(state) {
  return {
    code: state.Code.code,
    paused: state.Game.paused
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateAntCode: (code) => {
      dispatch(updateAntCode(code));
    },
    pause: () => {
      dispatch(pause())
    }
  };
}

class EditorComponent extends Component {
	constructor(props) {
    super(props);
    this.state = {
      code: "// Code"
    }
    this.updateCode = this.updateCode.bind(this);
    this.submitCode = this.submitCode.bind(this);
  }

  submitCode() {
    this.props.updateAntCode(this.state.code);
  }

  componentDidMount() {
    console.log(this.refs.codemirror.getCodeMirror());
    this.refs.codemirror.getCodeMirror().setSize(this.refs.div.width, this.refs.div.clientHeight-32);
  }

  updateCode(newCode) {
    if (!this.props.paused) {
      this.props.pause();
    }
    this.setState({
        code: newCode
    });
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
        <Codemirror onClick={this.onClick} style={{display: 'block', position: 'absolute'}} ref="codemirror" value={this.state.code} onChange={this.updateCode} options={options} />
        <a onClick={this.submitCode}>Submit</a>
      </div>
    );
  }
}

const Editor = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditorComponent);

export default Editor;