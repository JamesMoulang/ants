import React, { Component } from 'react';
import Game from '../Game';
import Editor from '../Editor';

class App extends Component {
  componentDidMount() {
    console.log(this.refs.game);
  }

  render() {
    return (
      <div 
      	style={{
      		width: '100%', 
      		height: '100vh'
      	}}
      >
      	<div style={{position: 'relative', display: 'inline-block', width: '50%', height: '100%'}}>
        	<Editor/>
        </div>

        <div style={{position: 'relative', display: 'inline-block', width: '50%', height: '100%'}}>
        	<Game ref="game"/>
        </div>
      </div>
    );
  }
}

export default App;
