// // HomePage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dogImage from '../images/dog-home.jpg';
import './HomePage.css';
import axios from 'axios';

function HomePage() {
  const [showPostForm, setShowPostForm] = useState(false);
  const [content, setContent] = useState('');
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePhotoChange = (e) => setPhoto(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content && !photo) return alert('Please enter content or select a photo.');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('content', content);
      if (photo) formData.append('photo', photo);

      const token = localStorage.getItem('token');
      if (!token) {
        alert('Login to post a moment.');
        setLoading(false);
        return;
      }

      await axios.post('https://petconnect-backend-henx.onrender.com/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setContent('');
      setPhoto(null);
      setShowPostForm(false);
      navigate('/moments');
    } catch (error) {
      console.error('Post failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="homepage">
      <main className="main-layout">
        <section className="hero-left">
          <h1>Find Your <br /><span className="highlight">Perfect Friend</span></h1>
          <p className="bio-text">
            🐾 Connecting kind hearts with paws in need — PetConnect helps you adopt, donate, and make a difference.
          </p>
          <div className="hero-buttons">
            <button className="adopt-btn">Donate Now</button>
            <button className="learn-btn" onClick={() => setShowPostForm(true)}>Post Moments ❤️</button>
          </div>

          {showPostForm && (
            <div className="modal-overlay" onClick={() => setShowPostForm(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                  <textarea
                    placeholder="Share your pet moment..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                  />
                  <input type="file" accept="image/*" onChange={handlePhotoChange} />
                  <div className="modal-actions">
                    <button type="submit" disabled={loading} className="submit-btn">
                      {loading ? 'Posting...' : 'Post'}
                    </button>
                    <button type="button" onClick={() => setShowPostForm(false)} className="cancel-btn">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </section>

        <section className="hero-right">
          <img src={dogImage} alt="dog" className="hero-img" />
        </section>
      </main>

      {/* Feature Cards Section */}
      <section className="features-section">
        <h2>Why PetConnect?</h2>
        <div className="feature-cards">
          <div className="card">
            <h3>🐾 Easy Adoption</h3>
            <p>Browse and connect with pets waiting for a forever home.</p>
          </div>
          <div className="card">
            <h3>💝 Donation Support</h3>
            <p>Contribute items or funds to help animals in need.</p>
          </div>
          <div className="card">
            <h3>📸 Share Moments</h3>
            <p>Post stories and pictures of your furry friends.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;

