import { useState } from 'react';
import { apiClient } from '../lib/api';

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

export const useGetCartSummary = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCartSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient('/api/me/cart/summary');
      setData(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchCartSummary };
};

export const useAddToCart = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addToCart = async (productData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient('/api/me/cart/add', {
        method: 'POST',
        body: productData,
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

  const removeFromCart = async (productData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient('/api/me/cart/remove', {
        method: 'DELETE',
        body: productData,
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

export const useCreateCartItem = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createCartItem = async (cartItemData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient('/api/cart_items', {
        method: 'POST',
        body: cartItemData,
      });
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createCartItem, loading, error };
};

export const useUpdateCartItem = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateCartItem = async (id, cartItemData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient(`/api/cart_items/${id}`, {
        method: 'PATCH',
        body: cartItemData,
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
