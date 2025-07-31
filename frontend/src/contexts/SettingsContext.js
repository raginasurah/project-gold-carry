import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrencySettings, setCurrencySettings } from '../utils/currency';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    profile: {
      firstName: 'Rinoz',
      lastName: 'Razick',
      email: 'rinoz@example.com',
      phone: '+44 123 456 7890'
    },
    notifications: {
      budgetAlerts: true,
      weeklyReports: true,
      pushNotifications: false,
      emailNotifications: true,
      smsNotifications: false
    },
    security: {
      twoFactor: false,
      loginAlerts: true,
      sessionTimeout: 30
    },
    preferences: {
      currency: 'GBP',
      dateFormat: 'DD/MM/YYYY',
      darkMode: false,
      privacyMode: false,
      budgetingMethod: '50/30/20'
    }
  });

  const [saveStatus, setSaveStatus] = useState('');

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('financeAppSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prevSettings => ({
          ...prevSettings,
          ...parsed
        }));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('financeAppSettings', JSON.stringify(settings));
    
    // Apply dark mode immediately
    if (settings.preferences?.darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }

    // Trigger currency change event
    if (settings.preferences?.currency) {
      window.dispatchEvent(new CustomEvent('currencyChanged', { 
        detail: { currency: settings.preferences.currency } 
      }));
    }
  }, [settings]);

  const updateSetting = (category, key, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [category]: {
        ...prevSettings[category],
        [key]: value
      }
    }));

    // Show save status
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
    }, 500);
  };

  const showToast = (message, type = 'success') => {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-white ${
      type === 'success' ? 'bg-green-500' : 
      type === 'error' ? 'bg-red-500' : 
      'bg-blue-500'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3000);
  };

  const exportSettings = () => {
    try {
      const dataToExport = {
        settings,
        exportDate: new Date().toISOString(),
        version: '1.0',
        user: settings.profile.firstName + ' ' + settings.profile.lastName
      };
      
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `finance-app-settings-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showToast('Settings exported successfully!');
      return true;
    } catch (error) {
      console.error('Export failed:', error);
      showToast('Export failed. Please try again.', 'error');
      return false;
    }
  };

  const value = {
    settings,
    updateSetting,
    saveStatus,
    showToast,
    exportSettings,
    // Currency helpers
    formatCurrency: (amount) => {
      const { currency } = getCurrencySettings();
      const locale = currency === 'USD' ? 'en-US' : 'en-GB';
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    }
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};