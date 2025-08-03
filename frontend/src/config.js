const config = {
  // Development
  development: {
    apiUrl: 'http://localhost:8000'
  },
  // Production
  production: {
    apiUrl: process.env.REACT_APP_API_URL || 'https://project-gold-backend-production-3d89.up.railway.app'
  }
};

const environment = process.env.NODE_ENV || 'development';
export const API_BASE_URL = config[environment].apiUrl; 