// src/components/Bill.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Bill = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, total } = location.state || { cart: {}, total: 0 };

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [billNumber, setBillNumber] = useState(1);

  useEffect(() => {
    const now = new Date();
    setDate(now.toLocaleDateString());
    setTime(now.toLocaleTimeString());

    const lastBill = parseInt(localStorage.getItem('lastBillNumber') || '0', 10);
    const newBillNumber = lastBill + 1;
    setBillNumber(newBillNumber);
    localStorage.setItem('lastBillNumber', newBillNumber);
  }, []);

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 shadow mt-6 text-center print:text-left">
      <h1 className="text-2xl font-bold">PSGITECH</h1>
      <p className="mt-2">Date: {date}</p>
      <p>Time: {time}</p>
      <p className="mb-4">Bill No: {billNumber}</p>

      <h2 className="text-xl font-semibold mb-4">CANTEEN BILLING RECEIPT</h2>

      <table className="w-full border border-gray-400 mb-4">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-2 py-1">Item</th>
            <th className="border px-2 py-1">Qty</th>
            <th className="border px-2 py-1">Rate</th>
            <th className="border px-2 py-1">Total</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(cart).map((item, index) => (
            <tr key={index}>
              <td className="border px-2 py-1">{item.name}</td>
              <td className="border px-2 py-1">{item.quantity}</td>
              <td className="border px-2 py-1">₹{item.price}</td>
              <td className="border px-2 py-1">₹{item.price * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="text-lg font-bold mb-4">Grand Total: ₹{total}</h3>

      <p className="text-green-700 font-semibold mt-6">Thank you for visiting!</p>

      <div className="mt-6 flex justify-center gap-4 print:hidden">
        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Print Bill
        </button>
        <button
          onClick={() => navigate('/')}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
};

export default Bill;