import React, { useState, useEffect } from 'react';
import { menuItems } from '../data/menuData';
import Category from './Category';
import { useNavigate } from 'react-router-dom';

const ItemMaster = ({ cart, setCart }) => {
  const [menu, setMenu] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();

    if (hours < 10) setMenu(menuItems.morning);
    else if (hours === 10 && minutes <= 30) setMenu(menuItems.break);
    else if (hours >= 12 && hours < 14) setMenu({ ...menuItems.lunch, ...menuItems.break });
    else if ((hours === 14 && minutes >= 40) || (hours === 15 && minutes <= 20)) setMenu(menuItems.break);
    else if ((hours === 16 && minutes >= 40) || (hours === 17 && minutes <= 30)) setMenu(menuItems.break);
    else setMenu(menuItems.morning);
  }, []);

  const handleAdd = (item) => {
    setCart((prev) => ({
      ...prev,
      [item.name]: { ...item, quantity: (prev[item.name]?.quantity || 0) + 1 },
    }));
  };

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