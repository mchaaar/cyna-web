'use client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token
    ? { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    : { Accept: 'application/json' };
};

export const apiClient = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('/api/')
    ? `${API_BASE_URL}${endpoint}`
    : `${API_BASE_URL}/api${endpoint}`;
  const config = {
    headers: { ...getAuthHeaders(), ...options.headers },
    ...options,
  };
  if (options.body) {
    config.headers['Content-Type'] = options.method === 'PATCH'
      ? 'application/merge-patch+json'
      : 'application/json';
    config.body = JSON.stringify(options.body);
  }
  const res = await fetch(url, config);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  if (res.status === 204) return {};
  return res.json();
};

export const apiClientWithoutAuth = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('/api/')
    ? `${API_BASE_URL}${endpoint}`
    : `${API_BASE_URL}/api${endpoint}`;
  const config = {
    headers: {
      'Content-Type': options.method === 'PATCH'
        ? 'application/merge-patch+json'
        : 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
    ...options,
  };
  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }
  const res = await fetch(url, config);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  if (res.status === 204) return {};
  return res.json();
};