import { useState } from 'react';
import { apiClient } from '../lib/api';

export const useCreateOrderItem = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createOrderItem = async (orderItemData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient('/api/order_items', {
        method: 'POST',
        body: orderItemData,
      });
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createOrderItem, loading, error };
};

export const useGetOrderItemById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrderItem = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient(`/api/order_items/${id}`);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { fetchOrderItem, loading, error };
};

export const useGetOrderItems = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrderItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient('/api/orders_items');
      setData(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchOrderItems };
};

export const useUpdateOrderItem = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateOrderItem = async (id, orderItemData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient(`/api/order_items/${id}`, {
        method: 'PATCH',
        body: orderItemData,
      });
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateOrderItem, loading, error };
};

export const useReplaceOrderItem = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const replaceOrderItem = async (id, orderItemData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient(`/api/order_items/${id}`, {
        method: 'PUT',
        body: orderItemData,
      });
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { replaceOrderItem, loading, error };
};

export const useDeleteOrderItem = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteOrderItem = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient(`/api/order_items/${id}`, {
        method: 'DELETE',
      });
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteOrderItem, loading, error };
};
