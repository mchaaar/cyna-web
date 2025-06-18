'use client';

import { useState } from 'react';
import { useCart } from '../contexts/CartContext';

const AddToCartButton = ({ product, period = 'month' }) => {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  
  const handleAddToCart = () => {
    setIsAdding(true);
    addItem(product, period);
    
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };
  
  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={isAdding || !product.active}
      className={`flex w-full items-center justify-center rounded-md border border-transparent px-8 py-3 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
        isAdding 
          ? 'bg-green-600 text-white' 
          : product.active 
            ? 'bg-blue-600 text-white hover:bg-blue-700' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
      }`}
    >
      {isAdding ? 'Added!' : product.active ? 'Add to Cart' : 'Currently Unavailable'}
    </button>
  );
};

export default AddToCartButton;
