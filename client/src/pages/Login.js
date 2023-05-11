import React, { useState, Component } from 'react';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom"
import { ReactSession } from 'react-client-session';

import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigate();



  const responseFacebook = (response) => {
    fetch(`http://${process.env.process.env.REACT_APP_SERVER_HOST}:${process.env.process.env.REACT_APP_SERVER_PORT}/externalAuthenticator`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ "email": response.email, "username": response.userID, "password": response.accessToken })
    }).then(response => response.json())
      .then(data => {
        if (data.check) {
          ReactSession.setStoreType('localStorage');
          ReactSession.set('user', { name: data.name });
          console.log(ReactSession.get('user'));
          navigation('/intro')
        } else {
          alert('Login Failed');
        }
      })
  };

  const responseGoogle = (response) => {
    if (response.error == "popup_closed_by_user") {
      fetch(`http://${process.env.process.env.REACT_APP_SERVER_HOST}:${process.env.process.env.REACT_APP_SERVER_PORT}/verify`)
        .then(response => response.json())
        .then(data => {
          if (data.check) {
            ReactSession.setStoreType('localStorage');
            ReactSession.set('user', { name: data.name });
            navigation('/intro')
          } else {
            alert('Login Failed');
          }
        })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://${process.env.process.env.REACT_APP_SERVER_HOST}:${process.env.process.env.REACT_APP_SERVER_PORT}/authenticator`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ "email": email, "password": password }) // body data type must match "Content-Type" header
    }).then(response => response.json())
      .then(data => {
        if (data.check) {
          ReactSession.setStoreType('localStorage');
          ReactSession.set('user', { name: data.name });
          console.log(ReactSession.get('user'));
          navigation('/intro')
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
        <div className="facebook-login">
          <FacebookLogin
            appId={`${process.env.REACT_APP_FACEBOOK}`}
            fields="name,email,picture"
            callback={responseFacebook}
          />
        </div>

        <div className="google-login">

          <GoogleLogin
            clientId={`${process.env.REACT_APP_GOOGLE}`}
            buttonText="LOGIN WITH GOOGLE"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
          />
        </div>
        <h6>© 2023 Nathan Chen, Abhinav Gopinath, Jiwoong Matt Park, Cindy Wei</h6>
      </div>



    </div>



  );

}

export default Login;