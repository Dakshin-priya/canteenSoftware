import React from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = ({ cart }) => {
  const navigate = useNavigate();
  const total = Object.values(cart).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Your Cart</h2>

      <table className="w-full border text-center">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Item Name</th>
            <th className="p-2 border">Qty</th>
            <th className="p-2 border">Price</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(cart).map((item, idx) => (
            <tr key={idx} className="border-t">
              <td className="p-2 border">{item.name}</td>
              <td className="p-2 border">{item.quantity}</td>
              <td className="p-2 border">₹{item.price * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right mt-4 text-lg font-semibold">
        Total Amount = ₹{total}
      </div>

      <button
        onClick={() => navigate('/payment')}
        className="mt-6 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Proceed to Pay
      </button>
    </div>
  );
};

export default Cart;