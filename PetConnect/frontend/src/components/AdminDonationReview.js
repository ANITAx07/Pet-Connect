// AdminDonationReview.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDonationReview.css';

const AdminDonationReview = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://petconnect-backend-henx.onrender.com/api/donations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setDonations(response.data);
    } catch (error) {
      console.error('Error fetching donations:', error);
      if (error.response?.status === 403) {
        setError('Access denied. Admins only.');
      } else {
        setError(error.response?.data?.message || 'Failed to fetch donations');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (donationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://petconnect-backend-henx.onrender.com/api/donations/${donationId}/approve`, 
        { adminNotes },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      alert('Donation approved successfully!');
      fetchDonations();
      setSelectedDonation(null);
      setAdminNotes('');
    } catch (error) {
      console.error('Error approving donation:', error);
      alert('Failed to approve donation');
    }
  };

  const handleReject = async (donationId) => {
    if (!adminNotes.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://petconnect-backend-henx.onrender.com/api/donations/${donationId}/reject`, 
        { adminNotes },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      alert('Donation rejected successfully!');
      fetchDonations();
      setSelectedDonation(null);
      setAdminNotes('');
    } catch (error) {
      console.error('Error rejecting donation:', error);
      alert('Failed to reject donation');
    }
  };

  const handleComplete = async (donationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://petconnect-backend-henx.onrender.com/api/donations/${donationId}/complete`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      alert('Donation marked as completed!');
      fetchDonations();
    } catch (error) {
      console.error('Error completing donation:', error);
      alert('Failed to complete donation');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'approved': return '#28a745';
      case 'rejected': return '#dc3545';
      case 'completed': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  return (
    <div className="admin-donation-review">
      <h2>Review Donations</h2>
      {loading && <p>Loading donations...</p>}
      {error && <div className="error-message">{error}</div>}
      
      <div className="donations-grid">
        {donations.map(donation => (
          <div key={donation._id} className="donation-card">
            <div className="donation-header">
              <h3>{donation.item}</h3>
              <span 
                className="status-badge" 
                style={{ backgroundColor: getStatusColor(donation.status) }}
              >
                {donation.status.toUpperCase()}
              </span>
            </div>
            
            <div className="donation-details">
              <p><strong>Donor:</strong> {donation.donor.name}</p>
              <p><strong>Email:</strong> {donation.donor.email}</p>
              <p><strong>Phone:</strong> {donation.donor.phone || 'N/A'}</p>
              <p><strong>Category:</strong> {donation.category}</p>
              <p><strong>Quantity:</strong> {donation.quantity}</p>
              <p><strong>Condition:</strong> {donation.condition}</p>
              <p><strong>Pickup Method:</strong> {donation.pickupMethod}</p>
              {donation.pickupAddress && <p><strong>Address:</strong> {donation.pickupAddress}</p>}
              {donation.meetupLocation && <p><strong>Location:</strong> {donation.meetupLocation}</p>}
              {donation.notes && <p><strong>Notes:</strong> {donation.notes}</p>}
              {donation.adminNotes && <p><strong>Admin Notes:</strong> {donation.adminNotes}</p>}
            </div>

            {donation.photo && (
              <img 
                src={`https://petconnect-backend-henx.onrender.com/uploads/${donation.photo}`} 
                alt={donation.item} 
                className="donation-image"
              />
            )}

            <div className="donation-actions">
              {donation.status === 'pending' && (
                <>
                  <button 
                    className="btn-approve"
                    onClick={() => setSelectedDonation(donation._id)}
                  >
                    Approve
                  </button>
                  <button 
                    className="btn-reject"
                    onClick={() => setSelectedDonation(donation._id)}
                  >
                    Reject
                  </button>
                </>
              )}
              {donation.status === 'approved' && (
                <button 
                  className="btn-complete"
                  onClick={() => handleComplete(donation._id)}
                >
                  Mark as Completed
                </button>
              )}
            </div>

            {selectedDonation === donation._id && (
              <div className="review-modal">
                <h4>Review Donation</h4>
                <textarea
                  placeholder="Add admin notes (required for rejection)"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows="3"
                />
                <div className="modal-actions">
                  <button 
                    className="btn-approve"
                    onClick={() => handleApprove(donation._id)}
                  >
                    Confirm Approve
                  </button>
                  <button 
                    className="btn-reject"
                    onClick={() => handleReject(donation._id)}
                  >
                    Confirm Reject
                  </button>
                  <button 
                    className="btn-cancel"
                    onClick={() => {
                      setSelectedDonation(null);
                      setAdminNotes('');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDonationReview;
