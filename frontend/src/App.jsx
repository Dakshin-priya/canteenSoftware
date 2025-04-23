import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

import ItemMaster from './components/ItemMaster';
import Cart from './components/Cart';
import PaymentOptions from './components/PaymentOptions';
import Bill from './components/Bill';
import OrderHistory from './components/OrderHistory';
import TopUpWallet from './components/TopUpWallet';
import Login from './components/login';
import Dashboard from './components/Dashboard';

import './styles/App.css';

function App() {
  const [cart, setCart] = useState({});
  const [wallet, setWallet] = useState(0);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);

  // Sync wallet balance from backend
  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:5000/users/${user._id}`)
        .then(res => setWallet(res.data.walletBalance))
        .catch(err => console.error("Failed to fetch wallet:", err));
    }
  }, [user]);

  return (
    <Router>
      <div>
        <h1>Welcome to the Canteen</h1>

        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />

          {/* Protect routes if not logged in */}
          {user ? (
            <>
              <Route path="/" element={<Dashboard user={user} wallet={wallet} />} />
              <Route path="/menu" element={<ItemMaster cart={cart} setCart={setCart} />} />
              <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
              <Route path="/payment" element={
                <PaymentOptions
                  cart={cart}
                  setCart={setCart}
                  wallet={wallet}
                  setWallet={setWallet}
                  user={user}
                />
              } />
              <Route path="/topup" element={<TopUpWallet user={user} setWallet={setWallet} />} />
              <Route path="/bill" element={<Bill />} />
              <Route path="/orders" element={<OrderHistory />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
