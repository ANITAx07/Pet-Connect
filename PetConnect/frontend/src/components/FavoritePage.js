import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHeart } from "react-icons/fa"; // Heart icon to remove favorite
import "./FavoritePage.css";

export default function FavoritePage() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const userId = localStorage.getItem("userId"); // Get userId from localStorage
      if (!userId) {
        alert("Please log in to view your favorites.");
        return;
      }
      const res = await axios.get(`https://petconnect-backend-henx.onrender.com/api/users/${userId}/favorites`);
      setFavorites(res.data);
    } catch (err) {
      console.error("Error fetching favorites:", err);
      alert("Failed to fetch favorite pets.");
    }
  };

  const handleRemoveFavorite = async (petId) => {
    try {
      const userId = localStorage.getItem("userId");
      await axios.put(`https://petconnect-backend-henx.onrender.com/api/users/remove-favorite/${userId}`, {
        petId, // Sending petId to the backend
      });
      setFavorites(favorites.filter((pet) => pet._id !== petId)); // Remove pet from UI
      alert("Pet removed from favorites.");
    } catch (err) {
      console.error("Error removing favorite:", err);
      alert("Failed to remove pet from favorites.");
    }
  };

  return (
    <div className="favorite-page">
      <h2>Your Favorite Pets</h2>
      <div className="favorite-grid">
        {favorites.map((pet) => (
          <div key={pet._id} className="favorite-box">
            <img src={`https://petconnect-backend-henx.onrender.com${pet.image}`} alt={pet.name} />
            <div className="favorite-info">
              <h4>{pet.name}</h4>
              <p>Age: {pet.age}</p>
              <button
                className="remove-btn"
                onClick={() => handleRemoveFavorite(pet._id)}
              >
                <FaHeart style={{ color: "red", marginRight: "8px" }} />
                Remove from Favorites
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
