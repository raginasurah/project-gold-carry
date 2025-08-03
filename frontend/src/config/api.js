// frontend/src/config/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class APIClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = null;
  }

  setAuthToken(token) {
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    // Add auth token if available
    if (this.token) {
      config.headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      
      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = response.headers.get('X-RateLimit-Reset');
        throw new Error(`Rate limit exceeded. Try again after ${retryAfter}`);
      }

      // Handle auth errors
      if (response.status === 401) {
        // Clear token and redirect to login
        this.token = null;
        window.location.href = '/login';
        throw new Error('Authentication required');
      }

      // Parse response
      const data = await response.json();

      if (!response.ok) {
        throw new APIError(
          data.message || 'API request failed',
          response.status,
          data.details
        );
      }

      return data;
    } catch (error) {
      // Network errors
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Network error. Please check your connection.');
      }
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // PATCH request
  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Custom error class
class APIError extends Error {
  constructor(message, status, details = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.details = details;
  }
}

// Create API client instance
const apiClient = new APIClient();

// API endpoints
export const api = {
  // Auth endpoints
  auth: {
    login: (credentials) => apiClient.post('/api/auth/login', credentials),
    register: (userData) => apiClient.post('/api/auth/register', userData),
    logout: () => apiClient.post('/api/auth/logout'),
    refreshToken: () => apiClient.post('/api/auth/refresh'),
    resetPassword: (email) => apiClient.post('/api/auth/reset-password', { email }),
  },

  // Transaction endpoints
  transactions: {
    list: (params) => apiClient.get('/api/transactions', params),
    get: (id) => apiClient.get(`/api/transactions/${id}`),
    create: (data) => apiClient.post('/api/transactions', data),
    update: (id, data) => apiClient.put(`/api/transactions/${id}`, data),
    delete: (id) => apiClient.delete(`/api/transactions/${id}`),
    summary: (params) => apiClient.get('/api/transactions/summary', params),
  },

  // Budget endpoints
  budgets: {
    list: () => apiClient.get('/api/budgets'),
    get: (id) => apiClient.get(`/api/budgets/${id}`),
    create: (data) => apiClient.post('/api/budgets', data),
    update: (id, data) => apiClient.put(`/api/budgets/${id}`, data),
    delete: (id) => apiClient.delete(`/api/budgets/${id}`),
    tracking: () => apiClient.get('/api/budgets/tracking'),
  },

  // Goals endpoints
  goals: {
    list: () => apiClient.get('/api/goals'),
    get: (id) => apiClient.get(`/api/goals/${id}`),
    create: (data) => apiClient.post('/api/goals', data),
    update: (id, data) => apiClient.put(`/api/goals/${id}`, data),
    delete: (id) => apiClient.delete(`/api/goals/${id}`),
    updateProgress: (id, amount) => 
      apiClient.patch(`/api/goals/${id}/progress`, { amount }),
  },

  // AI Coach endpoints
  aiCoach: {
    chat: (message) => apiClient.post('/api/ai-coach/chat', { message }),
    getInsights: () => apiClient.get('/api/ai-coach/insights'),
    getRecommendations: () => apiClient.get('/api/ai-coach/recommendations'),
  },

  // Dashboard endpoints
  dashboard: {
    getStats: () => apiClient.get('/api/dashboard/stats'),
    getChartData: (period) => apiClient.get('/api/dashboard/charts', { period }),
    getRecentActivity: () => apiClient.get('/api/dashboard/activity'),
  },

  // Subscription endpoints
  subscriptions: {
    list: () => apiClient.get('/api/subscriptions'),
    create: (data) => apiClient.post('/api/subscriptions', data),
    update: (id, data) => apiClient.put(`/api/subscriptions/${id}`, data),
    delete: (id) => apiClient.delete(`/api/subscriptions/${id}`),
  },

  // User profile endpoints
  profile: {
    get: () => apiClient.get('/api/profile'),
    update: (data) => apiClient.put('/api/profile', data),
    uploadAvatar: (file) => {
      const formData = new FormData();
      formData.append('avatar', file);
      return apiClient.request('/api/profile/avatar', {
        method: 'POST',
        body: formData,
        headers: {}, // Let browser set content-type for FormData
      });
    },
  },
};

// Export the client for direct use if needed
export { apiClient, APIError }; 