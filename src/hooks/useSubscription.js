import { useState, useCallback } from 'react';
import { apiClient } from '../lib/api';

export const useGetSubscriptions = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSubscriptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient('/api/subscriptions');
      setData(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchSubscriptions };
};

export const useGetMySubscriptions = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMySubscriptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient('/api/me/subscriptions');
      setData(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchMySubscriptions };
};

export const useCancelSubscription = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cancelSubscription = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient(`/api/me/subscription/${id}/cancel`, {
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

  return { cancelSubscription, loading, error };
};
