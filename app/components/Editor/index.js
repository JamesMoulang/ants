import React, { Component } from 'react';

class Editor extends Component {
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
        <h1>HELLO</h1>
      </div>
    );
  }
}

export default Editor;
