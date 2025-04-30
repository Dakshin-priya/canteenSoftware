import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const PaymentOptions = ({ wallet, setWallet, setCart, user }) => {
  const [topUp, setTopUp] = useState('');
  const [showTopUp, setShowTopUp] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showWallet, setShowWallet] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const cart = location.state?.cart || {}; // 🛒 Get cart from navigation state

  // ✅ Optional: Log for debugging
  console.log('Cart received in PaymentOptions:', cart);

  const total = Object.values(cart).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

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

  const handleWalletPayment = async () => {
    if (wallet >= total) {
      try {
        saveAndNavigate('wallet'); // ✅ Let backend handle deduction
      } catch (err) {
        console.error('Failed to process wallet payment:', err);
      }
    } else {
      setShowTopUp(true);
    }
  };  

  const handleTopUp = async () => {
    const amount = parseFloat(topUp);
    if (!isNaN(amount) && amount > 0) {
      try {
        const updatedWalletBalance = wallet + amount;
        await axios.put(`http://localhost:5000/users/${user._id}/wallet`, {
          walletBalance: updatedWalletBalance,
        });

        setWallet(updatedWalletBalance);
        setTopUp('');
        setShowTopUp(false);
      } catch (err) {
        console.error('Failed to top up wallet:', err);
      }
    }
  };

  const handleGPay = () => {
    setShowQR(true);
  };

  const saveAndNavigate = async (paymentMethod) => {
    const formattedItems = Object.entries(cart).map(([itemId, item]) => ({
      itemId,
      quantity: item.quantity,
    }));

    try {
      if (!user.rollNumber || user.rollNumber.toString().length < 1) {
        console.error('Invalid user ID:', user.rollNumber);
        throw new Error('Invalid user ID');
      }

      console.log("Request Payload:", {
        userId: user.rollNumber,
        items: formattedItems,
        paymentMethod,
      });

      const res = await axios.post('http://localhost:5000/bill', {
        userId: user.rollNumber,
        items: formattedItems,
        paymentMethod,
      });

      setCart({}); // Clear cart after payment
      navigate('/bill', { state: { billId: res.data.bill._id } }); // Pass billId to Bill page
    } catch (err) {
      console.error('Failed to save bill:', err);
      if (err.response) {
        console.error('Response details:', err.response);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 shadow rounded mt-6">
      <h2 className="text-xl font-bold mb-4">Payment Options</h2>

      <div className="mb-4">
        <p><strong>Total Amount:</strong> ₹{total}</p>
      </div>

      <div className="mb-4">
        <button
          onClick={() => setShowWallet(!showWallet)}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          {showWallet ? 'Hide Wallet Balance' : 'View Wallet Balance'}
        </button>
        {showWallet && (
          <p className="mt-2 text-lg font-semibold">
            Wallet Balance: ₹{wallet}
          </p>
        )}
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={handleWalletPayment}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Pay Using Wallet
        </button>

        <button
          onClick={handleGPay}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Pay Using GPay
        </button>
      </div>

      {showTopUp && (
        <div className="mt-4 border-t pt-4">
          <p className="text-red-600 mb-2">Insufficient wallet balance!</p>
          <h3 className="text-md font-semibold mb-2">Add Money to Wallet</h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Enter amount"
              value={topUp}
              onChange={(e) => setTopUp(e.target.value)}
              className="border px-3 py-1 rounded w-32"
            />
            <button
              onClick={handleTopUp}
              className="bg-gray-800 text-white px-3 py-1 rounded"
            >
              Add Money
            </button>
          </div>
        </div>
      )}

      {showQR && (
        <div className="mt-6 text-center">
          <h3 className="text-md font-semibold mb-2">Scan QR to Pay via GPay</h3>
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?data=upi://pay?pa=your@upi&pn=CanteenApp&am=${total}&currency=INR&size=150x150`}
            alt="GPay QR Code"
            className="mx-auto"
          />
          <p className="text-sm text-gray-500 mt-2">
            Use any UPI app to complete payment
          </p>
          <button
            onClick={() => saveAndNavigate('gpay')}
            className="mt-4 bg-black text-white px-4 py-2 rounded"
          >
            I've Paid
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentOptions;
