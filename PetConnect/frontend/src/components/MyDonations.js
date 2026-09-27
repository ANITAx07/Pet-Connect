import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './MyDonations.css';

const MyDonations = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('https://petconnect-backend-henx.onrender.com/api/donations/my-donations', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setDonations(response.data);
      } catch (error) {
        console.error('Error fetching donations:', error);
        setError(error.response?.data?.message || 'Failed to fetch donations');
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [navigate]);

  return (
    <div className="my-donations-container">
      <h2>My Donations</h2>
      {loading && <p>Loading donations...</p>}
      {error && <div className="error-message">{error}</div>}
      {donations.length === 0 && !loading && <p>No donations found.</p>}
      <ul className="donation-list">
        {donations.map(donation => (
          <li key={donation._id} className="donation-item">
            <h3>{donation.item}</h3>
            <p>Quantity: {donation.quantity}</p>
            <p>Category: {donation.category}</p>
            <p>Condition: {donation.condition}</p>
            <p>Status: {donation.status}</p>
            {donation.photo && <img src={`https://petconnect-backend-henx.onrender.com/uploads/${donation.photo}`} alt={donation.item} />}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyDonations;
