'use client'

import { createContext, useContext, useReducer, useEffect } from 'react';
import { useLogin, useRegister, useRefreshToken } from '../hooks/useAuth';
import { useGetMe } from '../hooks/useUser';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: !!action.payload };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, token: null, isAuthenticated: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { login: loginHook } = useLogin();
  const { register: registerHook } = useRegister();
  const { refreshToken: refreshTokenHook } = useRefreshToken();
  const { fetchMe } = useGetMe();

  const saveTokenToStorage = (token, refreshToken = null) => {
    localStorage.setItem('authToken', token);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    dispatch({ type: 'SET_TOKEN', payload: token });
  };

  const removeTokenFromStorage = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
  };

  const saveUserToStorage = (user) => {
    localStorage.setItem('userData', JSON.stringify(user));
    dispatch({ type: 'SET_USER', payload: user });
  };

  const login = async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const response = await loginHook(credentials);
      
      if (response.token) {
        saveTokenToStorage(response.token, response.refresh_token);
        
        const userData = await fetchMe();
        saveUserToStorage(userData);
        
        return response;
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const response = await registerHook(userData);
      
      if (response.token) {
        saveTokenToStorage(response.token, response.refresh_token);
        
        const userProfile = await fetchMe();
        saveUserToStorage(userProfile);
        
        return response;
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = () => {
    removeTokenFromStorage();
    dispatch({ type: 'LOGOUT' });
  };

  const refreshAuthToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        logout();
        return false;
      }

      const response = await refreshTokenHook({ refresh_token: refreshToken });
      
      if (response.token) {
        saveTokenToStorage(response.token, response.refresh_token);
        return true;
      }
      
      logout();
      return false;
    } catch (error) {
      logout();
      return false;
    }
  };

  const checkAuthStatus = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (!token) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }
      
      dispatch({ type: 'SET_TOKEN', payload: token });
      
      if (userData) {
        dispatch({ type: 'SET_USER', payload: JSON.parse(userData) });
      }
      
      try {
        const userProfile = await fetchMe();
        saveUserToStorage(userProfile);
      } catch (error) {
        if (error.message.includes('401') || error.message.includes('403')) {
          const refreshSuccess = await refreshAuthToken();
          if (refreshSuccess) {
            const userProfile = await fetchMe();
            saveUserToStorage(userProfile);
          }
        } else {
          logout();
        }
      }
    } catch (error) {
      logout();
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value = {
    ...state,
    login,
    register,
    logout,
    refreshAuthToken,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
