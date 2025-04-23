import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentOptions = ({ cart, wallet, setWallet, setCart }) => {
  const [topUp, setTopUp] = useState('');
  const [showTopUp, setShowTopUp] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showWallet, setShowWallet] = useState(false);

  const navigate = useNavigate();

  const total = Object.values(cart).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleWalletPayment = () => {
    if (wallet >= total) {
      setWallet(wallet - total);
      saveAndNavigate('Wallet');
    } else {
      setShowTopUp(true);
    }
  };

  const handleTopUp = () => {
    const amount = parseFloat(topUp);
    if (!isNaN(amount) && amount > 0) {
      setWallet(wallet + amount);
      setTopUp('');
      setShowTopUp(false);
    }
  };

  const handleGPay = () => {
    setShowQR(true);
  };

  const saveAndNavigate = (method) => {
    const history = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    history.push({ cart, total, method, date: new Date() });
    localStorage.setItem('orderHistory', JSON.stringify(history));
    setCart({});
    navigate('/bill', { state: { cart, total } });
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
            src={`https://api.qrserver.com/v1/create-qr-code/?data=upi://pay?pa=your@upi&pn=CanteenApp&am=${total}&currency=INR&size=150x150}`}
            alt="GPay QR Code"
            className="mx-auto"
          />
          <p className="text-sm text-gray-500 mt-2">
            Use any UPI app to complete payment
          </p>
          <button
            onClick={() => saveAndNavigate('GPay')}
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