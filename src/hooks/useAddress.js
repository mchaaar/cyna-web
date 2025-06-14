import { useState } from 'react';
import { apiClient } from '../lib/api';

export const useCreateAddress = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createAddress = async (addressData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient('/api/addresses', {
        method: 'POST',
        body: addressData,
      });
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createAddress, loading, error };
};

export const useGetAddresses = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAddresses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient('/api/addresses');
      setData(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchAddresses };
};

export const useGetAddressById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAddress = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient(`/api/addresses/${id}`);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { fetchAddress, loading, error };
};

export const useDeleteAddress = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteAddress = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient(`/api/addresses/${id}`, {
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

  return { deleteAddress, loading, error };
};

export const useUpdateAddress = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateAddress = async (id, addressData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient(`/api/addresses/${id}`, {
        method: 'PATCH',
        body: addressData,
      });
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateAddress, loading, error };
};
