import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import AccountForm from "../components/AccountForm";
import userContext from "../hooks/userContext";

let ref = React.createRef();
let recaptcha = React.createRef();

function Signup() {

  let {user, setUser} = useContext(userContext);

  async function CreateAccount(e, state) {
    if (!Object.values(state).every((v) => v !== ""))
      return (
        (ref.current.hidden = false),
        (ref.current.innerText = "Missing values.")
      );
    let data = await fetch("/api/createAccount", {
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
        {user?.id && <Redirect from="/Signup" to="/" />}
				<AccountForm
					recaptchaRef={recaptcha}
					helperMsgRef={ref}
					Login="false"
					SubmitFunc={CreateAccount}
				/>
			</div>
		</div>
	);
}

export default Signup;
