import React from 'react';

const ItemCard = ({ item, onAdd, onRemove, quantity = 0 }) => {
  return (
    <div className="item-card border rounded-lg p-4 shadow-sm bg-white flex flex-col items-center">
      <img
        src={item.image}
        alt={item.name}
        className="w-24 h-24 object-cover rounded mb-2"
      />
      <h4 className="font-semibold text-lg">{item.name}</h4>
      <p className="text-gray-600 mb-2">₹{item.price}</p>

      {quantity === 0 ? (
        <button
          className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
          onClick={onAdd}
        >
          Add
        </button>
      ) : (
        <div className="quantity-controls flex items-center space-x-3">
          <button
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            onClick={onRemove}
          >
            −
          </button>
          <span className="font-semibold">{quantity}</span>
          <button
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            onClick={onAdd}
          >
            +
          </button>
        </div>
      )}
    </div>
  );
};

export default ItemCard;