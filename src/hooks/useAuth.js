import { useState } from 'react';
import { apiClientWithoutAuth } from '../lib/api';

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClientWithoutAuth('/api/register', {
        method: 'POST',
        body: userData,
      });
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
};

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClientWithoutAuth('/api/login', {
        method: 'POST',
        body: credentials,
      });
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};

export const useRefreshToken = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshToken = async (refreshTokenData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClientWithoutAuth('/api/token/refresh', {
        method: 'POST',
        body: refreshTokenData,
      });
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { refreshToken, loading, error };
};
