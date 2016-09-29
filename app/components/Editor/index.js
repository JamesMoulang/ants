import React, { Component } from 'react';
import Codemirror from 'react-codemirror';

class Editor extends Component {
	constructor(props) {
    super(props);
    this.state = {
      code: "// Code"
    }
    this.updateCode = this.updateCode.bind(this);
  }

  componentDidMount() {
    console.log(this.refs.codemirror.getCodeMirror());
    this.refs.codemirror.getCodeMirror().setSize(this.refs.div.width, this.refs.div.clientHeight);
  }

  updateCode(newCode) {
    this.setState({
        code: newCode
    });
  }

  render() {
    var options = {
        lineNumbers: true
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
        <Codemirror style={{display: 'block', position: 'absolute'}} ref="codemirror" value={this.state.code} onChange={this.updateCode} options={options} />
      </div>
    );
  }
}

export default Editor;