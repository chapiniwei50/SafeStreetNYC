import React, { useState } from 'react';
import {useNavigate} from "react-router-dom"
import { NavLink } from "react-router-dom";
import './SignUp.css';
const config = require('../config.json');

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Username: ${name}, Email: ${email}, Password: ${password}`);
    fetch(`http://${config.server_host}:${config.server_port}/addUser`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({"username": name, "email": email, "password": password})
    }).then(response => response.json())
    .then(data => {
      if(data.check) {
        navigation('/housing');
      } else {
        alert('Sign Up Failed');
      }
    });
  };

  return (
    <div className="signup-container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Username:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign Up</button>
        <NavLink to={`/`}>Return to Sign In</NavLink>
      </form>
      <p>By signing up, you agree to our Terms and Privacy Policy.</p>
      <div className="fb-login">
        <i className="fab fa-facebook"></i>
        <span>Sign up with Facebook</span>
      </div>
    </div>
  );
}

export default SignUp;