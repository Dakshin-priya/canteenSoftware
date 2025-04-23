const express = require('express');
const router = express.Router();
const Bill = require('../schema/bill');
const User = require('../schema/users');
const Item = require('../schema/item');

const mongoose = require('mongoose');

// 🧾 Generate a bill (internal use)
router.post('/', async (req, res) => {
  const { userId, items, totalAmount } = req.body;

  // Validate userId and make sure it's a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    // Explicitly create an ObjectId using 'new'
    const user = await User.findById(new mongoose.Types.ObjectId(userId)); // Use 'new'

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Process the items for the bill
    const billItems = [];
    for (const item of items) {
      const itemDetail = await Item.findById(new mongoose.Types.ObjectId(item.itemId)); // Use 'new' for itemId
      if (!itemDetail) {
        return res.status(404).json({ error: `Item with ID ${item.itemId} not found` });
      }
      billItems.push({
        itemId: item.itemId,
        quantity: item.quantity,
        name: itemDetail.name,  // Assuming Item schema has 'name' field
        price: itemDetail.price  // Assuming Item schema has 'price' field
      });
    }

    // Create the bill and save it to the database
    const bill = new Bill({
      userId: new mongoose.Types.ObjectId(userId),  // Use 'new' to ensure it's an ObjectId
      items: billItems,
      totalAmount,
      paymentMethod: 'wallet',  // or 'card' based on your needs
      paymentStatus: 'success',  // Adjust payment status as needed
      billNumber: `BILL-${Date.now()}`
    });

    await bill.save();
    res.status(201).json(bill);  // Return the created bill in the response
  } catch (err) {
    console.error('Error while creating bill:', err);
    res.status(400).json({ error: 'Failed to create bill', details: err.message });
  }
});

// Create a new bill (order)
router.post('/', async (req, res) => {
  const { userId, items, paymentMethod } = req.body;

  console.log('🟡 Incoming request body:', req.body);

  // Defensive checks
  if (!userId || !items || !Array.isArray(items) || items.length === 0) {
    console.log('❌ Invalid input: missing userId or items');
    return res.status(400).json({ message: 'Invalid input: userId and items are required' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log('❌ User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    let totalAmount = 0;

    // Loop to calculate total amount
    for (const itemObj of items) {
      console.log('🧾 Processing item:', itemObj);

      if (!itemObj.itemId || typeof itemObj.quantity !== 'number') {
        console.log('❌ Invalid item data:', itemObj);
        return res.status(400).json({ message: 'Invalid item structure' });
      }

      const item = await Item.findById(itemObj.itemId);
      if (!item) {
        console.log(`❌ Item not found for ID: ${itemObj.itemId}`);
        return res.status(404).json({ message: `Item not found: ${itemObj.itemId}` });
      }

      totalAmount += item.price * itemObj.quantity;
    }

    totalAmount = Number(totalAmount.toFixed(2));
    console.log('✅ Calculated totalAmount:', totalAmount);

    if (paymentMethod === 'wallet' && user.walletBalance < totalAmount) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    // Deduct from wallet if paymentMethod is wallet
    if (paymentMethod === 'wallet') {
      user.walletBalance -= totalAmount;
      await user.save();
    }

    const billData = {
      userId,
      items,
      totalAmount, // <--- This must be defined
      paymentMethod,
      paymentStatus: 'success',
      billNumber: `BILL-${Date.now()}`,
      time: new Date(),
    };

    console.log('📦 Bill data before saving:', billData);

    const bill = new Bill(billData);
    await bill.save(); // 👈 Failing here if totalAmount is undefined

    // Push bill ID to user history
    user.orderHistory.push(bill._id);
    await user.save();

    res.status(201).json({ message: 'Bill created successfully', bill });
  } catch (err) {
    console.error('❌ Caught error while creating bill:', err);
    res.status(500).json({ error: 'Failed to create bill', details: err.message });
  }
});


// 📜 Get a bill by bill ID
router.get('/:id', async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id).populate('items.itemId');
    if (!bill) return res.status(404).json({ error: 'Bill not found' });
    res.json(bill);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bill' });
  }
});

// 💸 Pay using wallet
router.post('/pay/wallet', async (req, res) => {
  const { userId, items, totalAmount } = req.body;
  try {
    // Ensure userId is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await User.findById(new mongoose.Types.ObjectId(userId));
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.walletBalance < totalAmount) {
      return res.status(400).json({ error: 'Insufficient wallet balance' });
    }

    user.walletBalance -= totalAmount;

    const billItems = [];
    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.itemId)) {
        return res.status(400).json({ error: `Invalid item ID: ${item.itemId}` });
      }

      const itemDetail = await Item.findById(new mongoose.Types.ObjectId(item.itemId));
      if (!itemDetail) {
        return res.status(404).json({ error: `Item with ID ${item.itemId} not found` });
      }

      billItems.push({
        itemId: item.itemId,
        quantity: item.quantity,
        name: itemDetail.name,
        price: itemDetail.price
      });
    }

    const bill = new Bill({
      userId,
      items: billItems,
      totalAmount,
      paymentMethod: 'wallet',
      paymentStatus: 'success',
      billNumber: `BILL-${Date.now()}`
    });

    await bill.save();

    // Add to user's order history
    user.orderHistory.push(bill._id);
    await user.save();

    res.status(201).json(bill);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Wallet payment failed', details: err.message });
  }
});

// 💳 Pay using razorpay
router.post('/pay/razorpay', async (req, res) => {
  const { userId, items, totalAmount } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await User.findById(new mongoose.Types.ObjectId(userId));
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const billItems = [];
    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.itemId)) {
        return res.status(400).json({ error: `Invalid item ID: ${item.itemId}` });
      }

      const itemDetail = await Item.findById(new mongoose.Types.ObjectId(item.itemId));
      if (!itemDetail) {
        return res.status(404).json({ error: `Item with ID ${item.itemId} not found` });
      }

      billItems.push({
        itemId: item.itemId,
        quantity: item.quantity,
        name: itemDetail.name,
        price: itemDetail.price
      });
    }

    const bill = new Bill({
      userId,
      items: billItems,
      totalAmount,
      paymentMethod: 'razorpay',
      paymentStatus: 'success',
      billNumber: `BILL-${Date.now()}`
    });

    await bill.save();

    // Add to user's order history
    user.orderHistory.push(bill._id);
    await user.save();

    res.status(201).json(bill);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Card payment failed', details: err.message });
  }
});

module.exports = router;
