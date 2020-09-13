import React, { useContext } from 'react';
import InfoBox from '../components/InfoBox';
import userContext from '../hooks/userContext';

function PageOther(props) {
	let { user } = useContext(userContext);
	return (
		<div className="home">
			<div className="container">
				<div
					className="jumbotron my-3"
					style={{ backgroundColor: '#ffffff11' }}
				>
					<h1> Hi, {user?.Username}! </h1>
					<hr className="my-4 light" />
					<p>Here is some things you currently have access to.</p>
				</div>
				<div
					className="row align-items-center my-5"
					style={{ display: 'flex', justifyContent: 'center' }}
				>
					<InfoBox linkTo="webhook" title="Webhook" Desc="Manage discord webhooks easily" />
					{user?.PowerID >= 5 && <InfoBox linkTo="admin" title="Admin" Desc="The admin panel" />}
				</div>
			</div>
		</div>
	);
}

export default PageOther;
