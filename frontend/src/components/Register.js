import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');



  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a request to the backend API
      const response = await axios.post('/register', { email, password });

      // Display the response message
      setMessage(response.data.message);
    } catch (error) {
      // Display the error message
      setMessage(error.response.data.message);
    }
  };


  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleFormSubmit}>
        <label>Email:</label>
        <input type="email" value={email} onChange={handleEmailChange} required />
        <label>Password:</label>
        <input type="password" value={password} onChange={handlePasswordChange} required />
        <button type="submit" > Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;