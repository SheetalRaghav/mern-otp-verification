import React, { useState } from 'react';

function Verification() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setMessage('Internal server error');
    }
  };

  return (
    <div>
      <h1>OTP Verification</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={handleEmailChange} />
        </div>
        <div>
          <label>OTP:</label>
          <input type="text" value={otp} onChange={handleOtpChange} />
        </div>
        <button type="submit">Verify OTP</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default Verification;
