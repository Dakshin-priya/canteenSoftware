import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = ({ user, wallet }) => (
  <div>
    <h2>Welcome {user?.rollNumber}</h2>
    <p>Wallet Balance: ₹{wallet}</p>
    <nav>
      <Link to="/">Order Food</Link> | 
      <Link to="/cart">Cart</Link> | 
      <Link to="/payment">Payment</Link> | 
      <Link to="/topup">Top Up Wallet</Link> | 
      <Link to="/orders">Order History</Link>
    </nav>
  </div>
);

export default Dashboard;
