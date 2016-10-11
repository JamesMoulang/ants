import React, { Component } from 'react';
import Game from '../Game';
import Editor from '../Editor';
import Modal from '../Modal';
import API from '../API';
import { connect } from 'react-redux';

function mapStateToProps(state) {
  return {
    paused: state.Game.paused,
    showingAPI: state.Game.showingAPI
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

  componentDidUpdate() {
    console.log(this.props.showingAPI ? 'SHOWING API' : 'NOT SHOWING');
  }

  render() {
    return (
      <div style={{position: 'absolute', width: '100%', height: '100vh'}}>
        {!this.props.showingAPI ? null :
          <div 
            style={{
              width: '100%', 
              height: '100vh',
              position: 'absolute',
              display: this.props.showingAPI ? 'block' : 'none'
            }}
          >
            <Modal/>
            <API/>
          </div>
        }

        <div 
          style={{
            width: '100%', 
            height: '100vh',
            display: !this.props.showingAPI ? 'block' : 'none'
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
      </div>
    );
  }
}

const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppComponent);

export default App;
