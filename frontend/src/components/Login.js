import React, { useState } from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleLogin=()=>{
    window.alert("Login successful});")
 
 
   }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send the login request to the backend
    // You can use the Fetch API or Axios library for this

    // Example using Fetch API
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the backend
        if (data.message === 'Login successful') {
          // Redirect or show success message
        } else if (data.message === 'Invalid email or password. OTP sent to your email.') {
          // Show error message or OTP input field
        } else {
          // Show error message
        }
      })
      .catch((error) => {
        // Handle error
        console.error('Error logging in:', error);
      });
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" onClick={handleLogin}>Login</button>
      <Link to="/forgot-password">
        <div>
          ForgetPassword

        </div>
      </Link>

      </form>
    </div>
  );
}

export default Login;
