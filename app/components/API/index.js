import React, { Component } from 'react';
import Modal from '../Modal';
import Codemirror from 'react-codemirror';
import { connect } from 'react-redux';
import _ from 'lodash';
import Vector from '../Game/engine/Vector';
import { hideAPI, toggleMethod } from '../../actions/Game';

import '../../../node_modules/codemirror/mode/javascript/javascript'
import '../../../node_modules/codemirror/lib/codemirror.css'

function mapStateToProps(state) {
  return {
    showingAPI: state.Game.showingAPI,
    level: state.Game.level,
    toggledMethods: state.Game.toggledMethods
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideAPI: () => {
      dispatch(hideAPI())
    },
    toggleMethod: (method) => {
      dispatch(toggleMethod(method))
    }
  };
}

class MethodList extends Component {
  constructor(props) {
    super(props);
    // this.state = this.refreshLists();
  }

  refreshLists() {
    console.log("refreshing lists...");
    var list = _.filter(this.props.list, function(m) {
      return typeof(m.level) !== 'undefined' && m.level <= this.props.level;
    }.bind(this));
    list = _.sortBy(list, 'name');

    var tags = list.map(function(m, index) {
      return <Tag mLevel={m.level} key={index} name={m.name}/>
    }.bind(this));

    var methods = list.map(function(m, index) {
      return <MethodComponent level={this.props.level} m={m} key={index} parentName={this.props.title} stuff={m}/>;
    }.bind(this));

    return {list, tags, methods};
  }

  componentDidMount() {
    // this.setState(this.refreshLists());
  }

  render() {
    var list = _.filter(this.props.list, function(m) {
      return typeof(m.level) !== 'undefined' && m.level <= this.props.level;
    }.bind(this));
    list = _.sortBy(list, 'name');
    console.log("list", list.length, this.props.level);

    var tags = list.map(function(m, index) {
      return <Tag mLevel={m.level} key={index} name={m.name}/>
    }.bind(this));

    var methods = list.map(function(m, index) {
      return <MethodComponent level={this.props.level} m={m} key={index} parentName={this.props.title} stuff={m}/>;
    }.bind(this));

    return <div 
      style={{
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
      <div style={{width: '100%'}}>{tags}</div>
      {methods}
    </div>;
  }
}

class _Tag extends Component {
  constructor(props) {
    super(props);
    this.onClick=this.onClick.bind(this);
  }

  onClick() {
    this.props.toggleMethod(this.props.name);
  }

  render() {
    var toggled = this.props.toggledMethods.indexOf(this.props.name) > -1;
    console.log("tag", this.props.mLevel, this.props.level);
    return <a 
      onClick={this.onClick}
      style={{
      background: 'white', 
      margin: 4, 
      textDecoration: 'none', 
      padding: 8, 
      borderStyle: 'solid', 
      borderColor: !toggled && this.props.level == this.props.mLevel ? 'red' : 'black',
      borderWidth: !toggled && this.props.level == this.props.mLevel ? '1.5px' : '1px', 
      borderRadius: '4px', 
      fontFamily: 'monospace', 
      fontSize: 14, 
      paddingRight: 8, 
      display: 'inline-block'
    }} href={'#'+this.props.name}>{this.props.name}</a>;
  }
}

var Tag = connect(
  mapStateToProps,
  mapDispatchToProps
)(_Tag);

class _MethodComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lineCount: 0,
      toggled: false,
      str: this.beautify(props.stuff.example)
    };
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.props.toggleMethod(this.props.stuff.name);
    this.props.toggleMethod(this.props.parentName);
  }

  beautify(split) {
    var str = '';
    for (var i = 1; i < split.length - 1; i++) {
      var count = (split[i].match(' ') || []).length;
      if (count >= 1) {
        for (var j = 0; j < 12; j++) {
          split[i] = split[i].replace(' ', '');
        }
      }
      str += split[i] + '\n';
    }
    str = str.replace(/_Vector2.default/g, 'Vector');
    str = str.replace(/_Pheromone2.default/g, 'Pheromone');
    return str;
  }

  componentDidMount() {
    this.refs.codemirror.getCodeMirror().setSize('90%', this.props.stuff.example.length * 15);
    this.refs.codemirror.getCodeMirror().refresh();
  }

  componentDidUpdate() {
    this.refs.codemirror.getCodeMirror().refresh();
  }

  render() {
    var toggled = this.props.toggledMethods.indexOf(this.props.stuff.name) > -1;
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
    return (
      <div 
        onClick={this.onClick}
        style={{
        padding: 16, 
        paddingTop: 0, 
        marginTop: 8, 
        marginBottom: 8,
        borderColor: (!toggled && this.props.m.level == this.props.level) ? 'red' : 'black',
        borderWidth: (!toggled && this.props.m.level == this.props.level) ? '1.5px' : '1px', 
        borderStyle: 'solid', 
        borderRadius: '4px',
        background: 'white'
      }}>
        <div id={stuff.name}>
          <h3>{stuff.name + '(' + stuff.params + ')' + type}</h3>
          <p>{stuff.description}</p>
          {
            !stuff.paramDescription ? null :
            <ul>
              {stuff.paramDescription.map((p, index) => {
                return (<li key={index}><p>{p.name + ': ' + p.desc}</p></li>);
              })}
            </ul>
          }
          {
            !stuff.example ? null :
              <div>
                <h4>Example:</h4>
                <Codemirror ref="codemirror" value={this.state.str} options={options} />
              </div>
          }
        </div>
      </div>
    );
  }
}

var MethodComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(_MethodComponent);

class APIComponent extends Component {
  constructor(props) {
    super(props);
    this.exit = this.exit.bind(this);
    this.state = {
      methods: {
        pheromone: [

        ],
        vector: [
          {
            name: 'constructor',
            level: 0,
            params: 'x: number, y: number',
            type: 'Vector',
            description: "Create a new vector. Don't forget! The top left corner of the grid is (0, 0) - so, to move down the screen, move in the positive y direction.",
            example: function() {
              var up = new Vector(0, -1);
              var down = new Vector(0, 1);
              var left = new Vector(-1, 0);
              var right = new Vector(1, 0);
            }.toString().split('\n')
          },
          {
            name: 'add',
            level: 1,
            params: 'v2: Vector',
            type: 'Vector',
            description: "Returns a new vector that is the sum of this vector and v2.",
            example: function() {
              var v1 = new Vector(0, 1);
              var v2 = new Vector(0, 1);
              var v3 = v1.add(v2);
              //v3.x == 0
              //v3.y = 2
            }.toString().split('\n')
          },
          {
            name: 'minus',
            level: 1,
            params: 'v2: Vector',
            type: 'Vector',
            description: "Returns a vector that is equal to v2 subtracted from this vector.",
            example: function() {
              var v1 = new Vector(4, 3);
              var v2 = new Vector(1, 1);
              var v3 = v1.minus(v2);
              //v3.x == 3
              //v3.y = 2
            }.toString().split('\n')
          },
          {
            name: 'times',
            level: 1,
            params: 'v2: Vector',
            type: 'Vector',
            description: "Returns a vector that is equal to v2 mulitplied by this vector.",
            example: function() {
              var v1 = new Vector(3, 3);
              var v2 = new Vector(2, 3);
              var v3 = v1.times(v2);
              //v3.x == 6
              //v3.y = 9
            }.toString().split('\n')
          },
          {
            name: 'divide',
            level: 1,
            params: 'v2: Vector',
            type: 'Vector',
            description: "Returns a vector that is equal to this vector divided by v2.",
            example: function() {
              var v1 = new Vector(6, 9);
              var v2 = new Vector(3, 3);
              var v3 = v1.times(v2);
              //v3.x == 2
              //v3.y = 3
            }.toString().split('\n')
          },
          {
            name: 'round',
            level: 1,
            params: '',
            type: 'Vector',
            description: "Returns a vector that is equal to this vector, with x and y rounded.",
            example: function() {
              var v1 = new Vector(0.5, 1.1);
              var v2 = v1.round();
              //v2.x == 1
              //v2.y == 1
            }.toString().split('\n')
          },
          {
            name: 'floor',
            level: 1,
            params: '',
            type: 'Vector',
            description: "Returns a vector that is equal to this vector, with x and y floored to the nearest int.",
            example: function() {
              var v1 = new Vector(0.5, 1.1);
              var v2 = v1.round();
              //v2.x == 0
              //v2.y == 1
            }.toString().split('\n')
          },
          {
            name: 'ceil',
            level: 1,
            params: '',
            type: 'Vector',
            description: "Returns a vector that is equal to this vector, with x and y ceiled to the nearest int.",
            example: function() {
              var v1 = new Vector(0.5, 1.9);
              var v2 = v1.round();
              //v2.x == 1
              //v2.y == 2
            }.toString().split('\n')
          },
          {
            name: 'magnitude',
            level: 1,
            params: '',
            type: 'Vector',
            description: "Returns the magnitude of this vector.",
            example: function() {
              var v1 = new Vector(10, 10);
              var magnitude = v1.magnitude();
              //magnitude == 14.14...
            }.toString().split('\n')
          },
          {
            name: 'distance',
            level: 1,
            params: 'v2: Vector',
            type: 'Vector',
            description: "Returns the distance between this vector and v2.",
            example: function() {
              var v1 = new Vector(6, 4);
              var v2 = new Vector(10, 10);
              var distance = v1.distance(v2);
              //distance == 7.21...
            }.toString().split('\n')
          },
          {
            name: 'lerp',
            level: 1,
            params: 'v2: Vector, t: number',
            type: 'Vector',
            description: "Returns a vector that is t/1 between this vector and v2.",
            example: function() {
              var v1 = new Vector(6, 4);
              var v2 = new Vector(10, 10);
              var mid = v1.lerp(v2, 0.5);
              //mid is halfway between v1 and v2.
            }.toString().split('\n')
          },
          {
            name: 'normalised',
            level: 1,
            params: '',
            type: 'Vector',
            description: "Returns a vector in the same direction as this vector, with magnitude 1.",
            example: function() {
              var v1 = new Vector(6, 4);
              var v2 = new Vector(10, 10);
              var mid = v1.lerp(v2, 0.5);
              //mid is halfway between v1 and v2.
            }.toString().split('\n')
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
            level: 0,
            params: 'direction: Vector',
            type: '',
            description: 'Moves the ant in the direction specified. Can only move 1 square at a time (in all directions)',
            example: function() {
              this.move(new Vector(0, -1));
            }.toString().split('\n')
          },
          {
            name: 'moveRandomly',
            level: 0,
            params: '',
            type: '',
            description: 'Moves the ant in a random direction (or not at all)',
            example: function() {
              if (this.checkState() == 'lost') {
                this.moveRandomly();
              }
            }.toString().split('\n')
          },
          {
            name: 'justMoved',
            level: 0,
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

  exit() {
    this.props.hideAPI();
  }

  render() {
    console.log("API render", this.props.level);
    return (
      <div style={{
        position: 'absolute', 
        background: '#e0e4f1', 
        padding: 16, 
        fontFamily: 'Helvetica',
        width: '100%',
        height: '100%',
        overflow: 'scroll'
      }}>
        <div onClick={this.exit}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          paddingTop: 16,
          paddingRight: 32
        }}>
          <a style={{cursor: 'pointer', fontFamily: 'monospace', fontSize: 32, right: 0}}onClick={this.submitCode}>[EXIT]</a>
        </div>

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
          <Tag mLevel={-1} name="Ant"/>
          <Tag mLevel={-1} name="Vector"/>
        </div>
        <MethodList level={this.props.level} title='Ant' list={this.state.methods.ant}/>
        <MethodList level={this.props.level} title='Vector' list={this.state.methods.vector}/>
      </div>
    );
  }
}

const API = connect(
  mapStateToProps,
  mapDispatchToProps
)(APIComponent);

export default API;
