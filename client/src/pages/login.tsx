import React, { useContext } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Redirect } from "react-router-dom";
import { Alert } from "rsuite";
import AccountForm from "../components/AccountForm";
import userContext from "../hooks/userContext";
let recaptcha = React.createRef<ReCAPTCHA>();

function Login() {
	let UserContext = useContext(userContext);

	async function LoginFunc(e :React.FormEvent<HTMLFormElement> | undefined, state : {
		Email: string;
		UserName: string;
		Password: string;
		Recaptcha: string;
	} | undefined ) {
		if (state?.UserName) {
			state.UserName = "a"
		}
		console.log(state)
		if (!state) {
			Alert.error("Missing values.");
		  return;
		}
		if (!Object.values(state).every((v) => v !== ""))
		{
			Alert.error("Missing values.")
		  return;
		}
		let data = await fetch("/api/LogintoAccount", {
			body: JSON.stringify(state),
			mode: "same-origin",
			method: "POST",
		});
		if (data.ok) {
			fetch("/api/getUser")
				.then((res) => res.json())
				.then((out) => {
					if (!out.error && out.data) UserContext?.setUser(out.data);
				});
		} else {
			Alert.error((await data.json()).message)
			recaptcha.current?.reset();
		}
	}

	return (
		<div className="container home my-5">
		{UserContext?.user?.ID && <Redirect from="/Login" to="/" />}
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
