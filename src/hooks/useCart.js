'use client';

import { useState } from 'react';
import { apiClient } from '../lib/api';

export const useAddToCart = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addToCart = async (productId, period) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient('/api/me/cart/add', {
        method: 'POST',
        body: {
          product_id: productId,
          period: period
        },
      });
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addToCart, loading, error };
};

export const useRemoveFromCart = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const removeFromCart = async (productId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient('/api/me/cart/remove', {
        method: 'DELETE',
        body: {
          product_id: productId
        },
      });
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { removeFromCart, loading, error };
};

export const useGetCart = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient('/api/me/cart');
      setData(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchCart };
};

export const useUpdateCartItem = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateCartItem = async (itemId, quantity) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient(`/api/cart_items/${itemId}`, {
        method: 'PATCH',
        body: {
          quantity: quantity
        },
      });
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateCartItem, loading, error };
};
