import React, {useMemo} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Container, Content, Loader, Notification} from 'rsuite';


import Navigation from './components/nav';
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
import Signup from './pages/signup';
import WebhookT from './pages/webhookTools';

import {DiscordLinkUrl} from "./utils";
import useUser from "./hooks/useUser";
import UserPage from "./pages/user";


type Props = {}

const App: React.FC<Props> = () => {
    const {user, loading} = useUser()
    // console.log(user)

    useMemo(() => {
        if (loading) return;
        setTimeout(() => console.log("%cDo not paste anything in here unless ur retarded", "color:red; font-size: 50px;-webkit-text-stroke-color:black;-webkit-text-stroke-width:2px"), 1e3)
        let lastSeenDiscord = parseInt(window.localStorage.getItem("seenDiscord") ?? "0")
        if (user?.ID && lastSeenDiscord < 2 && !user.DiscordID) {
            Notification.open({
                title: 'Discord Link',
                description: <div>You have gained access to join the discord, you may link your account from <a
                    href={DiscordLinkUrl}>here</a></div>,
                duration: 0,
            });
            window.localStorage.setItem("seenDiscord", "2")
        }
        let ds = window.localStorage.getItem("DiscordState")
        if (ds) {
            if (ds === "1") {
                Notification.open({
                    title: 'Discord Link',
                    description: <div>Successfully linked your discord.</div>,
                    duration: 10e3,
                });
            } else {
                switch (ds) {
                    case "2":
                        Notification.open({
                            title: 'Discord Link',
                            description: <div>You are banned from the discord, therefore you are unable to join.</div>,
                            duration: 10e3,
                        });
                        break;
                    case "3":
                        Notification.open({
                            title: 'Discord Link',
                            description: <div>Unable to join discord (unknown)</div>,
                            duration: 10e3,
                        });
                        break;
                    case "4" :
                        Notification.open({
                            title: 'Discord Link',
                            description: <div>Discord account is already linked to another account</div>,
                            duration: 10e3,
                        });
                        break;
                    case "11" :
                        Notification.open({
                            title: 'Discord Login',
                            description: <div>Successfully logged in using discord.</div>,
                            duration: 10e3,
                        });
                        break;
                    case "12" :
                        Notification.open({
                            title: 'Discord Link',
                            description: <div>Unable to login with this discord account, are you sure you linked?</div>,
                            duration: 10e3,
                        });
                        break;
                }

            }
            window.localStorage.setItem("DiscordState", " -1")
        }
    }, [loading, user]);
    return (
        <div className="App">
            <Router>
                <div style={{display: "flex"}}>
                    <div style={{zIndex: 10}}>
                        <Navigation/>
                    </div>
                    <Content style={{minHeight:"100vh",}}  >
                        <Container className="main" style={{width:"calc(100% - 15px)", paddingLeft:15,paddingRight:0}} >
                            {loading ?
                                <Loader size={"lg"} center content={"Requesting data..."} vertical/>
                                :
                                <Switch>
                                    <Route path="/" exact component={() => <Home/>}/>
                                    <Route
                                        path="/contact"
                                        exact
                                        component={() => <Contact/>}
                                    />
                                    <Route
                                        path="/legal"
                                        exact
                                        component={() => <Legal/>}
                                    />
                                    <Route
                                        path="/grincher"
                                        exact
                                        component={() => <Grincher/>}
                                    />
                                    <Route
                                        path="/signUp"
                                        exact
                                        component={() => <Signup/>}
                                    />
                                    <Route
                                        path="/Login"
                                        exact
                                        component={() => <Login/>}
                                    />
                                    <Route
                                        path="/account"
                                        exact
                                        component={() => user?.ID ? <AccountPage/> : <Login/>}
                                    />
                                    <Route
                                        path="/TheCollection/:id?"
                                        exact
                                        component={() => user?.ID ? <TheCollection/> : <Login/>}
                                    />
                                    <Route
                                        path="/user/:id"
                                        exact
                                        component={() => <UserPage/>}
                                    />
                                    <Route
                                        path="/admin"
                                        exact
                                        component={() => (user?.PowerID ?? 0) >= 5 ? <AdminPage/> :
                                            <Page401 msg="You are unauthorized to access this."/>}
                                    />
                                    <Route
                                        path="/Webhook"
                                        exact
                                        component={() => <WebhookT/>}
                                    />
                                    <Route component={Page404}/>
                                </Switch>
                            }
                        </Container>
                    </Content>
                </div>
            </Router>
        </div>
    );
}
export default App