import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminManagePets.css';

export default function AdminManagePets() {
  const [pets, setPets] = useState([]);
  const [editPetId, setEditPetId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editForm, setEditForm] = useState({
    name: '',
    breed: '',
    age: '',
    gender: '',
    description: '',
    status: ''
  });

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const res = await axios.get('https://petconnect-backend-henx.onrender.com/api/pets');
      setPets(res.data);
    } catch (err) {
      alert('Failed to fetch pets');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      try {
        await axios.delete(`https://petconnect-backend-henx.onrender.com/api/pets/${id}`);
        fetchPets();
      } catch (err) {
        alert('Failed to delete pet');
      }
    }
  };

  const handleEdit = (pet) => {
    setEditPetId(pet._id);
    setEditForm({ ...pet });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`https://petconnect-backend-henx.onrender.com/api/pets/${editPetId}`, editForm);
      setEditPetId(null);
      fetchPets();
    } catch (err) {
      alert('Failed to update pet');
    }
  };

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Apply filters
  const filteredPets = pets.filter((pet) => {
    const matchesSearch =
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || pet.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="manage-pets">
      <h2>Manage Pets</h2>

      {/* 🔍 Search & Filter */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by name or breed"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="available">Available</option>
          <option value="adopted">Adopted</option>
        </select>
      </div>

      {/* 🐶 Pet Cards */}
      <div className="pet-list">
        {filteredPets.length === 0 ? (
          <p>No pets found.</p>
        ) : (
          filteredPets.map((pet) => (
            <div key={pet._id} className="pet-card">
              <img src={`https://petconnect-backend-henx.onrender.com${pet.image}`} alt={pet.name} />

              {editPetId === pet._id ? (
                <>
                  <input name="name" value={editForm.name} onChange={handleChange} />
                  <input name="breed" value={editForm.breed} onChange={handleChange} />
                  <input name="age" value={editForm.age} onChange={handleChange} />
                  <select name="gender" value={editForm.gender} onChange={handleChange}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <select name="status" value={editForm.status} onChange={handleChange}>
                    <option value="available">Available</option>
                    <option value="adopted">Adopted</option>
                  </select>
                  <textarea name="description" value={editForm.description} onChange={handleChange} />

                  <button onClick={handleUpdate}>💾 Save</button>
                  <button onClick={() => setEditPetId(null)}>❌ Cancel</button>
                </>
              ) : (
                <>
                  <h3>{pet.name}</h3>
                  <p><strong>Breed:</strong> {pet.breed}</p>
                  <p><strong>Age:</strong> {pet.age}</p>
                  <p><strong>Gender:</strong> {pet.gender}</p>
                  <p><strong>Status:</strong> {pet.status}</p>
                  <p>{pet.description}</p>
                  <button onClick={() => handleEdit(pet)}>✏️ Edit</button>
                  <button onClick={() => handleDelete(pet._id)}>🗑️ Delete</button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
