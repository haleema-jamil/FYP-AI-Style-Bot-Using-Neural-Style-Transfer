const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Image = require('../models/Image');
const Favorite = require('../models/Favorite');
const router = express.Router();
const multer = require('multer');
const auth = require('../middlewares/auth');
const nodemailer = require('nodemailer');

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'marwafyp2024@gmail.com', // Replace with your email
    pass: 'vkgj xkxm owwl glta'    // Replace with your email password
  }
});

// In-memory store for verification codes (you can use a database instead)
const verificationCodes = new Map();

// Signup route
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Generate a 4-digit verification code
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
    verificationCodes.set(email, verificationCode);

    // Send the verification code to the user's email
    const mailOptions = {
      from: 'marwafyp2024@gmail.com',
      to: email,
      subject: 'Your Verification Code',
      text: `Your verification code is ${verificationCode}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ error: 'Error sending email' });
      }
      res.status(201).json({ message: 'Verification code sent to email' });
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: 'Error creating user' });
  }
});

// Verify code route for signup
router.post('/verify-code', async (req, res) => {
  const { email, code, name, password } = req.body;
  const storedCode = verificationCodes.get(email);

  if (storedCode === code) {
    verificationCodes.delete(email);

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();

      const token = jwt.sign({ userId: newUser._id }, 'your_jwt_secret', { expiresIn: '1h' });
      res.json({ token });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: 'Error creating user' });
    }
  } else {
    res.status(400).json({ error: 'Invalid verification code' });
  }
});


// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Multer setup for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user profile
router.post('/profile', [auth, upload.single('profilePicture')], async (req, res) => {
  try {
    const updates = {
      name: req.body.name,
      email: req.body.email,
    };
    if (req.file) {
      updates.profilePicture = req.file.buffer.toString('base64');
    }

    const user = await User.findByIdAndUpdate(req.user.userId, updates, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
