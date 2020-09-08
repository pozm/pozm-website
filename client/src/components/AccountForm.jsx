import React from "react";
import ReCAPTCHA from "react-google-recaptcha";
class AccountForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {Email:'',UserName:'',Password:'',Recaptcha:''};
        this.helperMsg    = React.createRef();
        this.recaptchaRef = this.props.recaptchaRef ?? React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    async handleSubmit(event) {
        event.preventDefault()
        let token = this.recaptchaRef.current.getValue()
        return this.setState({'Recaptcha':token},()=>this.props?.SubmitFunc(event,this.state))
    }
    handleChange(event) {
        this.setState({[event.target.id]: event.target.value  });
    }
    
    onError() {
        this.helperMsg.current.value = 'Could you refresh the page and attempt the recaptcha again'
    }
    

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="Email">Email address {this.props.Login ==='true' ? 'Or Username' : ''} </label>
                    <input className="form-control" type={this.props.Login ==='true' ? 'text':'email'} id="Email" placeholder="Enter email" onChange={this.handleChange} />
                </div>
                { this.props.Login !=="true"? 
                    <div className="form-group">
                        <label htmlFor="UserName">Username </label>
                        <input className="form-control" type="text" id="UserName" placeholder="Enter Username" onChange={this.handleChange} />
                    </div>
                 : ''}
                <div className="form-group">
                    <label password="UserName">Password</label>
                    <input className="form-control" type="Password" id="Password" placeholder="Enter Password" onChange={this.handleChange} />
                </div>
                 <ReCAPTCHA sitekey="6Lek7ccZAAAAAG5Db1MtPm5Z3woVvoO-uWdpJwIj" ref={this.recaptchaRef} theme="dark" size="normal" id ="Recaptcha" onErrored={this.onError} onExpired={this.onError} onChange={this.handleChange}/> 
                <br/>
                <div className='alert alert-danger' role="alert" ref={this.props.helperMsgRef} hidden/>
                <button className="btn btn-primary" type="submit">Submit</button>
            </form>
        )
    }
}

export default AccountForm