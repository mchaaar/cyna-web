import { useState } from 'react';
import { apiClient } from '../lib/api';

export const useCreateOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createOrder = async (orderData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient('/api/orders', {
        method: 'POST',
        body: orderData,
      });
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createOrder, loading, error };
};

export const useGetOrders = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = async (queryParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const queryString = new URLSearchParams(queryParams).toString();
      const url = queryString ? `/api/orders?${queryString}` : '/api/orders';
      const response = await apiClient(url);
      setData(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchOrders };
};

export const useGetOrderById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrder = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient(`/api/orders/${id}`);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { fetchOrder, loading, error };
};

export const useUpdateOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateOrder = async (orderData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient('/api/orders', {
        method: 'PATCH',
        body: orderData,
      });
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateOrder, loading, error };
};

export const useReplaceOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const replaceOrder = async (id, orderData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient(`/api/orders/${id}`, {
        method: 'PUT',
        body: orderData,
      });
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { replaceOrder, loading, error };
};

export const useDeleteOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteOrder = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient(`/api/orders/${id}`, {
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

  return { deleteOrder, loading, error };
};
