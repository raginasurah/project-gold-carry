import React from 'react';
import { SparklesIcon } from '@heroicons/react/24/outline';

const Investments = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <SparklesIcon className="w-8 h-8 text-primary-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Investments</h1>
          <p className="text-gray-600">Track and manage your investment portfolio</p>
        </div>
      </div>
      
      <div className="card">
        <p className="text-gray-600">Investment tracking coming soon...</p>
      </div>
    </div>
  );
};

export default Investments;