import React, { useMemo, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Navigation from './components/nav';
import Signup from './pages/signup';
import Grincher from './pages/grincher';
import Contact from './pages/contact';
import Page404 from './pages/404';
import WebhookT from './pages/webhookTools';
import userContext from './hooks/userContext';
import PageOther from './pages/other';
import Page401 from './pages/401';

export default function App(props) {
	const [user, setUser] = useState(null);

	useMemo(() => {
		fetch('/api/getUser')
			.then((res) => res.json())
			.then((out) => {
				if (!out.error && out.data) setUser(out.data);
			});
	}, []);
	return (
		<div className="App">
			<Router>
				<userContext.Provider value={{ user, setUser }}>
					<Navigation />
					<Switch>
						<Route path="/" exact component={() => <Home />} />
						<Route
							path="/contact"
							exact
							component={() => <Contact />}
						/>
						<Route
							path="/grincher"
							exact
							component={() => <Grincher />}
						/>
						<Route
							path="/signUp"
							exact
							component={() => <Signup />}
						/>
						<Route
							path="/Login"
							exact
							component={() => <Login />}
						/>
						<Route
							path="/Webhook"
							exact
							component={() => user ? <WebhookT /> : <Page401 msg="You must be signed in to access this." />}
						/>
						<Route
							path="/Other"
							exact
							component={() => user? <PageOther /> : <Page401 msg="You must be signed in to access this." />}
						/>
						<Route component={Page404} />
					</Switch>
				</userContext.Provider>
			</Router>
		</div>
	);
}
