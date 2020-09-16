import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/InfoBox.css';
import '../styles/utils.css';
type Props= {
	title : string
	linkTo: string
	Desc: string
	text?: string
};


export const InfoBox: React.FC<Props> = ({text,title,Desc,linkTo}) => {
		return (
		<div className="InfoBox">
			<div
				className="itParent"
				style={{ marginBottom: text ? '10px' : '0px' }}
			>
				<p className="InfoText">
					{linkTo? <Link to={'/' + linkTo} >{title}</Link>:<h2>{title}</h2>}
				</p>
			</div>
			{Desc && (
				<div style={{ maxWidth: '600px', display: 'flex' }}>
					<div className="hbar" />
					<p className="mb-0">{Desc}</p>
				</div>
			)}
		</div>
	);
}
export default InfoBox;
