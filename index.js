const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const port = 5000;
const bodyParser = require('body-parser');
const billsRoutes = require('./routes/bill');

//Allow frontend to access backend
app.use(cors({
    origin: 'http://localhost:5173'
  }));

// ✅ Middleware to parse JSON
app.use(express.json());

// ✅ Default Route
app.get('/', (req, res) => {
    res.send("Hello, backend is running");
});

// ✅ Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/canteen')
    .then(() => console.log("Connected to DB"))
    .catch(err => console.error("Database connection error:", err));

// ✅ Route Imports
const itemRoutes = require('./routes/item');
const userRoutes = require('./routes/users');
const billRoutes = require('./routes/bill');

// ✅ Use Routes without `/api` prefix
app.use('/item', itemRoutes);   // e.g. GET /item
app.use('/users', userRoutes);  // e.g. POST /users/:id/add-money
app.use('/bill', billRoutes);       // e.g. POST /pay/card, /bill

// ✅ Start Server
app.listen(port, () => {
    console.log(`Backend running on port ${port}`);
});
