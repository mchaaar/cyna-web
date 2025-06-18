'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';
import { useAddToCart, useRemoveFromCart, useGetCart } from '../hooks/useCart';
import { useGetProductById } from '../hooks/useProduct';
import { useAuth } from './AuthContext';

const initialState = {
  items: [],
  isOpen: false,
  loading: false,
  error: null,
};

const ADD_ITEM = 'ADD_ITEM';
const REMOVE_ITEM = 'REMOVE_ITEM';
const UPDATE_QUANTITY = 'UPDATE_QUANTITY';
const CLEAR_CART = 'CLEAR_CART';
const TOGGLE_CART = 'TOGGLE_CART';
const SET_LOADING = 'SET_LOADING';
const SET_ERROR = 'SET_ERROR';
const SET_CART_DATA = 'SET_CART_DATA';

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
      return {
        ...state,
        items: state.items.filter(item => !(item.id === id && item.period === period))
      };
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

    case SET_LOADING:
      return { ...state, loading: action.payload };

    case SET_ERROR:
      return { ...state, error: action.payload };

    case SET_CART_DATA:
      return { ...state, items: action.payload.items || [], error: null };

    default:
      return state;
  }
};

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { addToCart } = useAddToCart();
  const { removeFromCart } = useRemoveFromCart();
  const { fetchCart } = useGetCart();
  const { fetchProduct } = useGetProductById();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (isAuthenticated) {
      loadCartFromServer();
    } else {
      loadCartFromLocalStorage();
    }
  }, [isAuthenticated]);
  
  useEffect(() => {
    if (!isAuthenticated) {
      try {
        localStorage.setItem('cart', JSON.stringify({ items: state.items }));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [state.items, isAuthenticated]);

  const loadCartFromLocalStorage = () => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: SET_CART_DATA, payload: parsedCart });
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  };

  const loadCartFromServer = async () => {
    try {
      dispatch({ type: SET_LOADING, payload: true });
      const cartData = await fetchCart();
      
      const items = [];
      if (cartData && cartData.orderItems && cartData.orderItems.length > 0) {
        const productPromises = cartData.orderItems.map(async (orderItem) => {
          try {
            const productId = orderItem.product.id;
            const productDetails = await fetchProduct(productId);
            
            return {
              id: productDetails.id,
              name: productDetails.name,
              price: orderItem.price,
              period: orderItem.period,
              image: productDetails.image1 || 'https://via.placeholder.com/100x100?text=No+Image',
              quantity: orderItem.quantity || 1,
              product: productDetails,
              orderItemId: orderItem.id
            };
          } catch (error) {
            console.error(`Error fetching product ${orderItem.product.id}:`, error);
            return null;
          }
        });
        
        const resolvedItems = await Promise.all(productPromises);
        items.push(...resolvedItems.filter(item => item !== null));
      }
      
      dispatch({ type: SET_CART_DATA, payload: { items } });
    } catch (error) {
      console.error('Error loading cart from server:', error);
      dispatch({ type: SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: SET_LOADING, payload: false });
    }
  };
  
  const totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  const value = {
    items: state.items,
    isOpen: state.isOpen,
    loading: state.loading,
    error: state.error,
    totalItems,
    subtotal,
    addItem: async (product, period) => {
      if (isAuthenticated) {
        try {
          dispatch({ type: SET_LOADING, payload: true });
          await addToCart(product.id, period);
          dispatch({ type: ADD_ITEM, payload: { product, period } });
          await loadCartFromServer();
        } catch (error) {
          dispatch({ type: SET_ERROR, payload: error.message });
        } finally {
          dispatch({ type: SET_LOADING, payload: false });
        }
      } else {
        dispatch({ type: ADD_ITEM, payload: { product, period } });
      }
    },
    removeItem: async (id, period) => {
      if (isAuthenticated) {
        try {
          dispatch({ type: SET_LOADING, payload: true });
          await removeFromCart(id);
          dispatch({ type: REMOVE_ITEM, payload: { id, period } });
          await loadCartFromServer();
        } catch (error) {
          dispatch({ type: SET_ERROR, payload: error.message });
        } finally {
          dispatch({ type: SET_LOADING, payload: false });
        }
      } else {
        dispatch({ type: REMOVE_ITEM, payload: { id, period } });
      }
    },
    updateQuantity: async (id, period, quantity) => {
      if (quantity <= 0) {
        await value.removeItem(id, period);
        return;
      }

      if (isAuthenticated) {
        try {
          dispatch({ type: SET_LOADING, payload: true });
          const item = state.items.find(item => item.id === id && item.period === period);
          if (item && item.orderItemId) {
            await updateCartItem(item.orderItemId, quantity);
          }
          dispatch({ type: UPDATE_QUANTITY, payload: { id, period, quantity } });
          await loadCartFromServer();
        } catch (error) {
          dispatch({ type: SET_ERROR, payload: error.message });
        } finally {
          dispatch({ type: SET_LOADING, payload: false });
        }
      } else {
        dispatch({ type: UPDATE_QUANTITY, payload: { id, period, quantity } });
      }
    },
    clearCart: () => {
      dispatch({ type: CLEAR_CART });
    },
    toggleCart: (isOpen) => {
      dispatch({ type: TOGGLE_CART, payload: isOpen });
    },
    refreshCart: loadCartFromServer
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
