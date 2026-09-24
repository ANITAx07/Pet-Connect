// frontend/src/components/AdminAdoptionRequests.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminAdoptionRequests.css';

export default function AdminAdoptionRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/adoptions/admin/adoption-requests');
      setRequests(res.data);
    } catch (err) {
      console.error('Error fetching adoption requests:', err); // Log error to debug
      alert('❌ Failed to fetch requests');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      console.log('Updating status for adoption request with ID:', id); // Debug log
      await axios.put(`http://localhost:5000/api/adoptions/admin/adoption-requests/${id}/status`, {

        status: newStatus,
      });

      fetchRequests();  // Reload the adoption requests after status change
      alert(`✅ Request ${newStatus}`);
    } catch (err) {
      alert(`❌ ${err.response?.data?.error || 'Failed to update status'}`);
      console.error('Error updating status:', err); // Log error to debug
    }
  };



  return (
    <div className="admin-requests-container">
      <h2>📋 Adoption Requests</h2>
      {requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <table className="request-table">
          <thead>
            <tr>
              <th>Pet</th>
              <th>Adopter</th>
              <th>Phone</th>
              <th>Delivery</th>
              <th>Status</th>
              <th>Fees</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id}>
                <td>
                  <img src={`http://localhost:5000${req.petId?.image}`} alt="pet" width="60" />
                  <div>{req.petId?.name}</div>
                </td>
                <td>
                  <div>{req.name}</div>
                  <small>{req.address}</small>
                </td>
                <td>{req.phone}</td>
                <td>{req.deliveryRequested ? 'Yes' : 'No'}</td>
                <td>{req.status}</td>
                <td>
                  {req.platformFeePaid ? '✅ Platform' : '❌'} <br />
                  {req.deliveryFeePaid ? '✅ Delivery' : '❌'}
                </td>
                <td>
                  {req.status === 'pending' ? (
                    <>
                      <button className="approve" onClick={() => handleStatusChange(req._id, 'approved')}>Approve</button>
                      <button className="reject" onClick={() => handleStatusChange(req._id, 'rejected')}>Reject</button>
                    </>
                  ) : (
                    <span>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
