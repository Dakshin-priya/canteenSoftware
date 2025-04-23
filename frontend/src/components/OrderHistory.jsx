// src/components/OrderHistory.jsx
import React from 'react';

const OrderHistory = () => {
  const orders = JSON.parse(localStorage.getItem('orderHistory') || '[]');

  return (
    <div>
      <h2>Order History</h2>
      {orders.length === 0 ? (
        <p>No previous orders.</p>
      ) : (
        orders.map((order, index) => (
          <div key={index} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <p><b>Date:</b> {new Date(order.date).toLocaleString()}</p>
            <p><b>Paid By:</b> {order.method}</p>
            <ul>
              {Object.values(order.cart).map((item, i) => (
                <li key={i}>{item.name} x {item.quantity} = ₹{item.price * item.quantity}</li>
              ))}
            </ul>
            <p><b>Total:</b> ₹{order.total}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;