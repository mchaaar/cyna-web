'use client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const apiClient = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const isPatching = options.method === 'PATCH';
  
  const config = {
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
    ...options,
  };

  if (options.body) {
    if (isPatching) {
      config.headers['Content-Type'] = 'application/merge-patch+json';
    } else {
      config.headers['Content-Type'] = 'application/json';
    }
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
  }
  
  return response.json();
};

export const apiClientWithoutAuth = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const isPatching = options.method === 'PATCH';
  const defaultContentType = isPatching ? 'application/merge-patch+json' : 'application/json';
  
  const config = {
    headers: {
      'Content-Type': defaultContentType,
      ...options.headers,
    },
    ...options,
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
  }
  
  return response.json();
};
