import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/InfoBox.css';
import '../styles/utils.css';

class InfoBox extends React.Component {
	render() {
		return (
			<div className="InfoBox">
				<div
					className="itParent"
					style={{ marginBottom: this.props.text ? '10px' : '0px' }}
				>
					<p className="InfoText">
						{this.props.linkTo? <Link to={'/' + this.props.linkTo} >{this.props.title}</Link>:<h2>{this.props.title}</h2>}
					</p>
				</div>
				{this.props.Desc && (
					<div style={{ maxWidth: '600px', display: 'flex' }}>
						<div className="hbar" />
						<p className="mb-0">{this.props.Desc}</p>
					</div>
				)}
			</div>
		);
	}
}
export default InfoBox;
