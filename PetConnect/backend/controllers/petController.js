// petController.js

const getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }
    res.json(pet);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pet' });
  }
};

module.exports = { getAllPets, getPetById };
