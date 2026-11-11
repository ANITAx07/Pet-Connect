// petRoutes.js
const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');
const upload = require('../middleware/uploadMiddleware');


// Add a new pet 
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const { name, breed, age, gender, description } = req.body;

    const newPet = new Pet({
      name,
      breed,
      age,
      gender,
      description,
      image: req.file ? `/uploads/${req.file.filename}` : ''
    });

    const savedPet = await newPet.save();
    res.status(201).json({
      message: 'Pet added successfully',
      pet: savedPet
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Get all pets
router.get('/', async (req, res) => {
  try {
    const pets = await Pet.find();
    res.json(pets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get single pet by ID 

router.get('/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }
    res.json(pet);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pet' });
  }
});


// Get all pets for admin
router.get('/admin/all', async (req, res) => {
  try {
    const pets = await Pet.find().sort({ createdAt: -1 }); // latest first
    res.json(pets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pets' });
  }
});

// Delete a pet
router.delete('/:id', async (req, res) => {
  try {
    await Pet.findByIdAndDelete(req.params.id);
    res.json({ message: 'Pet deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Update a pet
router.put('/:id', async (req, res) => {
  try {
    const updatedPet = await Pet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;


// GET all pets (for admin management)
router.get('/admin/all', async (req, res) => {
  try {
    const pets = await Pet.find().sort({ createdAt: -1 }); // latest first
    res.json(pets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pets' });
  }
});
// Delete a pet
router.delete('/:id', async (req, res) => {
  try {
    await Pet.findByIdAndDelete(req.params.id);
    res.json({ message: 'Pet deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a pet
router.put('/:id', async (req, res) => {
  try {
    const updatedPet = await Pet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
