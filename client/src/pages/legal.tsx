import React from "react";
import {Link} from "react-router-dom";
// import data from "../JSON-Data/h.json"
type Props = {};


export const Legal: React.FC<Props> = (props) => {
    return (
        <div className="home">
            <div className="container" style={{display: 'flex', flexFlow: 'wrap', justifyContent: 'center'}}>
                <div className="row align-items-center my-5">
                    <div className="col-lg" id="data">
                        <h2>Data we store</h2>
                        <div className="col" style={{margin: "0px auto"}}>
                            <ol>
                                <li> UserNames</li>
                                <li> Emails</li>
                                <li> Your account unique identifier</li>
                                <li> What clearance level your account has</li>
                                <li> What time you registered at</li>
                                <li> Subscriptions your account has access to</li>
                                <li> What key you used to activate your account</li>
                                <li> Registered IP address (HASHED)</li>
                                <li> Registered last IP address (HASHED)</li>
                                <li> Registered password (HASHED)</li>
                                <li> Discord ID (on link)</li>
                                <li> Discord Username + tag (on link)</li>
                            </ol>
                        </div>
                    </div>
                </div>
                <div className="row align-items-center my-2 mx-lg-5">
                    <p style={{wordBreak: "break-word", wordWrap: "break-word"}}>
                        By creating an account you agree to having this data stored.
                        If you want to delete your account you can do that by contacting me via a way @ <Link
                        to="/contact"> contact page </Link>.<br/>
                        None of the data we store gets sold to third parties.
                        We store Ips so that don't have to deal with people making multiple accounts and flooding my api
                        / website & allows me to more effectively take actions on users doing this.
                    </p>
                </div>
                <div className="row align-items-center my-2 mx-lg-5">
                    <p style={{wordBreak: "break-word", wordWrap: "break-word"}}>
                        Within the collection there is multiple images & categories, i am not responsible for hosting
                        them nor if they include sensitive content.
                        Leaking content from the collection will result in account termination.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Legal