import React, { useContext } from "react";
import { Redirect, useLocation } from "react-router-dom";
import AccountForm from "../components/AccountForm";
import userContext from "../hooks/userContext";
import Page404 from "./404";

let ref = React.createRef();
let recaptcha = React.createRef();

function Signup(props) {

  let {user, setUser} = useContext(userContext);
  let location = useLocation()
  let search = new URLSearchParams(location.search)
  let key = search.get('key')

  async function CreateAccount(e, state) {
    if (!Object.values(state).every((v) => v !== ""))
      return (
        (ref.current.hidden = false),
        (ref.current.innerText = "Missing values.")
      );
    let data = await fetch("/api/createAccount", {
      body: JSON.stringify({...state,key}),
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
    {key === ''||key===null ? <Page404/> : 
			<div
				className="container"
				style={{
					display: "flex",
					flexFlow: "wrap",
					justifyContent: "center",
					paddingTop: "30px",
				}}
			>
        {user?.ID && <Redirect from="/Signup" to="/" />}
        <div>
          <h2>Using key : {key} </h2>
          <AccountForm
            recaptchaRef={recaptcha}
            helperMsgRef={ref}
            Login="false"
            SubmitFunc={CreateAccount}
          />
        </div>
			</div>
    }
		</div>
	);
}

export default Signup;
