import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Bill = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { billId } = location.state || {};

  const [bill, setBill] = useState(null);

  useEffect(() => {
    if (!billId) {
      navigate('/');
      return;
    }

    const fetchBill = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/bill/${billId}`);
        setBill(res.data);
      } catch (err) {
        console.error('Failed to fetch bill:', err);
        navigate('/');
      }
    };

    fetchBill();
  }, [billId, navigate]);

  if (!bill) return <div className="text-center mt-10">Loading Bill...</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 shadow mt-6 text-center print:text-left">
      <h1 className="text-2xl font-bold">PSGITECH</h1>
      <p className="mt-2">Date: {new Date(bill.time).toLocaleDateString()}</p>
      <p>Time: {new Date(bill.time).toLocaleTimeString()}</p>
      <p className="mb-4">Bill No: {bill.billNumber}</p>

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
          {bill.items.map((item, index) => (
            <tr key={index}>
              <td className="border px-2 py-1">{item.name}</td>
              <td className="border px-2 py-1">{item.quantity}</td>
              <td className="border px-2 py-1">₹{item.price}</td>
              <td className="border px-2 py-1">₹{item.price * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="text-lg font-bold mb-4">Grand Total: ₹{bill.totalAmount}</h3>

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
