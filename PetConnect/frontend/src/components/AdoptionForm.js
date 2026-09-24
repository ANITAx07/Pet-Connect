// AdoptionForm.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdoptionForm.css';

export default function AdoptionForm() {
  const { petId } = useParams();
  const navigate = useNavigate();

  const [pet, setPet] = useState(null);
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
    hadPetBefore: '',
    carePlan: '',
    estimatedCost: '',
    deliveryRequested: false,
  });

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/pets');
        const matched = res.data.find(p => p._id === petId);
        if (matched) setPet(matched);
        else alert('Pet not found!');
      } catch (err) {
        alert('Failed to fetch pet');
      }
    };
    fetchPet();
  }, [petId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) return alert('Please login to submit a request.');

    try {
      const res = await axios.post('http://localhost:5000/api/adoptions/request', {
        userId,
        petId,
        ...form,
      });
      alert('✅ Request submitted!');
      navigate('/my-adoptions');
    } catch (err) {
      alert(`❌ ${err.response?.data?.error || 'Failed to submit request'}`);
    }
  };

  if (!pet) return null;

  return (
    <div className="adoption-form-container">
      <form className="adoption-form" onSubmit={handleSubmit}>
        <h2>Adopt {pet.name}</h2>

        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="address"
          placeholder="Your Address"
          value={form.address}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Your Phone Number"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <textarea
          name="hadPetBefore"
          placeholder="Did you have any pets before?"
          value={form.hadPetBefore}
          onChange={handleChange}
          required
        />

        <textarea
          name="carePlan"
          placeholder="How do you plan to take care of this pet?"
          value={form.carePlan}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="estimatedCost"
          placeholder="Estimated time or cost you're willing to spend"
          value={form.estimatedCost}
          onChange={handleChange}
          required
        />

        <label className="checkbox">
          <input
            type="checkbox"
            name="deliveryRequested"
            checked={form.deliveryRequested}
            onChange={handleChange}
          />
          Request home delivery (৳200)
        </label>

        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
}
