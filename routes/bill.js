const express = require('express');
const router = express.Router();
const Bill = require('../schema/bill');
const User = require('../schema/users');
const Item = require('../schema/item');

const mongoose = require('mongoose');

// 🧾 Generate a bill (internal use)
router.post('/internalUse', async (req, res) => {
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

// Create a new bill
router.post('/', async (req, res) => {
  const { userId, items, paymentMethod } = req.body;

  console.log(' Incoming request body:', req.body);
  console.log(" userId received:", userId);

  // Defensive checks
  if (!userId || !items || !Array.isArray(items) || items.length === 0) {
    console.log('Invalid input: missing userId or items');
    return res.status(400).json({ message: 'Invalid input: userId and items are required' });
  }

  try {
    // Fetch user using rollNumber
    const user = await User.findOne({ rollNumber: userId });
    console.log(" Found user:", user);

    if (!user) {
      console.log('User not found in DB:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    let totalAmount = 0;
    const billItems = [];

    // Calculate totalAmount and prepare billItems
    for (const itemObj of items) {
      console.log('Item input:', itemObj);

      if (!itemObj.itemId || typeof itemObj.quantity !== 'number') {
        console.log(' Invalid item structure:', itemObj);
        return res.status(400).json({ message: 'Invalid item structure' });
      }

      // itemId is actually item name in your case
      const item = await Item.findOne({ name: itemObj.itemId });

      console.log(" Found item:", item);

      if (!item) {
        console.log(` Item not found for input: ${itemObj.itemId}`);
        return res.status(404).json({ message: `Item not found: ${itemObj.itemId}` });
      }

      const itemPrice = item.price;

      if (isNaN(itemPrice) || itemPrice <= 0) {
        console.log(` Invalid price for item: ${itemObj.itemId}`);
        return res.status(400).json({ message: `Invalid price for item: ${itemObj.itemId}` });
      }

      const itemTotal = itemPrice * itemObj.quantity;
      console.log(` Item price: ${itemPrice}, Quantity: ${itemObj.quantity}, Subtotal: ${itemTotal}`);

      totalAmount += itemTotal;

      billItems.push({
        itemId: item._id, // ✅ Use ObjectId
        quantity: itemObj.quantity,
      });
    }

    totalAmount = parseFloat(totalAmount.toFixed(2));
    console.log(' Final calculated totalAmount:', totalAmount);

    if (isNaN(totalAmount) || totalAmount <= 0) {
      console.log(' Invalid totalAmount:', totalAmount);
      return res.status(400).json({ message: 'Failed to calculate valid totalAmount' });
    }

    // Handle wallet deduction
    if (paymentMethod === 'wallet') {
      if (user.walletBalance < totalAmount) {
        console.log(' Insufficient wallet balance');
        return res.status(400).json({ message: 'Insufficient wallet balance' });
      }

      user.walletBalance -= totalAmount;
      await user.save();
      console.log(` Wallet balance after deduction: ${user.walletBalance}`);
    }

    // Create the bill
    const billData = {
      userId: user._id,
      items: billItems,
      totalAmount,
      paymentMethod,
      paymentStatus: 'success',
      billNumber: `BILL-${Date.now()}`,
      time: new Date(),
    };

    console.log(' Bill data before saving:', billData);

    const bill = new Bill(billData);
    await bill.save();
    console.log(' Bill saved with ID:', bill._id);

    // Update user's order history
    user.orderHistory.push(bill._id);
    await user.save();
    console.log(' User order history updated');

    res.status(201).json({
      message: 'Bill created successfully',
      bill: {
        ...bill.toObject(),
        totalAmount,
      },
    });
  } catch (err) {
    console.error(' Caught error while creating bill:', err);
    res.status(500).json({ error: 'Failed to create bill', details: err.message });
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

// GET bill by ID

router.get('/:billId', async (req, res) => {
  const { billId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(billId)) {
    return res.status(400).json({ message: 'Invalid billId format' });
  }

  try {
    const bill = await Bill.findById(billId)
      .populate('items.itemId')
      .populate('userId', 'rollNumber');

    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    res.json(bill);
  } catch (err) {
    console.error('❌ Failed to fetch bill:', err.message);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

module.exports = router;

module.exports = router;
