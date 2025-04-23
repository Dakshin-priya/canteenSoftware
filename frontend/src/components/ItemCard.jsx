import React from 'react';

const ItemCard = ({ item, onAdd, onRemove, quantity = 0 }) => {
  return (
    <div className="item-card border rounded-lg p-4 shadow-sm bg-white flex flex-col items-center text-center">
      {/* Display item image if available */}
      {item.image && (
        <img
          src={item.image}
          alt={item.name}
          className="w-24 h-24 object-cover rounded mb-2"
        />
      )}

      {/* Item name and price */}
      <h4 className="font-semibold text-lg">{item.name}</h4>
      <p className="text-gray-600 mb-2">₹{item.price}</p>

      {/* Display Add button if quantity is 0, otherwise show quantity controls */}
      {quantity === 0 ? (
        <button
          className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
          onClick={() => onAdd(item)} // Adding the item to cart
        >
          Add
        </button>
      ) : (
        <div className="quantity-controls flex items-center space-x-3">
          {/* Decrease quantity button */}
          <button
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            onClick={() => onRemove(item)} // Removing the item from cart
          >
            −
          </button>

          {/* Display the current quantity */}
          <span className="font-semibold">{quantity}</span>

          {/* Increase quantity button */}
          <button
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            onClick={() => onAdd(item)} // Adding one more unit of the item
          >
            +
          </button>
        </div>
      )}
    </div>
  );
};

export default ItemCard;
