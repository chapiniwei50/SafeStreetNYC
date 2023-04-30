import React, { useState , Component } from 'react';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import { NavLink } from "react-router-dom";
import {useNavigate} from "react-router-dom"
import './Login.css';


const config = require('../config.json');

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigate()

  const responseFacebook = (response) => {
    fetch(`http://${config.server_host}:${config.server_port}/externalAuthenticator`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({"email": response.email, "username": response.userID, "password": response.accessToken})
    }).then(response => response.json())
    .then(data =>{
      if(data.check) {
        navigation('/housing')
      } else {
        alert('Login Failed');
      }
    })
  };

  const responseGoogle = (response) => {
    console.log(response);
    if(response.error == "popup_closed_by_user") {
      navigation('/housing')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://${config.server_host}:${config.server_port}/authenticator`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({"email": email, "password": password}) // body data type must match "Content-Type" header
    }).then(response => response.json())
    .then(data =>{
      if(data.check) {
        navigation('/housing')
      } else {
        alert('Login Failed');
      }
    })
  };

  return (
    
    <div className="login-container">
      <div className="login-form">
        <h1>Log in</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <button type="submit">Log In</button>
          <NavLink to={`/renderSignup`}>Create An Account</NavLink>
        </form>
        <FacebookLogin
            appId=""
            fields="name,email,picture"
            callback={responseFacebook}
          />
          <br />
          <br />

          <GoogleLogin
            clientId=""
            buttonText="LOGIN WITH GOOGLE"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
      />

      </div>
    </div>
    
  );
}

export default Login;