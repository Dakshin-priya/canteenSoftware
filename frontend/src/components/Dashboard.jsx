import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
const Dashboard = ({ user }) => {
  const [wallet, setWallet] = useState(0);

  useEffect(() => {
    const fetchWallet = async () => {
      if (!user?.rollNumber) return;
      try {
        const res = await axios.get(`http://localhost:5000/users/${user.rollNumber}/wallet`);
        setWallet(res.data.walletBalance);
      } catch (err) {
        console.error('Failed to fetch wallet:', err);
      }
    };

    fetchWallet();
  }, [user]);

  return (
    <div>
      <h2>Welcome {user?.rollNumber}</h2>
      <p>Wallet Balance: ₹{wallet}</p>
      <nav>
        <Link to="/menu">Order Food</Link> | 
        <Link to="/cart">Cart</Link> | 
        <Link to="/payment">Payment</Link> | 
        <Link to="/topup">Top Up Wallet</Link> | 
        <Link to="/orders">Order History</Link>
        
      </nav>
    </div>
  );
};

export default Dashboard;
