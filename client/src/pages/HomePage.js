import React, { useState } from 'react';
import './Login.css';
const config = require('../config.json');

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault()
    fetch(`http://${config.server_host}:${config.server_port}/authenticator`, {
      method: 'POST', 
      mode: 'cors', 
      body: JSON.stringify(email)})
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Log in</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email or Phone</label>
          <input type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <button type="submit">Log In</button>
          <a href="#">Forgot Password?</a>
        </form>
      </div>
    </div>
  );
}

export default Login;