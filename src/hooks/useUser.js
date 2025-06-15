'use client';

import { useState } from 'react';
import { apiClient } from '../lib/api';

export const useGetMe = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMe = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient('/api/me');
      setData(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchMe };
};

export const useUpdateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateUser = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient('/api/me', {
        method: 'PATCH',
        body: userData
      });
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateUser, loading, error };
};

export const useGetAllUsers = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient('/api/me/all');
      setData(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchAllUsers };
};

export const useGetUserById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUser = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient(`/api/users/${id}`);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { fetchUser, loading, error };
};

export const useDeleteUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteUser = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient(`/api/users/${id}`, {
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

  return { deleteUser, loading, error };
};

export const useCreateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createUser = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient('/api/users', {
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

  return { createUser, loading, error };
};

export const useGetUsers = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient('/api/users');
      setData(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchUsers };
};
