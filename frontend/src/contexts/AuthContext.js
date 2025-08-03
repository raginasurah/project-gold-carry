import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Configure API base URL - will use your Railway backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        
        if (token && savedUser) {
          setUser(JSON.parse(savedUser));
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const signUp = useCallback(async (email, password, firstName, lastName) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await api.post('/api/auth/signup', {
        email,
        password,
        first_name: firstName,
        last_name: lastName
      });
      
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      
      return { success: true, data: userData };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = useCallback(async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await api.post('/api/auth/signin', {
        email,
        password
      });
      
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      
      return { success: true, data: userData };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      
      await api.post('/api/auth/signout');
    } catch (error) {
      console.error('Signout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      setLoading(false);
    }
    
    return { success: true };
  }, []);

  const resetPassword = useCallback(async (email) => {
    try {
      setError(null);
      setLoading(true);
      
      await api.post('/api/auth/reset-password', { email });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updates) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await api.put('/api/auth/profile', updates);
      const updatedUser = response.data;
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return { success: true, data: updatedUser };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    isAuthenticated: !!user,
    api, // Export configured axios instance
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Demo component showing usage
export default function AuthDemo() {
  const { user, loading, error, signIn, signOut, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('demo123');
  const [loginError, setLoginError] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoginError('');
    const result = await signIn(email, password);
    if (!result.success) {
      setLoginError(result.error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        {!isAuthenticated ? (
          <div>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Sign In to AI Finance
            </h2>
            <form onSubmit={handleSignIn} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              {(error || loginError) && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                  {error || loginError}
                </div>
              )}
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign In
              </button>
            </form>
            <div className="mt-4 text-center text-sm text-gray-600">
              Demo credentials: demo@example.com / demo123
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
              Welcome to AI Finance
            </h2>
            <div className="bg-green-50 border border-green-200 p-4 rounded-md mb-6">
              <p className="text-green-800">
                <span className="font-semibold">Signed in as:</span> {user?.email}
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-semibold text-gray-700 mb-2">User Details:</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>User ID: {user?.id}</li>
                  <li>Email: {user?.email}</li>
                  <li>Name: {user?.first_name} {user?.last_name}</li>
                  <li>Authenticated: Yes</li>
                </ul>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}