const config = {
  // Development
  development: {
    apiUrl: 'http://localhost:8000'
  },
  // Production
  production: {
    apiUrl: process.env.REACT_APP_API_URL || 'https://your-railway-app.up.railway.app'
  }
};

const environment = process.env.NODE_ENV || 'development';
export const API_BASE_URL = config[environment].apiUrl;

// Debug logging
console.log('Environment:', environment);
console.log('API Base URL:', API_BASE_URL);
console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL); 