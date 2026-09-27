import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Post from './Post';
import './MomentsFeed.css';

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://petconnect-backend-henx.onrender.com/api/posts/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch user posts', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, []);

  if (loading) return <div>Loading your posts...</div>;

  return (
    <div className="moments-feed-container">
      <h2>My Posts</h2>
      {posts.length === 0 ? (
        <p>You have not posted any moments yet.</p>
      ) : (
        posts.map(post => (
          <Post key={post._id} post={post} refreshPosts={fetchUserPosts} />
        ))
      )}
    </div>
  );
};

export default MyPosts;
