import React from 'react';
import { BanknotesIcon } from '@heroicons/react/24/outline';

const Subscriptions = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <BanknotesIcon className="w-8 h-8 text-primary-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
          <p className="text-gray-600">Track and manage your subscriptions</p>
        </div>
      </div>
      
      <div className="card">
        <p className="text-gray-600">Subscription management coming soon...</p>
      </div>
    </div>
  );
};

export default Subscriptions;