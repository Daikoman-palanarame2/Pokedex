const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d'
  });
};

const checkMongoConnection = () => {
  return mongoose.connection.readyState === 1;
};

const register = async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (!checkMongoConnection()) {
      return res.status(503).json({ 
        message: 'Database not available. Please try again later or contact support.',
        error: 'DATABASE_UNAVAILABLE'
      });
    }

    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: existingUser.email === email ? 'Email already exists' : 'Username already exists'
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      favorites: [],
      team: []
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        favorites: user.favorites,
        team: user.team
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle MongoDB timeout errors
    if (error.name === 'MongooseError' && error.message.includes('buffering timed out')) {
      return res.status(503).json({ 
        message: 'Database connection timeout. Please try again later.',
        error: 'DATABASE_TIMEOUT'
      });
    }
    
    res.status(500).json({ message: 'Server error during registration' });
  }
};

const login = async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (!checkMongoConnection()) {
      return res.status(503).json({ 
        message: 'Database not available. Please try again later or contact support.',
        error: 'DATABASE_UNAVAILABLE'
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        favorites: user.favorites,
        team: user.team
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    
    // Handle MongoDB timeout errors
    if (error.name === 'MongooseError' && error.message.includes('buffering timed out')) {
      return res.status(503).json({ 
        message: 'Database connection timeout. Please try again later.',
        error: 'DATABASE_TIMEOUT'
      });
    }
    
    res.status(500).json({ message: 'Server error during login' });
  }
};

const getMe = async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (!checkMongoConnection()) {
      return res.status(503).json({ 
        message: 'Database not available. Please try again later or contact support.',
        error: 'DATABASE_UNAVAILABLE'
      });
    }

    const user = await User.findById(req.user.id).select('-password');
    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        favorites: user.favorites,
        team: user.team
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    
    // Handle MongoDB timeout errors
    if (error.name === 'MongooseError' && error.message.includes('buffering timed out')) {
      return res.status(503).json({ 
        message: 'Database connection timeout. Please try again later.',
        error: 'DATABASE_TIMEOUT'
      });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  getMe
};
