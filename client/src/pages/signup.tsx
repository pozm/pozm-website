import React from "react";
import ReCAPTCHA from "react-google-recaptcha";
import {Redirect, useLocation} from "react-router-dom";
import {Alert} from "rsuite";
import AccountForm from "../components/AccountForm";
import Page404 from "./404";
import useUser from "../hooks/useUser";

let recaptcha = React.createRef<ReCAPTCHA>();

type Props = {};


const Signup: React.FC<Props> = (props) => {

    const {user, mutate} = useUser()
    let location = useLocation()
    let search = new URLSearchParams(location.search)
    let Key = search.get('key')

    async function CreateAccount(e: React.SyntheticEvent<Element, Event> | undefined, state: {
        formValue: {
            Email: string;
            UserName: string;
            Password: string;
        };
        Recaptcha: string;
    } | undefined) {
        if (!state) {
            Alert.error("Missing values.");
            return;
        }
        if (!Object.values(state).every((v) => v !== "")) {
            Alert.error("Missing values.")
            return;
        }
        let data = await fetch("/api/Account/Create", {
            body: JSON.stringify({...state.formValue, Recaptcha: state.Recaptcha, Key}),
            mode: "same-origin",
            method: "POST",
        });
        if (data.ok) {
            mutate("/api/Account/me")
        } else {
            data.json().then((jsn) => {
                let msg = jsn.message
                console.log(msg, jsn)
                Alert.error(msg)
                recaptcha.current?.reset();
            })
        }
    }

    return (
        <div>
            {Key === '' || Key === null ? <Page404/> :
                <div
                    className="container home my-5"
                    style={{
                        // display: "flex",
                        flexFlow: "wrap",
                        justifyContent: "center",
                        // paddingTop: "30px",
                    }}
                >
                    {user?.ID && <Redirect from="/Signup" to="/"/>}
                    <div>
                        <h2>Using key : {Key} </h2>
                        <AccountForm
                            className="mx-auto"
                            // style={{width:'fit-content'}}
                            recaptchaRef={recaptcha}
                            Login={false}
                            SubmitFunc={CreateAccount}
                        />
                    </div>
                </div>
            }
        </div>
    );
}
export default Signup