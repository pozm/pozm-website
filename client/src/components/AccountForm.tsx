import React, { useCallback, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Alert, Button, Input, Panel } from 'rsuite';

type Props = {
	helperMsg?: string;
	recaptchaRef?: React.RefObject<ReCAPTCHA>;
	Login?: boolean;
	SubmitFunc: (event?: React.FormEvent<HTMLFormElement>, state?:{Email:string,UserName:string,Password:string,Recaptcha:string}) => void;
	style?: React.CSSProperties;
	className?: string;
};

const AccountForm: React.FC<Props> = (props) => {
	const [state, setState] = useState({
		Email: '',
		UserName: '',
		Password: '',
		Recaptcha: '',
	});

	const handleSubmit = 
		(event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			let token = props.recaptchaRef?.current?.getValue();
			setState({...state, 'Recaptcha':token??''})
			return props.SubmitFunc(event,{...state, 'Recaptcha':token??''})
		}
	const handleChange = (value: string, event: React.SyntheticEvent<HTMLElement, Event>) => {
		let newx = {...state, [$(event.target as HTMLInputElement ).prop('id')]: $(event.target as Element ).val()  }
		setState(newx);
	}
	const handleChangeRE = (Token: string | null,) => {
		setState({...state, Recaptcha: Token ?? ''  });
	}
	const onError = () => {
		Alert.error("Could you refresh the page and attempt the recaptcha again")
	}
	return (
		<Panel bordered>
			<form
				onSubmit={handleSubmit}
				style={props.style}
				className={props.className}
			>
				<div className="form-group">
					<label htmlFor="Email">
						Email address
						{props.Login === true ? ' Or Username' : ''}
					</label>
					<Input
						className="form-control"
						type={props.Login === true ? 'text' : 'email'}
						id="Email"
						placeholder="Enter email"
						onChange={handleChange}
					/>
				</div>
				{props.Login !== true ? (
					<div className="form-group">
						<label htmlFor="UserName">Username </label>
						<Input
							className="form-control"
							type="text"
							id="UserName"
							placeholder="Enter Username"
							onChange={handleChange}
						/>
					</div>
				) : (
					''
				)}
				<div className="form-group">
					<label>Password</label>
					<Input
						className="form-control"
						type="Password"
						id="Password"
						placeholder="Enter Password"
						onChange={handleChange}
					/>
				</div>
				<div style={{justifyContent:"center",display:"flex"}} >  
					<ReCAPTCHA
						type="image"
						badge="inline"
						
						sitekey="6Lek7ccZAAAAAG5Db1MtPm5Z3woVvoO-uWdpJwIj"
						ref={props.recaptchaRef}
						theme="dark"
						size="normal"
						onErrored={onError}
						onExpired={onError}
						onChange={handleChangeRE}
					/>
				</div>
				<br />
				<Button type="submit">
					Submit
				</Button>
			</form>
		</Panel>
	);
};

export default AccountForm;
