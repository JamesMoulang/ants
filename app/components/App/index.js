import React, { Component } from 'react';
import Game from '../Game';
import Editor from '../Editor';
import Modal from '../Modal';
import { connect } from 'react-redux';

function mapStateToProps(state) {
  return {
    paused: state.Game.paused
  };
}

function mapDispatchToProps(dispatch) {
  return {
    
  };
}

class AppComponent extends Component {
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
        <Modal/>

      	<div style={{position: 'relative', display: 'inline-block', width: this.props.paused ? '70%' : '30%', height: '100%'}}>
        	<Editor/>
        </div>

        <div style={{position: 'relative', display: 'inline-block', width: this.props.paused ? '30%' : '70%', height: '100%'}}>
          <Game ref="game"/>
        </div>
      </div>
    );
  }
}

const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppComponent);

export default App;
