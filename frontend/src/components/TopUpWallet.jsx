import React, { useState } from 'react';
import axios from 'axios';

const TopUpWallet = ({ user, setWallet }) => {
  const [amount, setAmount] = useState('');

  const handleTopUp = async () => {
    // Validate the entered amount
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      alert('Please enter a valid top-up amount');
      return;
    }

    try {
      console.log("Sending top-up request for user:", user._id);
      
      // Send the top-up request to the backend
      const res = await axios.post(`http://localhost:5000/users/topup`, {
        userId: user._id,
        amount: parseFloat(amount),
      });
      
      // Update wallet balance and reset the amount field
      console.log('Top-up successful:', res.data);  // Log the response data
      setWallet(res.data.walletBalance);
      alert('Wallet topped up!');
      setAmount('');
    } catch (err) {
      // Log the full error to understand the issue
      console.error('Top-up error:', err);
      
      // Check if there's a response and use it
      const errorMessage = err.response?.data?.error || err.message || 'Unknown error';
      alert('Top-up failed: ' + errorMessage);
    }
  };

  return (
    <div>
      <h2>Top Up Wallet</h2>
      
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
      />
      
      <button onClick={handleTopUp}>Top Up</button>
    </div>
  );
};

export default TopUpWallet;
