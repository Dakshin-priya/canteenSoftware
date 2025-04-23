import React from 'react';
import ItemCard from './ItemCard';

const Category = ({ title, items, cart, onAdd, onRemove }) => {
  return (
    <div className="mb-6 px-4">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>

      {/* If category has subcategories like 'Hot' and 'Cold' */}
      {Array.isArray(items) ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((item, idx) => (
            <ItemCard
              key={idx}
              item={item}
              quantity={cart[item.name]?.quantity}
              onAdd={() => onAdd(item)}
              onRemove={() => onRemove(item)}
            />
          ))}
        </div>
      ) : (
        Object.entries(items).map(([subCat, subItems]) => (
          <div key={subCat} className="mb-4">
            <h3 className="text-xl font-semibold mb-2">{subCat}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {subItems.map((item, idx) => (
                <ItemCard
                  key={idx}
                  item={item}
                  quantity={cart[item.name]?.quantity}
                  onAdd={() => onAdd(item)}
                  onRemove={() => onRemove(item)}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Category;