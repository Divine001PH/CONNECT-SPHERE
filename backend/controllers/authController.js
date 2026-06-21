const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ===== SIGNUP =====
const signup = async (req, res) => {
  try {
    const { fullname, email, password, department, level } = req.body;

    // 1. Check all required fields are present
    if (!fullname || !email || !password || !department || !level) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    // 3. Hash the password before saving (NEVER store plain text passwords)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create the new user
    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
      department,
      level,
    });

    // 5. Create a JWT token so the user is logged in immediately after signup
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 6. Send back the user info (without password) + token
    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        department: newUser.department,
        level: newUser.level,
        avatarInitials: newUser.avatarInitials,
      },
    });

  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// ===== LOGIN (we'll fully test this in the next step) =====
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        department: user.department,
        level: user.level,
        avatarInitials: user.avatarInitials,
      },
    });

  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

module.exports = { signup, login };