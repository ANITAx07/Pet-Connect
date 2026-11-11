import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Post from './Post';
import './MomentsFeed.css';

const API = 'https://petconnect-backend-henx.onrender.com';

const MomentsFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [photo, setPhoto] = useState(null);
  const [fileKey, setFileKey] = useState(0);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API}/api/posts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch posts', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !photo) {
      setError('Write something or add a photo first.');
      return;
    }
    setPosting(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('content', content);
      if (photo) formData.append('photo', photo);

      await axios.post(`${API}/api/posts`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setContent('');
      setPhoto(null);
      setFileKey((k) => k + 1); // clears the file picker
      await fetchPosts();
    } catch (err) {
      console.error('Failed to create post', err);
      setError('Could not post. Please try again.');
    }
    setPosting(false);
  };

  if (loading) return <div className="loading-text">Loading pet moments...</div>;

  return (
    <div className="moments-feed-container">
      <h2>🐾 Pet Moments</h2>

      {token ? (
        <form className="create-moment" onSubmit={handleSubmit}>
          <textarea
            placeholder="Share a moment with your pet..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
          />
          <div className="create-moment-row">
            <input
              key={fileKey}
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={(e) => setPhoto(e.target.files[0] || null)}
            />
            <button type="submit" disabled={posting}>
              {posting ? 'Posting...' : 'Post'}
            </button>
          </div>
          {error && <p className="create-moment-error">{error}</p>}
        </form>
      ) : (
        <p className="no-posts">Log in to share a moment.</p>
      )}

      {posts.length === 0 ? (
        <p className="no-posts">No moments posted yet. Be the first to share!</p>
      ) : (
        posts.map((post) => (
          <div className="moment-card" key={post._id}>
            <Post post={post} refreshPosts={fetchPosts} />
          </div>
        ))
      )}
    </div>
  );
};

export default MomentsFeed;