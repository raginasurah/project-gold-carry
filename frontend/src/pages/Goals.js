import React from 'react';
import { FlagIcon } from '@heroicons/react/24/outline';

const Goals = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <FlagIcon className="w-8 h-8 text-primary-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Goals</h1>
          <p className="text-gray-600">Set and track your financial goals</p>
        </div>
      </div>
      
      <div className="card">
        <p className="text-gray-600">Goals management coming soon...</p>
      </div>
    </div>
  );
};

export default Goals;