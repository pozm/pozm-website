import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard, faAt, faCog, faFileContract, faHome, faServer, faSignOutAlt, faTerminal } from '@fortawesome/free-solid-svg-icons';
import React, { useCallback, useContext } from 'react';
import { Link, useLocation, withRouter } from 'react-router-dom';
import '../styles/nav.css';
import userContext from '../hooks/userContext';

type Props= {

};

export const NavComp: React.FC<Props> = ({}) => {
	let location = useLocation()
	let uv= useContext(userContext)
	
	let signout = useCallback(()=>{
		fetch('/api/killSession', { method: 'DELETE' }).then((res) => {
			if (res.ok) return uv!.setUser(null);
		});
	},[uv?.setUser])

	return (
		<nav className="NavBar">
			<ul className="NavBar-Nav">
				<li className="NavBar-Item">
					<Link to="/"  className="NavBar-Link">
						<FontAwesomeIcon icon={faHome} size='2x' />
						<span className={"Link-text " + (location.pathname == '/' && 'active') }>Home</span>
					</Link>
				</li>
				<li className="NavBar-Item">
					<Link to="/contact"  className="NavBar-Link">
						<FontAwesomeIcon icon={faAt} size='2x' />
						<span className={"Link-text " + (location.pathname == '/contact' && 'active') }>Contact</span>
					</Link>
				</li>
				<li className="NavBar-Item">
					<Link to="/account"  className="NavBar-Link">
						<FontAwesomeIcon icon={faAddressCard} size='2x' />
						<span className={"Link-text " + (location.pathname == '/Login' && 'active') }>Account</span>
					</Link>
				</li>
				{uv?.user?.ID &&
				<li className="NavBar-Item">
					<a href='#' onClick={signout} className="NavBar-Link">
						<FontAwesomeIcon icon={faSignOutAlt} size='2x' />
						<span className="Link-text "  > sign out </span>
					</a>
				</li>
				}
				<li className="NavBar-Item">
					{uv?.user?.ID && <span className="Link-text "> Signed in as {uv.user.Username} </span>}
					<a className="NavBar-Link"> 

						<FontAwesomeIcon icon={faCog} size='2x' />
						<span className={"Link-text " + (location.pathname == '/settings' && 'active') }>Settings</span>

					</a>
				</li>
			</ul>
		</nav>
	);
};


export default withRouter(NavComp);
