import React from 'react';
import { CogIcon } from '@heroicons/react/24/outline';

const Settings = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <CogIcon className="w-8 h-8 text-primary-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>
      </div>
      
      <div className="card">
        <p className="text-gray-600">Settings management coming soon...</p>
      </div>
    </div>
  );
};

export default Settings;