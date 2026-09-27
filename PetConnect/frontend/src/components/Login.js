// // frontend/src/components/Login.js
// frontend/src/components/Login.js
import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('https://petconnect-backend-henx.onrender.com/api/auth/login', {
        email,
        password
      });

      const { message, user, token } = res.data;

      if (!user || !user.role) {
        alert('Login failed: No role found.');
        return;
      }

      // Store token and user info
      if (token) localStorage.setItem('token', token);
      localStorage.setItem('userId', user.userId);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userName', user.name);
      if (user.avatar) {
        localStorage.setItem('userAvatar', `https://petconnect-backend-henx.onrender.com${user.avatar}`);
      }

      alert(`${message} (Role: ${user.role})`);
      window.location.href = user.role === 'admin' ? '/dashboard' : '/profile';
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-icon">🐾</div>
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Let's fetch some joy again!</p>

        <label>Email</label>
        <input
          type="email"
          value={email}
          required
          onChange={e => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          required
          onChange={e => setPassword(e.target.value)}
        />

        <div className="forgot-password-link">
          <a href="/forgot-password">Forgot Password?</a>
        </div>

        <button type="submit">Login</button>

        <div className="login-link">
          Don’t have an account? <a href="/signup">Sign up</a>
        </div>
      </form>
    </div>
  );
}
