import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Category from './Category';
import { useNavigate } from 'react-router-dom';

const ItemMaster = ({ cart, setCart }) => {
  const [menu, setMenu] = useState({});
  const navigate = useNavigate();

  // Fetch the menu from the backend
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get('http://localhost:5000/item');
        const items = res.data;

        // Group items by category
        const categorizedMenu = items.reduce((acc, item) => {
          if (!acc[item.category]) acc[item.category] = [];
          acc[item.category].push(item);
          return acc;
        }, {});

        setMenu(categorizedMenu);
      } catch (err) {
        console.error('Failed to fetch menu items:', err);
      }
    };

    fetchMenu();
  }, []);

  // Handle adding items to the cart
  const handleAdd = (item) => {
    setCart((prev) => ({
      ...prev,
      [item.name]: { ...item, quantity: (prev[item.name]?.quantity || 0) + 1 },
    }));
  };

  // Handle removing items from the cart
  const handleRemove = (item) => {
    setCart((prev) => {
      const quantity = (prev[item.name]?.quantity || 0) - 1;
      if (quantity <= 0) {
        const updated = { ...prev };
        delete updated[item.name];
        return updated;
      }
      return { ...prev, [item.name]: { ...item, quantity } };
    });
  };

  const total = Object.values(cart).reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="pb-20">
      {Object.entries(menu).map(([category, items]) => (
        <Category
          key={category}
          title={category}
          items={items}
          cart={cart}
          onAdd={handleAdd}
          onRemove={handleRemove}
        />
      ))}

      {Object.keys(cart).length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg border-t px-4 py-3 flex justify-between items-center z-50">
          <div className="text-lg font-semibold text-green-700">
            Total: ₹{total}
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            onClick={() => navigate('/cart')}
          >
            View Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default ItemMaster;
