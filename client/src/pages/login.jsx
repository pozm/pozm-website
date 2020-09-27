import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import AccountForm from "../components/AccountForm";
import userContext from "../hooks/userContext";

let ref = React.createRef();
let recaptcha = React.createRef();

function Login() {
  let {user, setUser} = useContext(userContext);

	async function LoginFunc(e, state) {
		console.log(state)
		if (!Object.values(state).some((v) => v === ""))
			return (
				(ref.current.hidden = false),
				(ref.current.innerText = "Missing values.")
			);

		let data = await fetch("/api/LogintoAccount", {
			body: JSON.stringify(state),
			mode: "same-origin",
			method: "POST",
		});
		if (data.ok) {
			fetch("/api/getUser")
				.then((res) => res.json())
				.then((out) => {
					if (!out.error && out.data) setUser(out.data);
				});
		} else {
			ref.current.hidden = false;
			ref.current.innerText = (await data.json()).message;
			recaptcha.current.reset();
		}
	}

	return (
		<div className="home">
			<div
				className="container"
				style={{
					display: "flex",
					flexFlow: "wrap",
					justifyContent: "center",
					paddingTop: "30px",
				}}
			>
        {user?.ID && <Redirect from="/Login" to="/" />}
				<AccountForm
					recaptchaRef={recaptcha}
					helperMsgRef={ref}
					Login={true}
					SubmitFunc={LoginFunc}
				/>
			</div>
		</div>
	);
}

export default Login;
