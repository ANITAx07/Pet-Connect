import React, { useState } from 'react';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await axios.post('https://petconnect-backend-henx.onrender.com/api/auth/forgot-password', { email, captcha, newPassword });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password');
    }
  };

  return (
    <div className="forgot-password-page">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          required
          onChange={e => setEmail(e.target.value)}
        />
        <label>Captcha (enter 1234)</label>
        <input
          type="text"
          value={captcha}
          required
          onChange={e => setCaptcha(e.target.value)}
        />
        <label>New Password</label>
        <input
          type="password"
          value={newPassword}
          required
          onChange={e => setNewPassword(e.target.value)}
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
