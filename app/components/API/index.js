import React, { Component } from 'react';
import Modal from '../Modal';
import Codemirror from 'react-codemirror';
import { connect } from 'react-redux';
import _ from 'lodash';

import '../../../node_modules/codemirror/mode/javascript/javascript'
import '../../../node_modules/codemirror/lib/codemirror.css'

function mapStateToProps(state) {
  return {
    showingAPI: state.Game.showingAPI
  };
}

function mapDispatchToProps(dispatch) {
  return {
    
  };
}

class MethodList extends Component {
  render() {
    return <div style={{
      padding: 16, 
      paddingTop: 0, 
      borderStyle: 'solid', 
      borderTopWidth: '0px', 
      borderRightWidth: '0px', 
      borderLeftWidth: '0px', 
      borderBottomWidth: '2px'
    }}>
      <h2 id={this.props.title}>{this.props.title}</h2>
      {this.props.children}
      <div style={{width: '100%'}}>
        {
          (_.sortBy(this.props.list, 'name')).map(function(m, index) {
            return <Tag name={m.name}/>
          })
        }
      </div>
      {
        _.sortBy(this.props.list, 'name').map(function(m, index) {
          return <div style={{
            padding: 16, 
            paddingTop: 0, 
            marginTop: 8, 
            marginBottom: 8,  
            borderStyle: 'solid', 
            borderWidth: '1px', 
            borderRadius: '4px'
          }}><MethodComponent key={index} stuff={m}/></div>
        })
      }
    </div>;
  }
}

class Tag extends Component {
  render() {
    return <a style={{
      background: 'white', 
      margin: 4, 
      textDecoration: 'none', 
      padding: 8, 
      borderStyle: 'solid', 
      borderWidth: '1px', 
      borderRadius: '4px', 
      fontFamily: 'monospace', 
      fontSize: 14, 
      paddingRight: 8, 
      display: 'inline-block'
    }} href={'#'+this.props.name}>{this.props.name}</a>;
  }
}

class MethodComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lineCount: 0
    }
  }

  beautify(split) {
    var str = '';
    for (var i = 1; i < split.length - 1; i++) {
      var count = (split[i].match(' ') || []).length;
      if (count >= 1) {
        for (var j = 0; j < 10; j++) {
          split[i] = split[i].replace(' ', '');
        }
      }
      str += split[i] + '\n';
    }
    return str;
  }

  componentDidMount() {
    this.refs.codemirror.getCodeMirror().setSize('90%', this.props.stuff.example.length * 15);
  }

  render() {
    var stuff = this.props.stuff;
    var type = '';
    if (stuff.type) {
      type = ' → {' + stuff.type + '}'
    }
    var options = {
      lineNumbers: false,
      mode:  "javascript",
      readOnly: true
    };
    return <div id={stuff.name}>
      <h3>{stuff.name + '(' + stuff.params + ')' + type}</h3>
      <p>{stuff.description}</p>
      {
        !stuff.paramDescription ? null :
        <ul>
          {stuff.paramDescription.map((p) => {
            return (<li><p>{p.name + ': ' + p.desc}</p></li>);
          })}
        </ul>
      }
      {
        !stuff.example ? null :
          <div>
            <h4>Example:</h4>
            <Codemirror ref="codemirror" value={this.beautify(stuff.example)} options={options} />
          </div>
      }
    </div>
  }
}

class APIComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      methods: {
        pheromone: [

        ],
        vector: [
          {
            name: 'constructor'
          }
        ],
        ant: [
          {
            name: 'checkState',
            params: '',
            type: 'string',
            description: 'Returns the current ant state.',
            example: function() {
              var state = this.checkState();
              if (state == 'idle') {
                console.log("zzz");
              } else {
                this.moveRandomly();
              }
            }.toString().split('\n')
          },
          {
            name: 'setState',
            params: 'state: string',
            type: '',
            description: 'Sets the current ant state.',
            example: function() {
              this.setState('idle');
            }.toString().split('\n')
          },
          {
            name: 'getFoodNumber',
            params: '',
            type: 'number',
            description: "Gets the food level of the ant's current square",
            example: function() {
              if (this.getFoodNumber() > 0) {
                this.pickUpFood();
                this.setState('carrying');
              }
            }.toString().split('\n')
          },
          {
            name: 'lookForFood',
            params: '',
            type: typeof(true),
            description: "Returns true if the ant's current square contains food, otherwise returns false.",
            example: function() {
              if (this.lookForFood()) {
                this.pickUpFood();
                this.setState('carrying');
              }
            }.toString().split('\n')
          },
          {
            name: 'pickUpFood',
            params: '',
            type: typeof(true),
            description: "If food exists on the ant's square, picks it up and returns true, otherwise returns false",
            example: function() {
              if (this.lookForFood()) {
                if (this.pickUpFood()) {
                  this.setState('carrying');
                }
              }
            }.toString().split('\n')
          },
          {
            name: 'move',
            params: 'direction: Vector',
            type: '',
            description: 'Moves the ant in the direction specified. Can only move 1 square at a time (in all directions)',
            example: function() {
              this.move(new Vector(0, -1));
            }.toString().split('\n')
          },
          {
            name: 'moveRandomly',
            params: '',
            type: '',
            description: 'Moves the ant in a random direction (or not at all)',
            example: function() {
              if (this.checkState() == 'lost') {
                this.moveRandomly();
              }
            }
          },
          {
            name: 'justMoved',
            params: '',
            type: typeof(true),
            description: 'Returns true if the ant has moved this turn. A vector with x and y as 0 will not count as a move.',
            example: function() {
              if (this.justMoved()) {
                this.releasePheromone('home', 0.75, this.lastMove.times(-1), 0.01, false);
              }
            }.toString().split('\n')
          },
          {
            name: 'checkPheromones',
            params: '',
            type: typeof({test: true}),
            description: 'Returns an object with a field for each pheromone in the current square',
            example: function() {
              var pheromones = this.checkPheromones();
              if (pheromones.food) {
                this.move(this.getPheromoneDirection('food'));
              }
            }.toString().split('\n')
          },
          {
            name: 'getPheromoneList',
            params: '',
            type: '[string]',
            description: 'Returns an array of all the pheromone keys found in this square',
            example: function() {
              var pheromones = this.getPheromoneList();
              if (pheromones.length == 0) {
                this.move(new Vector(1, 0));
              }
            }.toString().split('\n')
          },
          {
            name: 'getPheromoneDirection',
            params: 'key: string',
            type: 'Vector | null',
            description: "If a pheromone with this key exists on this square, return that pheromone's dominant direction. If no pheromone for that key exists, return null.",
            example: function() {
              var pheromones = this.checkPheromones();
              if (pheromones.food) {
                this.move(this.getPheromoneDirection('food'));
              }
            }.toString().split('\n')
          },
          {
            name: 'releasePheromone',
            params: 'key: string, intensity: number, direction: Vector, degrade: number, stack: boolean, max: number',
            type: 'boolean',
            description: "Leave a pheromone at this square. Returns true if added successfully, otherwise false if couldn't find a square to add to.",
            paramDescription: [
              {name: 'key', desc: "an identifier for the pheromone"},
              {name: 'intensity', desc: "how much of the pheromone should be placed on the square?"},
              {name: 'direction', desc: "what direction is this pheromone pointing in?"},
              {name: 'degrade', desc: "How quickly does intensity approach zero?"},
              {name: 'stack', desc: "If this square already contains a pheromone with this key, should we combine the two? When ant gets the square's direction for this key, it will receive an average direction across all pheromones, weighted by intensity."},
              {name: 'max', desc: "What is the max intensity this pheromone should be limited to? In pheromones that can stack multiple directions, we add the intensity to the direction that matches this pheromone's direction (if there is one.)"}
            ],
            example: function() {
              if (this.justMoved()) {
                this.releasePheromone('home', 0.75, this.lastMove.times(-1), 0.01, false);
              }
            }.toString().split('\n')
          },
          {
            name: 'atNest',
            params: '',
            type: 'boolean',
            description: 'Returns true if the ant is at the nest, false if otherwise',
            example: function() {
              if (this.atNest()) {
                this.depositFood();
                this.setState('looking');
              }
            }.toString().split('\n')
          },
          {
            name: 'depositFood',
            params: '',
            type: 'boolean',
            description: 'Attemps to deposit food at the nest. Returns true if successful, false if not (due to lack of food, or not being at the nest)',
            example: function() {
              if (this.atNest()) {
                this.depositFood();
                this.setState('looking');
              }
            }.toString().split('\n')
          }
        ]
      }
    }
  }

  componentDidMount() {
    console.log(this.refs.game);
  }

  render() {
    return (
      <div style={{
        position: 'absolute', 
        background: '#e0e4f1', 
        padding: 16, 
        fontFamily: 'Helvetica'
      }}>
        <div style={{
          padding: 16, 
          paddingTop: 0, 
          borderStyle: 'solid', 
          borderTopWidth: '0px', 
          borderRightWidth: '0px', 
          borderLeftWidth: '0px', 
          borderBottomWidth: '2px'
        }}>
          <h1>Ant API</h1>
          <Tag name="Ant"/>
          <Tag name="Pheromone"/>
          <Tag name="Vector"/>
        </div>
        <MethodList title='Ant' list={this.state.methods.ant}/>
        <MethodList title='Pheromone' list={this.state.methods.pheromone}/>
        <MethodList title='Vector' list={this.state.methods.vector}/>
      </div>
    );
  }
}

const API = connect(
  mapStateToProps,
  mapDispatchToProps
)(APIComponent);

export default API;
