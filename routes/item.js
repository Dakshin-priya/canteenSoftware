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

// Route to get the price of an item by its itemId
router.get('/price/:itemId', async (req, res) => {
  const { itemId } = req.params;
  console.log('Request for item price with itemId:', itemId);

  try {
    // Ensure the itemId is valid
    if (!itemId || typeof itemId !== 'string' || itemId.trim() === '') {
      return res.status(400).json({ message: 'Invalid itemId' });
    }

    // Query the database for the item
    const item = await Item.findOne({ itemId: itemId.trim() });
    if (!item) {
      console.log(`Item not found with itemId: ${itemId}`);
      return res.status(404).json({ message: 'Item not found' });
    }

    console.log('Item found:', item);
    res.status(200).json({ price: item.price });
  } catch (err) {
    console.error('Error fetching item price:', err);
    res.status(500).json({ message: 'Server error' });
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
