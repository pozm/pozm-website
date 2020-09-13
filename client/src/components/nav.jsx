import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import userContext from '../hooks/userContext';

// let uv = useContext(userContext);

class Navigation extends React.Component {
	static contextType = userContext;

	constructor(props) {
		super(props);
		this.state = { data: {} };

		this.signOut = this.signOut.bind(this);
	}

	signOut() {
		fetch('/api/killSession', { method: 'DELETE' }).then((res) => {
			if (res.ok) return this.context.setUser(null);
		});
	}

	render() {
		return (
			<div className="navigation">
				<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
					<div className="container">
						<Link className="navbar-brand" to="/">
							Pozm
						</Link>
						<button
							className="navbar-toggler"
							type="button"
							data-toggle="collapse"
							data-target="#navbarResponsive"
							aria-controls="navbarResponsive"
							aria-expanded="false"
							aria-label="Toggle navigation"
						>
							<span className="navbar-toggler-icon"></span>
						</button>
						<div
							className="collapse navbar-collapse"
							id="navbarResponsive"
						>
							<ul className="navbar-nav ml-auto">
								<li
									className={`nav-item  ${
										this.props.location.pathname === '/'
											? 'active'
											: ''
									}`}
								>
									<Link className="nav-link" to="/">
										Home
									</Link>
								</li>
								<li
									className={`nav-item  ${
										this.props.location.pathname ===
										'/contact'
											? 'active'
											: ''
									}`}
								>
									<Link className="nav-link" to="/contact">
										Contact
									</Link>
								</li>
								{this.context?.user?.ID ? (
									<li>
										<div className="dropdown">
											<button
												className="btn btn-secondary dropdown-toggle"
												id="dropdownMenuLink"
												data-toggle="dropdown"
												aria-haspopup="true"
												aria-expanded="false"
											>
												Logged in as{' '}
												{this.context?.user?.Username}
											</button>

											<div
												className="dropdown-menu"
												aria-labelledby="dropdownMenuLink"
											>
												{this.context?.user?.PowerID >=
													5 && (
													<Link
														to="/admin"
														className="dropdown-item"
														href="#"
													>
														Admin panel
													</Link>
												)}
												<Link
													to="/Other"
													className="dropdown-item"
													href="#"
												>
													Other
												</Link>
												<div className="dropdown-divider"></div>
												<button
													className="dropdown-item"
													onClick={this.signOut}
													href="#"
												>
													Sign out 
												</button>
											</div>
										</div>
									</li>
								) : (
									<li>
										<Link
											to="/Login"
											type="button"
											className="btn btn-primary tooltip-directions"
											data-toggle="tooltip"
											data-placement="bottom"
											title="Log into your account"
										>
											Log in
										</Link>
									</li>
								)}
							</ul>
						</div>
					</div>
				</nav>
			</div>
		);
	}
}

export default withRouter(Navigation);
