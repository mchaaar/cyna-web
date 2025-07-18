'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '../lib/api';

export const useCreateAddress = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createAddress = async (addressData) => {
    setLoading(true);
    setError(null);
    try {
      const apiPayload = {
        street: addressData.street,
        zip: addressData.postalCode,
        city: addressData.city,
        country: addressData.country,
      };

      if (addressData.additional && addressData.additional.trim()) {
        apiPayload.additional = addressData.additional;
      }

      const response = await apiClient('/api/addresses', {
        method: 'POST',
        body: apiPayload,
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
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAddresses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient('/api/addresses');
      
      let addressesArray = [];
      if (Array.isArray(response)) {
        addressesArray = response;
      } else if (response && response['hydra:member']) {
        addressesArray = response['hydra:member'];
      } else if (response && response.data) {
        addressesArray = response.data;
      } else if (response && typeof response === 'object') {
        addressesArray = [response];
      }
      
      setData(addressesArray);
      return addressesArray;
    } catch (err) {
      console.error('Error fetching addresses:', err);
      setError(err.message);
      setData([]);
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
      const apiPayload = {};
      
      if (addressData.street !== undefined) {
        apiPayload.street = addressData.street;
      }
      if (addressData.postalCode !== undefined) {
        apiPayload.zip = addressData.postalCode;
      }
      if (addressData.city !== undefined) {
        apiPayload.city = addressData.city;
      }
      if (addressData.country !== undefined) {
        apiPayload.country = addressData.country;
      }
      if (addressData.additional !== undefined) {
        apiPayload.additional = addressData.additional;
      }

      const response = await apiClient(`/api/addresses/${id}`, {
        method: 'PATCH',
        body: apiPayload,
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
