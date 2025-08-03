import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useDataPersistence } from '../hooks/useDataPersistence';
import SyncStatus from '../components/ui/SyncStatus';
import { setCurrencySettings } from '../utils/currency';
import { 
  CogIcon, 
  BellIcon, 
  ShieldCheckIcon, 
  CreditCardIcon,
  UserIcon,
  ChartBarIcon,
  MoonIcon,
  SunIcon
} from '@heroicons/react/24/outline';

const Settings = () => {
  const { user } = useAuth();
  
  // Use data persistence hook for settings
  const { 
    data: settings, 
    setData: setSettings, 
    saveData: forceSave,
    isLoading,
    isSaving,
    hasUnsavedChanges,
    lastSaved
  } = useDataPersistence('financeAppSettings', {
    preferences: {
      currency: 'GBP',
      dateFormat: 'DD/MM/YYYY',
      darkMode: false
    },
    notifications: {
      pushNotifications: true,
      emailNotifications: false,
      budgetAlerts: true
    },
    security: {
      dataSharing: false,
      biometricAuth: false
    },
    account: {
      autoSync: true,
      backupFrequency: 'weekly'
    }
  }, {
    componentName: 'Settings',
    autoSave: true,
    debounceMs: 2000
  });

  // Toast notification function
  const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : 
                   type === 'error' ? 'bg-red-500' : 
                   type === 'info' ? 'bg-blue-500' : 'bg-yellow-500';
    
    toast.className = `fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-white shadow-lg ${bgColor} transform transition-all duration-300`;
    toast.innerHTML = `
      <div class="flex items-center space-x-2">
        <span class="text-sm font-medium">${message}</span>
        <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200 text-lg">&times;</button>
      </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
      }
    }, 3000);
  };

  const handleSettingChange = (category, key, value) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value
      }
    };
    
    setSettings(newSettings);
    
    // Show immediate feedback
    if (category === 'preferences' && key === 'currency') {
      showToast(`Currency changed to ${value === 'GBP' ? 'British Pound (£)' : 'US Dollar ($)'}`, 'success');
      // Trigger currency change event
      setCurrencySettings(value);
    } else if (category === 'preferences' && key === 'darkMode') {
      showToast(`Dark mode ${value ? 'enabled' : 'disabled'}`, 'success');
    } else if (category === 'notifications') {
      showToast('Notification preferences updated', 'success');
    } else if (category === 'security') {
      showToast('Security settings updated', 'info');
    } else if (category === 'account') {
      showToast('Account settings updated', 'success');
    } else {
      showToast('Setting updated', 'success');
    }
  };

  const handleManualSave = async () => {
    try {
      await forceSave();
      showToast('Settings saved successfully!', 'success');
    } catch (error) {
      showToast('Failed to save settings. Please try again.', 'error');
      console.error('Save error:', error);
    }
  };

  const settingSections = [
    {
      title: 'Preferences',
      icon: CogIcon,
      category: 'preferences',
      settings: [
        {
          key: 'currency',
          label: 'Currency',
          type: 'select',
          options: [
            { value: 'GBP', label: 'British Pound (£)' },
            { value: 'USD', label: 'US Dollar ($)' }
          ],
          description: 'Choose your preferred currency for all financial displays'
        },
        {
          key: 'dateFormat',
          label: 'Date Format',
          type: 'select',
          options: [
            { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
            { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
            { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
          ],
          description: 'Choose your preferred date format'
        },
        {
          key: 'darkMode',
          label: 'Dark Mode',
          type: 'toggle',
          description: 'Switch between light and dark themes'
        }
      ]
    },
    {
      title: 'Notifications',
      icon: BellIcon,
      category: 'notifications',
      settings: [
        {
          key: 'pushNotifications',
          label: 'Push Notifications',
          type: 'toggle',
          description: 'Receive notifications for important financial events'
        },
        {
          key: 'emailNotifications',
          label: 'Email Notifications',
          type: 'toggle',
          description: 'Receive email updates about your finances'
        },
        {
          key: 'budgetAlerts',
          label: 'Budget Alerts',
          type: 'toggle',
          description: 'Get notified when you\'re approaching budget limits'
        }
      ]
    },
    {
      title: 'Privacy & Security',
      icon: ShieldCheckIcon,
      category: 'security',
      settings: [
        {
          key: 'dataSharing',
          label: 'Data Sharing',
          type: 'toggle',
          description: 'Allow anonymous data sharing for app improvements'
        },
        {
          key: 'biometricAuth',
          label: 'Biometric Authentication',
          type: 'toggle',
          description: 'Use fingerprint or face ID for app access'
        }
      ]
    },
    {
      title: 'Account',
      icon: UserIcon,
      category: 'account',
      settings: [
        {
          key: 'autoSync',
          label: 'Auto Sync',
          type: 'toggle',
          description: 'Automatically sync data across devices'
        },
        {
          key: 'backupFrequency',
          label: 'Backup Frequency',
          type: 'select',
          options: [
            { value: 'daily', label: 'Daily' },
            { value: 'weekly', label: 'Weekly' },
            { value: 'monthly', label: 'Monthly' }
          ],
          description: 'How often to backup your financial data'
        }
      ]
    }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account preferences and app settings</p>
        </div>
        <div className="flex items-center space-x-3">
          <SyncStatus />
          <button
            onClick={handleManualSave}
            disabled={isSaving || !hasUnsavedChanges}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isSaving || !hasUnsavedChanges
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Last Saved Info */}
      {lastSaved && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-700">
            Last saved: {new Date(lastSaved).toLocaleString()}
          </p>
        </div>
      )}

      {/* Settings Sections */}
      <div className="space-y-8">
        {settingSections.map((section) => (
          <div key={section.title} className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <section.icon className="w-6 h-6 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {section.settings.map((setting) => (
                <div key={setting.key} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-sm font-medium text-gray-900">{setting.label}</h3>
                      {settings[section.category]?.[setting.key] !== undefined && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          {settings[section.category][setting.key] ? 'Enabled' : 'Disabled'}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{setting.description}</p>
                  </div>
                  <div className="ml-6">
                    {setting.type === 'toggle' && (
                      <button
                        onClick={() => handleSettingChange(section.category, setting.key, !settings[section.category]?.[setting.key])}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings[section.category]?.[setting.key] ? 'bg-primary-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings[section.category]?.[setting.key] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    )}
                    {setting.type === 'select' && (
                      <select
                        value={settings[section.category]?.[setting.key] || ''}
                        onChange={(e) => handleSettingChange(section.category, setting.key, e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      >
                        {setting.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Export/Import Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <ChartBarIcon className="w-6 h-6 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Data Management</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Export Data</h3>
              <p className="text-sm text-gray-500">Download your financial data as a JSON file</p>
            </div>
            <button className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors">
              Export
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Import Data</h3>
              <p className="text-sm text-gray-500">Import financial data from a JSON file</p>
            </div>
            <button className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors">
              Import
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-lg">
        <div className="p-6 border-b border-red-200">
          <div className="flex items-center space-x-3">
            <ShieldCheckIcon className="w-6 h-6 text-red-600" />
            <h2 className="text-lg font-semibold text-red-900">Danger Zone</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-red-900">Delete Account</h3>
              <p className="text-sm text-red-600">Permanently delete your account and all data</p>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;