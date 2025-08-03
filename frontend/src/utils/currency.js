import React from 'react';

// Currency utility functions
export const getCurrencySettings = () => {
  const settings = localStorage.getItem('financeAppSettings');
  if (settings) {
    try {
      const parsed = JSON.parse(settings);
      return {
        currency: parsed.preferences?.currency || 'GBP',
        locale: parsed.preferences?.currency === 'USD' ? 'en-US' : 'en-GB'
      };
    } catch (error) {
      console.error('Error parsing currency settings:', error);
    }
  }
  
  // Default fallback
  return {
    currency: 'GBP',
    locale: 'en-GB'
  };
};

export const formatCurrency = (amount, options = {}) => {
  const { currency, locale } = getCurrencySettings();
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      ...options
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    // Fallback formatting
    const symbol = currency === 'USD' ? '$' : '£';
    return `${symbol}${amount.toFixed(2)}`;
  }
};

export const setCurrencySettings = (currency) => {
  const settings = JSON.parse(localStorage.getItem('financeAppSettings') || '{}');
  
  if (!settings.preferences) {
    settings.preferences = {};
  }
  
  settings.preferences.currency = currency;
  localStorage.setItem('financeAppSettings', JSON.stringify(settings));
  
  // Trigger a custom event to notify components
  window.dispatchEvent(new CustomEvent('currencyChanged', { detail: { currency } }));
};

export const getCurrencySymbol = (currency = null) => {
  const curr = currency || getCurrencySettings().currency;
  return curr === 'USD' ? '$' : '£';
};

// Hook for components to listen to currency changes
export const useCurrencyListener = (callback) => {
  React.useEffect(() => {
    const handleCurrencyChange = (event) => {
      callback(event.detail.currency);
    };
    
    window.addEventListener('currencyChanged', handleCurrencyChange);
    return () => window.removeEventListener('currencyChanged', handleCurrencyChange);
  }, [callback]);
};