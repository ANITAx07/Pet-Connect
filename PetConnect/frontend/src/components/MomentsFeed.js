// //MomentsFeed.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Post from './Post';
import './MomentsFeed.css';

const MomentsFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://petconnect-backend-henx.onrender.com/api/posts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch posts', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) return <div className="loading-text">Loading pet moments...</div>;

  return (
    <div className="moments-feed-container">
      <h2>🐾 Pet Moments</h2>
      {posts.length === 0 ? (
        <p className="no-posts">No moments posted yet. Be the first to share!</p>
      ) : (
        posts.map(post => (
          <div className="moment-card" key={post._id}>
            <Post post={post} refreshPosts={fetchPosts} />
          </div>
        ))
      )}
    </div>
  );
};

export default MomentsFeed;

