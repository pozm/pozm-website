import React, { useContext } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import AccountForm from "../components/AccountForm";
import userContext from "../hooks/userContext";
import Page404 from "./404";

let ref = React.createRef<HTMLDivElement>();
let recaptcha = React.createRef<ReCAPTCHA>();

type Props= {

};


const Signup :React.FC<Props> = (props) => {

  let UserContext = useContext(userContext);
  let location = useLocation()
  let search = new URLSearchParams(location.search)
  let key = search.get('key')
  let History = useHistory()

  async function CreateAccount(e :React.FormEvent<HTMLFormElement> | undefined, state : object | undefined ) {
    if (!state) {
      if (ref.current) {
        ref.current.hidden = false;
        ref.current.innerText = "Missing values.";
      }
      return;
    }
    if (!Object.values(state).every((v) => v !== ""))
    {
      if (ref.current) {
        ref.current.hidden = false;
        ref.current.innerText = "Missing values."
      }
      return;
    }
    let data = await fetch("/api/createAccount", {
      body: JSON.stringify({...state,key}),
      mode: "same-origin",
      method: "POST",
    });
    if (data.ok) {
      fetch("/api/getUser")
        .then((res) => res.json())
        .then((out) => {
          console.log(out,out.data)
          if (!out.error && out.data) UserContext?.setUser(out.data);
        });
    } else {
      if (ref.current) 
      {
        ref.current.hidden = false;
        ref.current.innerText = (await data.json()).message;
      }
      recaptcha.current?.reset();
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
        {UserContext?.user?.ID && <Redirect from="/Signup" to="/" />}
        <div >
          <h2>Using key : {key} </h2>
          <AccountForm
            className="mx-auto"
            style={{width:'fit-content'}}
            recaptchaRef={recaptcha}
            helperMsgRef={ref}
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