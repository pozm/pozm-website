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
import userContext, { userType } from './hooks/userContext';
import PageOther from './pages/other';
import Page401 from './pages/401';
import AccountPage from './pages/account';

type Props = {

}

const App : React.FC<Props> = ({}) => {
	const [user, setUser] = useState<userType>(null);

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
					<div className="main">
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
								path="/account"
								exact
								component={() => user?.ID ? <AccountPage /> : <Login/> }
							/>
							<Route
								path="/Webhook"
								exact
								component={() => <WebhookT /> }
							/>
							<Route
								path="/Other"
								exact
								component={() => <PageOther />}
							/>
							<Route component={Page404} />
						</Switch>
					</div>
				</userContext.Provider>
			</Router>
		</div>
	);
}
export default App