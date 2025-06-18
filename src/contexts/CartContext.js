'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';

const initialState = {
  items: [],
  isOpen: false,
};

const ADD_ITEM = 'ADD_ITEM';
const REMOVE_ITEM = 'REMOVE_ITEM';
const UPDATE_QUANTITY = 'UPDATE_QUANTITY';
const CLEAR_CART = 'CLEAR_CART';
const TOGGLE_CART = 'TOGGLE_CART';

const cartReducer = (state, action) => {
  switch (action.type) {
    case ADD_ITEM: {
      const { product, period } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.id === product.id && item.period === period
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        return { ...state, items: updatedItems };
      } else {
        const price = period === 'month' ? product.amountMonth : product.amountYear;
        const newItem = {
          id: product.id,
          name: product.name,
          price: price,
          period: period,
          image: product.image1 || 'https://via.placeholder.com/100x100?text=No+Image',
          quantity: 1,
          product: product
        };
        return { ...state, items: [...state.items, newItem] };
      }
    }

    case REMOVE_ITEM: {
      const { id, period } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.id === id && item.period === period
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        if (updatedItems[existingItemIndex].quantity > 1) {
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity - 1
          };
        } else {
          updatedItems.splice(existingItemIndex, 1);
        }
        return { ...state, items: updatedItems };
      }
      return state;
    }

    case UPDATE_QUANTITY: {
      const { id, period, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => !(item.id === id && item.period === period))
        };
      }

      const updatedItems = state.items.map(item => {
        if (item.id === id && item.period === period) {
          return { ...item, quantity };
        }
        return item;
      });
      
      return { ...state, items: updatedItems };
    }

    case CLEAR_CART:
      return { ...state, items: [] };

    case TOGGLE_CART:
      return { ...state, isOpen: action.payload !== undefined ? action.payload : !state.isOpen };

    default:
      return state;
  }
};

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        parsedCart.items.forEach(item => {
          dispatch({
            type: ADD_ITEM,
            payload: {
              product: item.product,
              period: item.period
            }
          });
        });
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);
  
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify({ items: state.items }));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [state.items]);
  
  const totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  const value = {
    items: state.items,
    isOpen: state.isOpen,
    totalItems,
    subtotal,
    addItem: (product, period) => {
      dispatch({ type: ADD_ITEM, payload: { product, period } });
    },
    removeItem: (id, period) => {
      dispatch({ type: REMOVE_ITEM, payload: { id, period } });
    },
    updateQuantity: (id, period, quantity) => {
      dispatch({ type: UPDATE_QUANTITY, payload: { id, period, quantity } });
    },
    clearCart: () => {
      dispatch({ type: CLEAR_CART });
    },
    toggleCart: (isOpen) => {
      dispatch({ type: TOGGLE_CART, payload: isOpen });
    }
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
