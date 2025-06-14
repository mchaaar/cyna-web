import { useState } from 'react';
import { apiClient, apiClientWithoutAuth } from '../lib/api';

export const useCreateProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createProduct = async (productData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient('/api/products', {
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

  return { createProduct, loading, error };
};

export const useGetProductById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProduct = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClientWithoutAuth(`/api/products/${id}`);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { fetchProduct, loading, error };
};

export const useGetProducts = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClientWithoutAuth('/api/products');
      setData(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchProducts };
};

export const useReplaceProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const replaceProduct = async (id, productData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient(`/api/products/${id}`, {
        method: 'PUT',
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

  return { replaceProduct, loading, error };
};

export const useDeleteProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteProduct = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient(`/api/products/${id}`, {
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

  return { deleteProduct, loading, error };
};
