import React, { Component } from 'react';
import { pause, play } from '../../actions/Game';
import { hideModal } from '../../actions/Modal';
import { connect } from 'react-redux';

function mapStateToProps(state) {
  return {
  	showing: state.Modal.showing,
  	contents: state.Modal.content
  };
}

function mapDispatchToProps(dispatch) {
  return {
    pause: () => {
      dispatch(pause());
    },
    play: () => {
      dispatch(play());
    },
    hideModal: () => {
      dispatch(hideModal());
    }
  };
}

class ModalComponent extends Component {
	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
	}

	componentDidUpdate() {
		if (this.props.showing) {
			this.props.pause();
		}
	}

	onClick() {
		this.props.hideModal();
		if (this.props.contents.onClose) this.props.contents.onClose();
		this.props.pause();
	}

	render() {
		if (this.props.showing) {
			return (
				<div style={{position: 'absolute', width: '100%', height: '100%'}}>
					<div style={{
						background: 'black', 
						opacity: '0.2', 
						margin: '0 auto', 
						width: '100%', 
						height: '100%', 
						position: 'absolute', 
						zIndex: 199}}
					/>

					<div style={{
						paddingLeft: '16px', 
						background: 'white', 
						margin: '0 auto', 
						left: '25%', 
						top: '25%', 
						width: '50%', 
						height: '50%', 
						position: 'absolute',
						borderStyle: 'solid',
						borderWidth: '4px',
						borderRadius: '32px',
						zIndex: 205,
						fontFamily: 'monospace'}}
						onClick={this.onClick}
					>
						<h1>{this.props.contents.title}</h1>
						<p style={{fontSize: 14}}>{this.props.contents.description}</p>
					</div>
				</div>
			);
		} else {
			return <div/>;
		}
	}
}

const Modal = connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalComponent);

export default Modal;