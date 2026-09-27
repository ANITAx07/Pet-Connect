// frontend/src/components/ResetPassword.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await axios.post(`https://petconnect-backend-henx.onrender.com/api/auth/reset-password/${token}`, { password });
      setMessage(res.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password');
    }
  };

  return (
    <div className="reset-password-page">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <label>New Password</label>
        <input
          type="password"
          value={password}
          required
          onChange={e => setPassword(e.target.value)}
        />
        <label>Confirm New Password</label>
        <input
          type="password"
          value={confirmPassword}
          required
          onChange={e => setConfirmPassword(e.target.value)}
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
