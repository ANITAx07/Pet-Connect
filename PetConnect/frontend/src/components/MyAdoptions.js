import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import './MyAdoptions.css';

export default function MyAdoptions() {
  const [requests, setRequests] = useState([]);
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName') || 'Adopter'; // Assuming userName stored in localStorage

  useEffect(() => {
    if (userId) fetchRequests();
  }, [userId]);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`https://petconnect-backend-henx.onrender.com/api/adoptions/my-requests/${userId}`);
      setRequests(res.data);
    } catch (err) {
      alert('Failed to load adoption requests');
    }
  };

  const handlePayment = async (requestId, deliveryRequested) => {
    const confirm = window.confirm("Confirm payment?");
    if (!confirm) return;

    try {
      await axios.put(`https://petconnect-backend-henx.onrender.com/api/adoptions/pay/${requestId}`, {
        platformFeePaid: true,
        deliveryFeePaid: deliveryRequested
      });

      alert("Payment successful!");
      fetchRequests(); // Refresh list
    } catch (err) {
      alert("Payment failed.");
    }
  };

  const generateCertificate = (request) => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a4'
    });

    // Background color
    doc.setFillColor(255, 245, 235);
    doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');

    // Title
    doc.setFontSize(24);
    doc.setTextColor('#d2691e');
    doc.text('CERTIFICATE OF ADOPTION', doc.internal.pageSize.width / 2, 60, { align: 'center' });

    // Website name at top center
    doc.setFontSize(24);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor('#d2691e');
    doc.text('PetConnect', doc.internal.pageSize.width / 2, 30, { align: 'center' });

    // Pet name
    doc.setFontSize(22);
    doc.setTextColor('#000');
    doc.text(`This certifies that`, doc.internal.pageSize.width / 2, 140, { align: 'center' });

    doc.setFontSize(26);
    doc.setTextColor('#b22222');
    doc.text(request.petId?.name || 'Pet Name', doc.internal.pageSize.width / 2, 180, { align: 'center' });

    // Adopter name
    doc.setFontSize(22);
    doc.setTextColor('#000');
    doc.text(`has officially been adopted by`, doc.internal.pageSize.width / 2, 220, { align: 'center' });

    doc.setFontSize(26);
    doc.setTextColor('#b22222');
    doc.text(userName, doc.internal.pageSize.width / 2, 260, { align: 'center' });

    // Adoption date - use current date as fallback
    const adoptionDate = new Date().toLocaleDateString();
    doc.setFontSize(18);
    doc.setTextColor('#000');
    doc.text(`on this day: ${adoptionDate}`, doc.internal.pageSize.width / 2, 300, { align: 'center' });

    // Promise statement
    doc.setFontSize(16);
    doc.setTextColor('#555');
    doc.text('I PROMISE TO LOVE & CARE FOR YOU, ALWAYS.', doc.internal.pageSize.width / 2, 360, { align: 'center' });


    // Save PDF
    doc.save(`Adoption_Certificate_${request.petId?.name || 'Pet'}.pdf`);
  };

  return (
    <div className="my-adoptions">
      <h2>My Adoption Requests</h2>

      {requests.length === 0 ? (
        <p>You haven’t submitted any requests yet.</p>
      ) : (
        <div className="adoption-list">
          {requests.map((req) => (
            <div className="adoption-card" key={req._id}>
              <img src={`https://petconnect-backend-henx.onrender.com${req.petId?.image}`} alt={req.petId?.name} />
              <h3>{req.petId?.name}</h3>
              <p><strong>Breed:</strong> {req.petId?.breed}</p>
              <p><strong>Age:</strong> {req.petId?.age}</p>
              <p><strong>Status:</strong> {req.status}</p>
              <p><strong>Platform Fee:</strong> ৳200</p>
              {req.deliveryRequested && <p><strong>Delivery Fee:</strong> ৳300</p>}

              {req.status === 'approved' && !req.platformFeePaid && (
                <button
                  className="pay-btn"
                  onClick={() => handlePayment(req._id, req.deliveryRequested)}
                >
                  Pay Now
                </button>
              )}

              {req.platformFeePaid && (
                <>
                  <p className="paid-label">Payment Complete ✅</p>
                  <button
                    className="download-btn"
                    onClick={() => generateCertificate(req)}
                  >
                    Download Certificate
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
