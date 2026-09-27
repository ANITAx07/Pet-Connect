// frontend/src/components/AdminAdoptionHistory.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminAdoptionHistory.css';

export default function AdminAdoptionHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);  // Track loading state

  useEffect(() => {
    fetchCompletedAdoptions();
  }, []);

  const fetchCompletedAdoptions = async () => {
    try {
      const res = await axios.get('https://petconnect-backend-henx.onrender.com/api/adoptions/admin/adoption-history');
      setHistory(res.data);
      setLoading(false);  // Set loading to false after data is fetched
    } catch (err) {
      setLoading(false);
      console.error('Error fetching adoption history:', err);  // Log error to debug
      alert('❌ Failed to fetch adoption history. Please try again later.');
    }
  };

  return (
    <div className="admin-history">
      <h2>Completed Adoptions</h2>
      {loading ? (
        <p>Loading...</p>  // Show loading message while data is being fetched
      ) : history.length === 0 ? (
        <p>No completed adoptions found.</p>
      ) : (
        <div className="history-list">
          {history.map((item) => (
            <div key={item._id} className="history-card">
              {/* Check if pet image exists, otherwise show a default image */}
              <img
                src={item.petId?.image ? `https://petconnect-backend-henx.onrender.com${item.petId.image}` : '/default-pet.jpg'}
                alt={item.petId?.name || 'Pet'}
              />
              <div className="info">
                <h3>{item.petId?.name}</h3>
                <p><strong>Breed:</strong> {item.petId?.breed}</p>
                <p><strong>Age:</strong> {item.petId?.age}</p>
                <p><strong>User:</strong> {item.userId?.name}</p>
                <p><strong>Phone:</strong> {item.phone}</p>
                <p><strong>Paid:</strong> ৳{item.deliveryFeePaid ? 500 : 200}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
