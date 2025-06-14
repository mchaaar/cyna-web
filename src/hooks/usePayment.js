import { useState } from 'react';
import { apiClient, apiClientWithoutAuth } from '../lib/api';

export const useCreatePaymentSession = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createPaymentSession = async (sessionData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClientWithoutAuth('/api/payment/create-session', {
        method: 'POST',
        body: sessionData,
      });
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createPaymentSession, loading, error };
};

export const useCheckout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkout = async (checkoutData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient('/api/checkout', {
        method: 'POST',
        body: checkoutData,
      });
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { checkout, loading, error };
};

export const useMyCheckout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const myCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient('/api/me/checkout', {
        method: 'POST',
      });
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { myCheckout, loading, error };
};
