import React, { Component } from 'react';

class CodeBlock extends Component {
	render() {
		return (
			<div style={{background: 'grey', fontFamily: 'monospace'}}>
				{this.props.children}
			</div>
		);
	}
}

export default CodeBlock;