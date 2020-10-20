import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useContext, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useHistory, useLocation, withRouter } from 'react-router-dom';
import { Button, Container, Dropdown, Icon, Nav, Navbar, Sidebar, Sidenav } from 'rsuite';
import userContext from '../hooks/userContext';
import '../styles/nav.css';

type Props= {

};

const headerStyles :React.CSSProperties = {
	height:2,
	backgroundColor:"var(--blue)",
	color: '#fff'
};
function parsePathToKey(p : string) {
	switch (p) {
		case "/":
			return "1";
		case "/contact":
			return "2";
		case "/account":
			return "4-2"
		case "/webhook":
			return "3-5"
		case "/legal":
			return "5-1"
		default:
			return "1"
	}
}
const NavToggle = ({ expand  , onChange } : {expand : boolean, onChange : () => void}) => {
	return (
	  <Navbar appearance="subtle" className="nav-toggle" style={{borderTop: "1px solid #3c3f43"}}>
		<Navbar.Body>
		  <Nav pullRight>
			<Nav.Item onClick={onChange} style={{ width: 56, textAlign: 'center' }}>
			  <Icon icon={expand ? 'angle-left' : 'angle-right'} />
			</Nav.Item>
		  </Nav>
		</Navbar.Body>
	  </Navbar>
	);
  };


export const NavComp: React.FC<Props> = ({}) => {
	let location = useLocation()
	let history = useHistory()
	let uv= useContext(userContext);

	let [navState, setNavState] = useState({expanded:false,activeKey:"1"})

	let toggleExpand = useCallback( () => setNavState({...navState, expanded:!navState.expanded })  , [navState] )

	const isMobile = useMediaQuery({ query: '(max-width: 760px)' });

	let signout = useCallback(()=>{
		fetch('/api/killSession', { method: 'DELETE' }).then((res) => {
			if (res.ok) return uv!.setUser(null);
		});
	},[uv?.setUser])
	const onSel = useCallback((key) => {
		switch ( key ) {
			case "1":
				history.push('/');
			break;
			case "2":
				history.push('/contact')
			break;

			// 3

			case "3-1":
				window.location.href='https://github.com/pozm/Nvidia_Rtx_Client'
			break;
			case "3-2":
				window.location.href='https://github.com/Bork0038/bot-tools'
			break;
			case "3-3":
				window.location.href='https://github.com/pozm/Abyss'
			break;
			case "3-4":
				window.location.href='https://github.com/pozm/Nvidia_Rtx_Client'
			break;
			case "3-5":
				history.push('/webhook')
			break;
			case "3-6":
				window.location.href='https://github.com/pozm/Nvidia_Rtx_Client'
			break;

			// 4

			case "4-1":
				history.push("/account")
			break;
			case "4-2":
				history.push("/account")
			break;
			case "4-3":
				signout();
			break;
			
			
			// 5
			
			
			case "5-1":
				history.push('/legal')
			break;

			default:
				history.push('/');
			break;
		}
	},[])
	const Nav_body = (
		<Sidenav.Body>
			<Nav>
				<Nav.Item eventKey="1" icon={<Icon icon="dashboard" />}>
					Home
				</Nav.Item>
				<Nav.Item eventKey="2" icon={<Icon icon="envelope" />}>
						Contact
				</Nav.Item>
				<Dropdown eventKey="3" title="Projects" icon={<Icon icon="folder" />}>  
					<Dropdown.Item eventKey="3-1"> Rtx Client </Dropdown.Item>
					<Dropdown.Item eventKey="3-2"> Bot Tools </Dropdown.Item>
					<Dropdown.Item eventKey="3-3"> Discord Bot </Dropdown.Item>
					{/* <Dropdown.Item disabled eventKey="3-4"> Among us cheat </Dropdown.Item> */}
					<Dropdown.Item eventKey="3-5"> Webhook tools </Dropdown.Item>
					{/* <Dropdown.Item disabled eventKey="3-6"> Lua deobfuscator </Dropdown.Item> */}
				</Dropdown>
				<Dropdown eventKey="4" title="Account" icon={<Icon icon="user" />}>
					{ uv?.user?.ID ? (<Dropdown.Item disabled > Signed in as {uv.user.Username} </Dropdown.Item> ) : (<Dropdown.Item eventKey="4-1" > Sign In </Dropdown.Item> ) }
					{ uv?.user?.ID  && (<Dropdown.Item eventKey="4-2">View Content</Dropdown.Item>)}
					{ uv?.user?.ID  && (<Dropdown.Item eventKey="4-3">Sign Out</Dropdown.Item>)}
				</Dropdown>
				
				<Dropdown eventKey="5" title="Other" icon={<Icon icon="question" />}>
					<Dropdown.Item eventKey="5-1" icon={<Icon icon="exclamation" />} > Legal </Dropdown.Item>
				</Dropdown>
			</Nav>
		</Sidenav.Body>
	)
	return (
		<div style={{width:navState.expanded && !isMobile ? 260 : isMobile ? 0 : 56, transition: "width 0.2s ease-in" }} >
			<Container style={{position:"fixed"}} >
				{!isMobile ? (
				<Sidebar
					style={{ display: 'flex', flexDirection: 'column', height:"100vh"}}
					width={navState.expanded && !isMobile ? 260 : 56}
					collapsible
				>
					<Sidenav.Header>
						<div style={headerStyles}></div>
					</Sidenav.Header>
					<Sidenav onSelect={onSel} defaultOpenKeys={['3', '4']} activeKey={parsePathToKey(location.pathname)}  style={{flex: "1 1 auto"}} appearance="subtle" expanded={navState.expanded} >
						{Nav_body}
					</Sidenav>
					<NavToggle expand={navState.expanded} onChange={toggleExpand} />
				</Sidebar>
				) :
				<div style={{ width: (isMobile && navState.expanded ) ? "100%": !isMobile ? 250 : 56, position:"fixed", height:"100vh", top:0,zIndex:10 }}>
					<Button style={{
						display:"flex",
						borderRadius:"0px 6px 6px 0px",
						position:"absolute",
						marginLeft: `${ navState.expanded && !isMobile? "calc(100%)" : isMobile? "0px" : "56px" }`,
						marginTop:"2px",
						backgroundColor:"#1a1d24",
						transition: "all 0.2s ease-in",
						zIndex:11,
						right: (isMobile && navState.expanded) ? "5px" : "inherit"
					}}  onClick={toggleExpand} >
						<FontAwesomeIcon icon={faBars} size="2x" rotate="180"/>
					</Button>
					<Sidenav onSelect={onSel} defaultOpenKeys={['3', '4']} activeKey={parsePathToKey(location.pathname)} style={{ height:"100vh", transition:"all 0.2s ease-in" , transform: (isMobile && !navState.expanded) ? "translateX(-60px)" : "" }} expanded={navState.expanded} >
						<Sidenav.Header>
							<div style={headerStyles}></div>
						</Sidenav.Header>
						{Nav_body}
					</Sidenav>
				</div>
				}
			</Container>
		</div>
	);
};


export default withRouter(NavComp);
