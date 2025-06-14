import { useState } from 'react';
import { apiClient, apiClientWithoutAuth } from '../lib/api';

export const useCreateProductDetails = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createProductDetails = async (productDetailsData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient('/api/product_details', {
        method: 'POST',
        body: productDetailsData,
      });
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createProductDetails, loading, error };
};

export const useGetProductDetails = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProductDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClientWithoutAuth('/api/product_details');
      setData(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchProductDetails };
};

export const useGetProductDetailsById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProductDetails = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClientWithoutAuth(`/api/product_details/${id}`);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { fetchProductDetails, loading, error };
};

export const useUpdateProductDetails = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateProductDetails = async (id, productDetailsData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient(`/api/product_details/${id}`, {
        method: 'PATCH',
        body: productDetailsData,
      });
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateProductDetails, loading, error };
};

export const useReplaceProductDetails = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const replaceProductDetails = async (id, productDetailsData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient(`/api/product_details/${id}`, {
        method: 'PUT',
        body: productDetailsData,
      });
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { replaceProductDetails, loading, error };
};

export const useDeleteProductDetails = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteProductDetails = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient(`/api/product_details/${id}`, {
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

  return { deleteProductDetails, loading, error };
};
