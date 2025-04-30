const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../schema/users');
const Bill = require('../schema/bill');

// POST /users/login
router.post('/login', async (req, res) => {
  const { rollNumber, password } = req.body;
  const user = await User.findOne({ rollNumber });

  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  if (user.password !== password) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  res.json(user); // or res.json({ token, user }) if using JWT
});


// ➕ Register a new user (with encrypted password)
router.post('/register', async (req, res) => {
  const { name, rollNumber, password } = req.body;
  try {
    const existingUser = await User.findOne({ rollNumber });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    // Create new user with hashed password
    const newUser = new User({ name, rollNumber, password });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully', data: newUser });
  } catch (err) {
    res.status(500).json({ error: 'Error creating user', details: err });
  }
});

// ➕ Add money to a user's wallet (using rollNumber)
router.post('/add-money', async (req, res) => {
  const { rollNumber, amount } = req.body; // Expecting rollNumber in body
  try {
    const user = await User.findOne({ rollNumber });  // Find user by rollNumber
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.walletBalance += amount;
    await user.save();
    res.json({ walletBalance: user.walletBalance });
  } catch (err) {
    res.status(400).json({ error: 'Failed to add money' });
  }
});

// Add money to a user's wallet (using username and password)
router.post('/topup', async (req, res) => {
  const { userId, amount } = req.body;

  if (!userId || isNaN(amount)) {
    return res.status(400).json({ error: 'Invalid userId or amount' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.walletBalance += parseFloat(amount);
    await user.save();

    res.json({ walletBalance: user.walletBalance });
  } catch (err) {
    console.error("Error during wallet top-up:", err); // Add this line
    res.status(500).json({ error: 'Failed to top up wallet' });
  }
});

// Route to update wallet balance
router.put('/:userId/wallet', async (req, res) => {
  const { userId } = req.params;
  const { walletBalance } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.walletBalance = walletBalance;
    await user.save();

    res.status(200).json({ message: 'Wallet updated successfully', walletBalance: user.walletBalance });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 📄 Get a user's wallet balance (using rollNumber)
router.get('/:rollNumber/wallet', async (req, res) => {
  try {
    const user = await User.findOne({ rollNumber: req.params.rollNumber });  // Find user by rollNumber
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ walletBalance: user.walletBalance });
  } catch (err) {
    res.status(400).json({ error: 'Failed to get wallet balance' });
  }
});

// 🧾 Get all bills of a specific user (using rollNumber)
router.get('/:rollNumber/bills', async (req, res) => {
  try {
    const user = await User.findOne({ rollNumber: req.params.rollNumber });  // Find user by rollNumber
    if (!user) return res.status(404).json({ error: 'User not found' });

    const bills = await Bill.find({ userId: user._id }).populate('items.itemId');  // Query bills by user ID
    res.json(bills);
  } catch (err) {
    res.status(400).json({ error: 'Failed to get bills' });
  }
});

module.exports = router;
