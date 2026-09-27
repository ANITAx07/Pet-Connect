// PetConnect/frontend/src/components/DonateItem.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './DonateItem.css';

const DonateItem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    item: '',
    quantity: '',
    category: '',
    condition: '',
    pickupMethod: '',
    pickupAddress: '',
    meetupLocation: '',
    notes: ''
  });
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    { value: 'food', label: 'Food' },
    { value: 'toy', label: 'Toy' },
    { value: 'medicine', label: 'Medicine' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'bedding', label: 'Bedding' },
    { value: 'other', label: 'Other' }
  ];

  const conditions = [
    { value: 'new', label: 'New' },
    { value: 'used', label: 'Used' }
  ];

  const pickupMethods = [
    { value: 'pickup', label: 'Pickup from my location' },
    { value: 'drop-off', label: 'I will drop off' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (photo) data.append('photo', photo);

      await axios.post('https://petconnect-backend-henx.onrender.com/api/donations', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      alert('Donation request submitted successfully!');
      navigate('/my-donations');
    } catch (error) {
      console.error('Error submitting donation:', error);
      setError(error.response?.data?.message || 'Failed to submit donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="donate-page-background">
      <div className="donate-item-container">
        <div className="donate-item-form">
          <h2>🐾 Donate an Item</h2>
          <p>Help pets in need by donating items like food, toys, or medicine.</p>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="item">Item Name *</label>
              <input
                type="text"
                id="item"
                name="item"
                value={formData.item}
                onChange={handleChange}
                required
                placeholder="e.g., Dog Food, Cat Toy, Medicine"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select id="category" name="category" value={formData.category} onChange={handleChange} required>
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity *</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="1"
                placeholder="e.g., 5"
              />
            </div>

            <div className="form-group">
              <label htmlFor="condition">Condition *</label>
              <select id="condition" name="condition" value={formData.condition} onChange={handleChange} required>
                <option value="">Select condition</option>
                {conditions.map(cond => (
                  <option key={cond.value} value={cond.value}>{cond.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="photo">Photo (Optional)</label>
              <input type="file" id="photo" name="photo" accept="image/*" onChange={handleFileChange} />
            </div>

            <div className="form-group">
              <label htmlFor="pickupMethod">Pickup/Drop-off Method *</label>
              <select id="pickupMethod" name="pickupMethod" value={formData.pickupMethod} onChange={handleChange} required>
                <option value="">Select method</option>
                {pickupMethods.map(method => (
                  <option key={method.value} value={method.value}>{method.label}</option>
                ))}
              </select>
            </div>

            {formData.pickupMethod === 'pickup' && (
              <div className="form-group">
                <label htmlFor="pickupAddress">Pickup Address *</label>
                <input
                  type="text"
                  id="pickupAddress"
                  name="pickupAddress"
                  value={formData.pickupAddress}
                  onChange={handleChange}
                  required
                  placeholder="Enter your address for pickup"
                />
              </div>
            )}

            {formData.pickupMethod === 'drop-off' && (
              <div className="form-group">
                <label htmlFor="meetupLocation">Drop-off Location *</label>
                <input
                  type="text"
                  id="meetupLocation"
                  name="meetupLocation"
                  value={formData.meetupLocation}
                  onChange={handleChange}
                  required
                  placeholder="Enter drop-off location"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="notes">Additional Notes (Optional)</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                placeholder="e.g., For small breed dogs, expiration date, etc."
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Donation'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DonateItem;


