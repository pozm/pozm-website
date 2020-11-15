import React, {useState} from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import {
    Alert,
    Button,
    ButtonToolbar,
    ControlLabel,
    Form,
    FormControl,
    FormGroup,
    HelpBlock,
    Panel,
    Schema
} from 'rsuite';

const {StringType} = Schema.Types;

type Props = {
    helperMsg?: string;
    recaptchaRef?: React.RefObject<ReCAPTCHA>;
    Login?: boolean;
    SubmitFunc: (event?: React.SyntheticEvent<Element, Event>, state?: {
        formValue: {
            Email: string;
            UserName: string;
            Password: string;
        };
        Recaptcha: string;
    }) => void;
    style?: React.CSSProperties;
    className?: string;
};

const Loginmodel = Schema.Model({
    email: StringType()
        .isRequired('This field is required.'),
    password: StringType()
        .minLength(8, "passwords must be longer than 8 chars")
        .maxLength(132, "passwords must be shorter than 132 chars")
});
const Signupmodel = Schema.Model({
    email: StringType()
        .isEmail('Please enter a valid email address.')
        .isRequired('This field is required.'),
    name: StringType()
        .isRequired('This field is required.')
        .maxLength(30, "usernames cannot be longer than 30 chars"),
    password: StringType()
        .minLength(8, "passwords must be longer than 8 chars")
        .maxLength(132, "passwords must be shorter than 132 chars")
});

const AccountForm: React.FC<Props> = (props) => {
    const [state, setState] = useState({
        formValue: {
            Email: '',
            UserName: '',
            Password: '',
        },
        Recaptcha: '',
    });

    const handleSubmit =
        (event: React.SyntheticEvent<Element, Event>) => {
            event.preventDefault();
            let token = props.recaptchaRef?.current?.getValue();
            setState({...state, 'Recaptcha': token ?? ''})
            return props.SubmitFunc(event, {...state, 'Recaptcha': token ?? ''})
        }
    const handleChangeRE = (Token: string | null,) => {
        setState({...state, Recaptcha: Token ?? ''});
    }
    const onError = () => {
        Alert.error("Could you refresh the page and attempt the recaptcha again")
    }
    return (
        <Panel bordered>
            <Form fluid onChange={(formValue: any) => {
                setState({...state, formValue});
            }} formValue={state.formValue} model={props.Login ? Loginmodel : Signupmodel}>
                {!props.Login && (
                    <FormGroup>
                        <ControlLabel>Username</ControlLabel>
                        <FormControl name="UserName"/>
                        <HelpBlock>Required</HelpBlock>
                    </FormGroup>
                )}
                <FormGroup>
                    <ControlLabel>Email {props.Login && "or Username"} </ControlLabel>
                    <FormControl name="Email" type={!props.Login ? "email" : "text"}/>
                    <HelpBlock>Required</HelpBlock>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Password</ControlLabel>
                    <FormControl name="Password" type="password"/>
                    <HelpBlock>Required</HelpBlock>
                </FormGroup>
                <FormGroup style={{display:"flex",justifyContent:"center"}}>
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
                </FormGroup>
                <FormGroup>
                    <ButtonToolbar>
                        <Button onClick={handleSubmit} appearance="primary">Submit</Button>
                    </ButtonToolbar>
                </FormGroup>
            </Form>
        </Panel>
    );
};

export default AccountForm;
