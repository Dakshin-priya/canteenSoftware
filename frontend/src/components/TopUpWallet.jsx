import React, { useState } from 'react';
import axios from 'axios';

const TopUpWallet = ({ user, setWallet }) => {
  const [amount, setAmount] = useState('');

  const handleTopUp = async () => {
    try {
      const res = await axios.post(`http://localhost:5000/api/wallet/topup`, {
        userId: user._id,
        amount: parseFloat(amount)
      });
      setWallet(res.data.walletBalance);
      alert('Wallet topped up!');
    } catch (err) {
      alert('Top-up failed');
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
