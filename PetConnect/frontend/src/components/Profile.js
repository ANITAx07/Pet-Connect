// // // frontend/src/components/Profile.js

import React, { useEffect, useState } from 'react';
import './Profile.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faKey, faUser, faSignOutAlt, faSave, faCamera, faTrash } from '@fortawesome/free-solid-svg-icons'; // ⬅️ ADDED faTrash

export default function Profile() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    avatar: ''
  });
  const [preview, setPreview] = useState('');
  const [file, setFile] = useState(null);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`https://petconnect-backend-henx.onrender.com/api/auth/profile?userId=${userId}`);
        setUser(res.data);

        const avatarUrl = res.data.avatar
          ? `https://petconnect-backend-henx.onrender.com${res.data.avatar}`
          : localStorage.getItem('userAvatar') || '/default-avatar.png';

        setPreview(avatarUrl);
        localStorage.setItem('userAvatar', avatarUrl);
      } catch (err) {
        alert('Failed to load profile');
      }
    };

    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      const res = await axios.delete(`https://petconnect-backend-henx.onrender.com/api/auth/avatar?userId=${userId}`);
      alert(res.data.message || 'Avatar deleted');
      setPreview('/default-avatar.png');
      localStorage.setItem('userAvatar', '/default-avatar.png');
    } catch (err) {
      alert('Failed to delete avatar');
    }
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('name', user.name);
    formData.append('email', user.email);
    if (user.password) formData.append('password', user.password);
    if (file) formData.append('avatar', file);

    try {
      const res = await axios.put('https://petconnect-backend-henx.onrender.com/api/auth/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert(res.data.message || 'Profile updated');

      if (res.data.user.avatar) {
        const avatarPath = `https://petconnect-backend-henx.onrender.com${res.data.user.avatar}`;
        localStorage.setItem('userAvatar', avatarPath);
        setPreview(avatarPath);
      }
    } catch (err) {
      alert('Update failed');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="profile-container">
      <div className="profile-avatar">
        <div className="avatar-wrapper">
          <label htmlFor="avatarUpload">
            <img src={preview} alt="Avatar" />
            <span className="camera-icon">
              <FontAwesomeIcon icon={faCamera} />
            </span>
          </label>
          {user.avatar && (
          <span className="delete-icon" onClick={handleDeleteAvatar}>
            <FontAwesomeIcon icon={faTrash} />
          </span>
          )}
          <input
            type="file"
            id="avatarUpload"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
        </div>
        <h2>{user.name}</h2>
      </div>

      <div className="profile-form">
        <label><FontAwesomeIcon icon={faUser} /> Name</label>
        <input type="text" name="name" value={user.name} onChange={handleChange} />

        <label><FontAwesomeIcon icon={faEnvelope} /> Email</label>
        <input type="email" name="email" value={user.email} onChange={handleChange} />

        <label><FontAwesomeIcon icon={faKey} /> Password</label>
        <input type="password" name="password" value={user.password} onChange={handleChange} placeholder="Change password?" />

        <div className="profile-buttons">
          <button className="update-btn" onClick={handleUpdate}>
            <FontAwesomeIcon icon={faSave} /> Update
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
