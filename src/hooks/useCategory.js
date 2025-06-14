import { useState } from 'react';
import { apiClient, apiClientWithoutAuth } from '../lib/api';

export const useCreateCategory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createCategory = async (categoryData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient('/api/categories', {
        method: 'POST',
        body: categoryData,
      });
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createCategory, loading, error };
};

export const useGetCategoryById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategory = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClientWithoutAuth(`/api/categories/${id}`);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { fetchCategory, loading, error };
};

export const useGetCategories = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClientWithoutAuth('/api/categories');
      setData(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchCategories };
};

export const useUpdateCategory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateCategory = async (id, categoryData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient(`/api/categories/${id}`, {
        method: 'PATCH',
        body: categoryData,
      });
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateCategory, loading, error };
};

export const useDeleteCategory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteCategory = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient(`/api/categories/${id}`, {
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

  return { deleteCategory, loading, error };
};
