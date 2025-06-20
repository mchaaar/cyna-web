import { useState, useCallback } from 'react';
import { apiClient } from '../lib/api';

export const useGetProducts = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient('/api/products');
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, fetchProducts, loading, error };
};

export const useCreateProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const createProduct = async (productData) => {
    setLoading(true);
    setError(null);
    try {
      return await apiClient('/api/products', {
        method: 'POST',
        body: productData
      });
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createProduct, loading, error };
};

export const useUpdateProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const updateProduct = async (id, productData) => {
    setLoading(true);
    setError(null);
    try {
      return await apiClient(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...productData,
          amountMonth: productData.amountMonth,
          amountYear: productData.amountYear,
          discountPercentage: productData.discountPercentage
        })
      });
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateProduct, loading, error };
};

export const useReplaceProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const replaceProduct = async (id, productData) => {
    setLoading(true);
    setError(null);
    try {
      return await apiClient(`/api/products/${id}`, {
        method: 'PUT',
        body: productData
      });
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
  const [error, setError]     = useState(null);

  const deleteProduct = async (id) => {
    setLoading(true);
    setError(null);
    try {
      return await apiClient(`/api/products/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteProduct, loading, error };
};

export const useGetProductById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const fetchProduct = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient(`/api/products/${id}`);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchProduct, loading, error };
};
