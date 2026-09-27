// frontend/src/components/AdminAddPet.js
import React, { useState } from 'react';
import axios from 'axios';
import './AdminAddPet.css';

export default function AdminAddPet() {
  const [form, setForm] = useState({
    name: '',
    breed: '',
    gender: 'Male',
    description: '',
  });

  const [ageYears, setAgeYears] = useState('');
  const [ageMonths, setAgeMonths] = useState('');
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) return alert('Please select an image!');

    // Format age 
    const formattedAge = `${ageYears ? `${ageYears} year${ageYears > 1 ? 's' : ''}` : ''}${ageYears && ageMonths ? ' ' : ''}${ageMonths ? `${ageMonths} month${ageMonths > 1 ? 's' : ''}` : ''}`;

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('breed', form.breed);
    formData.append('age', formattedAge);
    formData.append('gender', form.gender);
    formData.append('description', form.description);
    formData.append('image', file);

    try {
      const res = await axios.post('https://petconnect-backend-henx.onrender.com/api/pets/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('✅ Pet added!');
      setForm({ name: '', breed: '', gender: 'Male', description: '' });
      setAgeYears('');
      setAgeMonths('');
      setFile(null);
    } catch (err) {
      alert('❌ Failed to add pet');
    }
  };

  return (
    <div className="admin-add-pet">
      <h2>Add a Pet for Adoption</h2>
      <form onSubmit={handleSubmit} className="pet-form">
        <input type="text" name="name" placeholder="Pet Name" value={form.name} onChange={handleChange} required />
        <input type="text" name="breed" placeholder="Breed" value={form.breed} onChange={handleChange} />

        {/* 🐾 Age Fields */}
        <div className="age-inputs">
          <input
            type="number"
            placeholder="Years"
            min="0"
            value={ageYears}
            onChange={(e) => setAgeYears(e.target.value)}
          />
          <input
            type="number"
            placeholder="Months"
            min="0"
            max="11"
            value={ageMonths}
            onChange={(e) => setAgeMonths(e.target.value)}
          />
        </div>

        <select name="gender" value={form.gender} onChange={handleChange}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />

        <input type="file" accept="image/*" onChange={handleFileChange} />

        <button type="submit">Add Pet</button>
      </form>
    </div>
  );
}
