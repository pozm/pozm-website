import React from "react";
import ReCAPTCHA from "react-google-recaptcha";
import {Redirect} from "react-router-dom";
import {Alert} from "rsuite";
import AccountForm from "../components/AccountForm";
import useUser from "../hooks/useUser";

let recaptcha = React.createRef<ReCAPTCHA>();

interface Props {
    RedirectTo?: string
}

const Login: React.FC<Props> = ({RedirectTo = "/"}) => {
    const {user, mutate} = useUser()

    async function LoginFunc(e: React.SyntheticEvent<Element, Event> | undefined, state: {
        formValue: {
            Email: string;
            UserName: string;
            Password: string;
        };
        Recaptcha: string;
    } | undefined) {
        if (state?.formValue?.UserName === "") {
            state.formValue.UserName = state?.formValue?.Email
        }
        console.log(state)
        if (!state) {
            Alert.error("Missing values.");
            return;
        }
        if (!Object.values(state).every((v) => v !== "")) {
            Alert.error("Missing values.")
            return;
        }
        // let {data,error} = useSWR("/api/LogintoAccount")
        let data = await fetch("/api/LogintoAccount", {
            body: JSON.stringify({...state.formValue, Recaptcha: state.Recaptcha}),
            mode: "same-origin",
            method: "POST",
            credentials: "same-origin"
        });
        if (data?.ok) {
            mutate("/api/getUser")
        } else {
            Alert.error((await data.json()).message)
            recaptcha.current?.reset();
        }
    }

    return (
        <div className="container home my-5">
            {user?.ID && <Redirect from="/Login" to={RedirectTo}/>}
            <div
                style={{
                    flexFlow: "wrap",
                    justifyContent: "center",
                }}>

                <AccountForm
                    recaptchaRef={recaptcha}
                    Login={true}
                    SubmitFunc={LoginFunc}
                />
            </div>
            <p> dm me for invite if you do not have an account.</p>
        </div>
    );
}

export default Login;
