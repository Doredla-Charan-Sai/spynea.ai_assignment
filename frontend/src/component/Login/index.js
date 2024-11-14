import { Component } from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './index.css';

class Login extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    errorMsg: '',
    isSignup: false,
  };

  // API call for login
  getAPICall = async () => {
    const { username, password } = this.state;
    const userDetails = { username, password };
    const apiUrl = 'https://spynea-ai-assignment-2.onrender.com/api/auth/login';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(userDetails),
    };
    const response = await fetch(apiUrl, options);
    if (response.ok === true) {
      const data = await response.json();
      const { token } = data;
      Cookies.set('jwt_token', token, { expires: 30, path: '/' });
      this.props.navigate('/');
    } else {
      const errorData = await response.json();
      this.setState({ errorMsg: errorData.message });
    }
  };

  // API call for signup
  signUpAPICall = async () => {
    const { username, email, password } = this.state;
    const userDetails = { username, email, password };
    const apiUrl = 'https://spynea-ai-assignment-2.onrender.com/api/auth/register';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(userDetails),
    };
    const response = await fetch(apiUrl, options);
    const data = await response.text();
    if (response.ok === true) {
      this.setState({ errorMsg: '', isSignup: false });
      alert("Signup successful! Please login.");
    } else {
      this.setState({ errorMsg: data });
    }
  };

  onUsername = (event) => this.setState({ username: event.target.value });
  onEmail = (event) => this.setState({ email: event.target.value });
  onPassword = (event) => this.setState({ password: event.target.value });

  toggleSignup = () => this.setState((prevState) => ({ isSignup: !prevState.isSignup, errorMsg: '' }));

  validateFields = () => {
    const { username, email, password, isSignup } = this.state;
    if (!username || username.length < 4) {
      this.setState({ errorMsg: 'Username must be at least 4 characters' });
      return false;
    }
    if (isSignup && (!email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email))) {
      this.setState({ errorMsg: 'Please enter a valid email' });
      return false;
    }
    if (!password || password.length < 6) {
      this.setState({ errorMsg: 'Password must be at least 6 characters' });
      return false;
    }
    return true;
  };

  submitForm = (event) => {
    event.preventDefault();
    if (this.validateFields()) {
      if (this.state.isSignup) {
        this.signUpAPICall();
      } else {
        this.getAPICall();
      }
    }
  };

  render() {
    const { username, email, password, errorMsg, isSignup } = this.state;
    const token = Cookies.get('jwt_token');
    if (token !== undefined) {
      return <Navigate to="/" replace />;
    }
    return (
      <div className="login-bg-cont">
        <div className="jobby-form-card">
          <form className="form-cont" onSubmit={this.submitForm}>
            <label htmlFor="username" className="label">
              USERNAME
            </label>
            <input
              id="username"
              value={username}
              placeholder="Username"
              className="input"
              type="text"
              onChange={this.onUsername}
              required
            />
            {isSignup && (
              <>
                <label htmlFor="email" className="label">
                  EMAIL
                </label>
                <input
                  id="email"
                  value={email}
                  placeholder="Email"
                  className="input"
                  type="email"
                  onChange={this.onEmail}
                  required
                />
              </>
            )}
            <label htmlFor="password" className="label">
              PASSWORD
            </label>
            <input
              id="password"
              value={password}
              placeholder="Password"
              className="input"
              type="password"
              onChange={this.onPassword}
              required
            />
            <button type="submit" className="login-btn">
              {isSignup ? 'Signup' : 'Login'}
            </button>
            {errorMsg && <p className="error">{errorMsg}</p>}
          </form>
          <button onClick={this.toggleSignup} className="toggle-btn">
            {isSignup ? 'Already have an account? Login' : "Don't have an account? Signup"}
          </button>
        </div>
      </div>
    );
  }
}

export default Login;
