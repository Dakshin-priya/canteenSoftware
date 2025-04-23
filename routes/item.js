const express = require('express');
const router = express.Router();
const Item = require('../schema/item');

// 🔍 Get all canteen items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find();  // Retrieve all items from the database
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 🔍 Get all canteen items by category
router.get('/category/:category', async (req, res) => {
  const category = req.params.category;  // Get category from the URL params
  try {
    const items = await Item.find({ category: category });  // Find items with the specific category
    if (items.length === 0) {
      return res.status(404).json({ error: 'No items found in this category' });
    }
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


// 🧪 Seed items into the database (for testing purposes)
router.post('/seed', async (req, res) => {
  try {
    const sampleItems = req.body.items;  // Expects an array of items in the request body
    if (!Array.isArray(sampleItems)) {
      return res.status(400).json({ error: 'Invalid input. Please provide an array of items.' });
    }
    const created = await Item.insertMany(sampleItems);  // Insert multiple items into DB
    res.status(201).json(created);  // Return the created items
  } catch (err) {
    res.status(400).json({ error: 'Seeding failed', details: err.message });
  }
});

module.exports = router;
