import React, { useMemo, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navigation from './components/nav';
import userContext, { userType } from './hooks/userContext';
import Page401 from './pages/401';
import Page404 from './pages/404';
import AccountPage from './pages/account';
import AdminPage from './pages/admin';
import Contact from './pages/contact';
import TheCollection from './pages/coolPage';
import Grincher from './pages/grincher';
import Home from './pages/home';
import Legal from './pages/legal';
import Login from './pages/login';
import PageOther from './pages/other';
import RtxC from './pages/rtxChecker';
import Signup from './pages/signup';
import WebhookT from './pages/webhookTools';


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
								path="/legal"
								exact
								component={() => <Legal />}
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
								path="/rtx"
								exact
								component={() => <RtxC />}
							/>
							<Route
								path="/account"
								exact
								component={() => user?.ID ? <AccountPage /> : <Login/> }
							/>
							<Route
								path="/TheCollection"
								exact
								component={() => user?.ID ? <TheCollection /> : <Login/> }
							/>
							<Route
								path="/admin"
								exact
								component={() => (user?.PowerID ?? 0) >=5 ? <AdminPage /> : <Page401 msg="You are unauthorized to access this."/> }
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