const express = require('express');
const router = express.Router();
const Adoption = require('../models/AdoptionRequest');
const Notification = require('../models/Notification');
const Pet = require('../models/Pet');
const User = require('../models/User');

router.post('/request', async (req, res) => {
  const { userId, petId, name, address, phone, hadPetBefore, carePlan, estimatedCost, deliveryRequested } = req.body;

  try {
    const pet = await Pet.findById(petId);
    if (!pet) return res.status(404).json({ error: 'Pet not found' });
    if (pet.status !== 'available') return res.status(409).json({ error: 'This pet is no longer available' });

    const existingRequest = await Adoption.findOne({ userId, petId, status: { $in: ['pending', 'approved'] } });
    if (existingRequest) return res.status(409).json({ error: 'You already have an active request for this pet' });

    const newRequest = await Adoption.create({
      userId, petId, name, address, phone, hadPetBefore, carePlan, estimatedCost, deliveryRequested, status: 'pending'
    });

    const adminUsers = await User.find({ role: 'admin' });
    for (const admin of adminUsers) {
      await Notification.create({
        userId: admin._id,
        message: `New adoption request for ${pet.name} from ${name}`,
        type: 'adoption_request',
        relatedId: newRequest._id
      });
    }

    res.status(201).json({ message: 'Adoption request submitted', request: newRequest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit adoption request', details: err.message });
  }
});

router.get('/my-requests/:userId', async (req, res) => {
  try {
    const requests = await Adoption.find({ userId: req.params.userId })
      .populate('petId', 'name image breed age')
      .sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch requests', details: err.message });
  }
});

router.get('/admin/adoption-requests', async (req, res) => {
  try {
    const requests = await Adoption.find()
      .populate('petId', 'name image breed age')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch adoption requests', details: err.message });
  }
});

router.put('/admin/adoption-requests/:id/status', async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'approved', 'rejected'];

  try {
    if (!validStatuses.includes(status)) return res.status(400).json({ error: 'Invalid request status' });

    const request = await Adoption.findById(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    const previousStatus = request.status;
    const pet = await Pet.findById(request.petId);
    if (!pet) return res.status(404).json({ error: 'Pet not found' });

    if (status === 'approved' && previousStatus !== 'approved') {
      const anotherApprovedRequest = await Adoption.findOne({
        petId: request.petId, status: 'approved', _id: { $ne: request._id }
      });
      if (anotherApprovedRequest) return res.status(409).json({ error: 'This pet already has an approved adoption request' });
      if (pet.status !== 'available') return res.status(409).json({ error: 'This pet is no longer available' });
      pet.status = 'adopted';
      await pet.save();
    }

    request.status = status;
    await request.save();

    if ((status === 'approved' || status === 'rejected') && previousStatus !== status) {
      await Notification.create({
        userId: request.userId,
        type: `adoption_${status}`,
        message: `Your adoption request for ${pet.name} has been ${status}.`,
        relatedId: request._id
      });
    }

    if (status === 'rejected' && previousStatus === 'approved') {
      const anotherApprovedRequest = await Adoption.exists({ petId: request.petId, status: 'approved' });
      if (!anotherApprovedRequest) {
        pet.status = 'available';
        await pet.save();
      }
    }

    res.status(200).json({ message: 'Request status updated', request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update status', details: err.message });
  }
});

router.put('/pay/:requestId', async (req, res) => {
  const { platformFeePaid, deliveryFeePaid } = req.body;

  try {
    const request = await Adoption.findById(req.params.requestId);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    request.platformFeePaid = platformFeePaid;
    request.deliveryFeePaid = deliveryFeePaid;
    await request.save();
    res.status(200).json({ message: 'Payment recorded', request });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update payment', details: err.message });
  }
});

router.get('/admin/adoption-history', async (req, res) => {
  try {
    const completedAdoptions = await Adoption.find({ status: 'approved', platformFeePaid: true })
      .populate('petId', 'name image breed age')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(completedAdoptions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch completed adoptions', details: err.message });
  }
});

module.exports = router;