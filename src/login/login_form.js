import React, {Component} from 'react';

class LoginForm extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <p>Welcome to Open Insurance. Please log in to your account with your email address and password.</p>
                <form onSubmit={(event) => {
                    this.props.onLoginSubmit();
                    event.preventDefault();
                }}>
                    <div className='form-group'>
                        <label htmlFor="email">Email address</label>
                        <input id="email" className="form-control" value="rbrooks@email.com"/>
                    </div>
                    <div className='form-group'>
                        <label htmlFor="email">Password</label>
                        <input id="password" className="form-control" type="password" value="so_secureitscrazy"/>
                    </div>
                    <button className="btn btn-primary">Log In</button>
                </form>
            </div>
        );
    }
}

export default LoginForm;