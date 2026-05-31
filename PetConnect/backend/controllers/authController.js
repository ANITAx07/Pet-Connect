// backend/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
// const crypto = require('crypto');
const jwt = require('jsonwebtoken');


// Signup 
const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
    });

    await newUser.save();

    res.status(201).json({
      message: 'User created successfully',
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'User registration failed', details: error.message });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    console.log('🔍 Login email:', email);
    // console.log(' Stored password:', user.password);
    // console.log('Entered password:', password);

    const match = await bcrypt.compare(password, user.password);
    console.log('✅ Password match result:', match);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET, // use env variable for secret
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || '',
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  const { email, captcha, newPassword } = req.body;
  try {
    // Simple captcha validation (for example, captcha must be '1234')
    if (captcha !== '1234') {
      return res.status(400).json({ error: 'Invalid captcha' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Hash new password and save
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};

// Reset Password 
const resetPassword = async (req, res) => {
  res.status(404).json({ error: 'Not implemented' });
};

// Get Profile
const getProfile = async (req, res) => {
  const { userId } = req.query;
  try {
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// Update Profile 
const updateProfile = async (req, res) => {
  try {
    const userId = req.body.userId;
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const updateData = { name, email };

    if (req.file) {
      updateData.avatar = `/uploads/${req.file.filename}`;
    }
    
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      select: '-password',
    });

    res.json({ message: 'Profile updated', user: updatedUser });
  } catch (err) {
    console.error('Update failed:', err);
    res.status(500).json({ error: 'Update failed', details: err.message });
  }
};

// Admin Middleware 
const fs = require('fs');
const path = require('path');

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Admins only' });
  }
  next();
};

// Remove profile picture
const removeProfilePicture = async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!userId) return res.status(400).json({ error: 'User ID is required' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.avatar) {
      const avatarPath = path.join(__dirname, '..', 'uploads', path.basename(user.avatar));
      fs.unlink(avatarPath, (err) => {
        if (err) {
          console.error('Failed to delete avatar file:', err);
        }
      });
    }

    user.avatar = '';
    await user.save();

    res.json({ message: 'Profile picture removed', user });
  } catch (err) {
    console.error('Remove profile picture failed:', err);
    res.status(500).json({ error: 'Failed to remove profile picture' });
  }
};

module.exports = {
  signup,
  login,
  getProfile,
  updateProfile,
  isAdmin,
  forgotPassword,
  resetPassword,
  removeProfilePicture,
};


