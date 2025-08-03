import React, { useState, useEffect } from 'react';
import { formatCurrency, useCurrencyListener } from '../utils/currency';
import { 
  PlusIcon, 
  CreditCardIcon, 
  CalendarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState('GBP');

  // Listen for currency changes
  useCurrencyListener((newCurrency) => {
    setCurrentCurrency(newCurrency);
  });

  const [newSubscription, setNewSubscription] = useState({
    name: '',
    amount: '',
    billingCycle: 'monthly',
    category: 'entertainment',
    nextBillingDate: '',
    description: ''
  });

  // Mock subscriptions data - replace with real API data
  useEffect(() => {
    const mockSubscriptions = [
      {
        id: 1,
        name: 'Netflix',
        amount: 12.99,
        billingCycle: 'monthly',
        category: 'entertainment',
        nextBillingDate: '2024-02-15',
        description: 'Streaming service',
        status: 'active',
        startDate: '2023-01-15'
      },
      {
        id: 2,
        name: 'Spotify Premium',
        amount: 9.99,
        billingCycle: 'monthly',
        category: 'entertainment',
        nextBillingDate: '2024-02-10',
        description: 'Music streaming',
        status: 'active',
        startDate: '2022-06-01'
      },
      {
        id: 3,
        name: 'Adobe Creative Cloud',
        amount: 52.99,
        billingCycle: 'monthly',
        category: 'software',
        nextBillingDate: '2024-02-20',
        description: 'Design software suite',
        status: 'active',
        startDate: '2023-03-01'
      },
      {
        id: 4,
        name: 'Gym Membership',
        amount: 45.00,
        billingCycle: 'monthly',
        category: 'health',
        nextBillingDate: '2024-02-01',
        description: 'Fitness center membership',
        status: 'active',
        startDate: '2023-08-01'
      },
      {
        id: 5,
        name: 'Amazon Prime',
        amount: 95.00,
        billingCycle: 'yearly',
        category: 'shopping',
        nextBillingDate: '2024-11-15',
        description: 'Prime membership',
        status: 'active',
        startDate: '2023-11-15'
      }
    ];
    setSubscriptions(mockSubscriptions);
  }, []);

  const categories = [
    { value: 'entertainment', label: 'Entertainment', color: 'bg-purple-500' },
    { value: 'software', label: 'Software', color: 'bg-blue-500' },
    { value: 'health', label: 'Health & Fitness', color: 'bg-green-500' },
    { value: 'shopping', label: 'Shopping', color: 'bg-orange-500' },
    { value: 'productivity', label: 'Productivity', color: 'bg-indigo-500' },
    { value: 'education', label: 'Education', color: 'bg-red-500' }
  ];

  const billingCycles = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  const getCategoryColor = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.color : 'bg-gray-500';
  };

  const getCategoryLabel = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.label : 'Other';
  };

  const getDaysUntilBilling = (nextBillingDate) => {
    const today = new Date();
    const billingDate = new Date(nextBillingDate);
    const diffTime = billingDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getBillingStatus = (nextBillingDate) => {
    const daysUntil = getDaysUntilBilling(nextBillingDate);
    if (daysUntil < 0) return 'overdue';
    if (daysUntil <= 7) return 'upcoming';
    return 'normal';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-success-600 bg-success-100';
      case 'paused':
        return 'text-warning-600 bg-warning-100';
      case 'cancelled':
        return 'text-danger-600 bg-danger-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getBillingStatusColor = (status) => {
    switch (status) {
      case 'overdue':
        return 'text-danger-600 bg-danger-100';
      case 'upcoming':
        return 'text-warning-600 bg-warning-100';
      default:
        return 'text-success-600 bg-success-100';
    }
  };

  const calculateMonthlyCost = (amount, billingCycle) => {
    switch (billingCycle) {
      case 'monthly':
        return amount;
      case 'quarterly':
        return amount / 3;
      case 'yearly':
        return amount / 12;
      default:
        return amount;
    }
  };

  const calculateYearlyCost = (amount, billingCycle) => {
    switch (billingCycle) {
      case 'monthly':
        return amount * 12;
      case 'quarterly':
        return amount * 4;
      case 'yearly':
        return amount;
      default:
        return amount;
    }
  };

  const handleAddSubscription = () => {
    if (newSubscription.name && newSubscription.amount && newSubscription.nextBillingDate) {
      const subscription = {
        id: Date.now(),
        name: newSubscription.name,
        amount: parseFloat(newSubscription.amount),
        billingCycle: newSubscription.billingCycle,
        category: newSubscription.category,
        nextBillingDate: newSubscription.nextBillingDate,
        description: newSubscription.description,
        status: 'active',
        startDate: new Date().toISOString().split('T')[0]
      };
      setSubscriptions([...subscriptions, subscription]);
      setNewSubscription({
        name: '',
        amount: '',
        billingCycle: 'monthly',
        category: 'entertainment',
        nextBillingDate: '',
        description: ''
      });
      setShowAddModal(false);
    }
  };

  const toggleSubscriptionStatus = (subscriptionId) => {
    setSubscriptions(subscriptions.map(sub => {
      if (sub.id === subscriptionId) {
        const newStatus = sub.status === 'active' ? 'paused' : 'active';
        return { ...sub, status: newStatus };
      }
      return sub;
    }));
  };

  const deleteSubscription = (subscriptionId) => {
    setSubscriptions(subscriptions.filter(sub => sub.id !== subscriptionId));
  };

  const totalMonthlyCost = subscriptions
    .filter(sub => sub.status === 'active')
    .reduce((sum, sub) => sum + calculateMonthlyCost(sub.amount, sub.billingCycle), 0);

  const totalYearlyCost = subscriptions
    .filter(sub => sub.status === 'active')
    .reduce((sum, sub) => sum + calculateYearlyCost(sub.amount, sub.billingCycle), 0);

  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active');
  const upcomingBillings = subscriptions.filter(sub => 
    sub.status === 'active' && getBillingStatus(sub.nextBillingDate) === 'upcoming'
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Subscriptions</h1>
        <p className="text-primary-100">
          Track and manage your recurring payments
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
              <p className="text-2xl font-bold text-gray-900">{activeSubscriptions.length}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-lg">
              <CreditCardIcon className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Cost</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalMonthlyCost)}</p>
            </div>
            <div className="p-3 bg-success-100 rounded-lg">
              <CalendarIcon className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Yearly Cost</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalYearlyCost)}</p>
            </div>
            <div className="p-3 bg-warning-100 rounded-lg">
              <ClockIcon className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Bills</p>
              <p className="text-2xl font-bold text-gray-900">{upcomingBillings.length}</p>
            </div>
            <div className="p-3 bg-danger-100 rounded-lg">
              <ExclamationTriangleIcon className="w-6 h-6 text-danger-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Subscriptions List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Your Subscriptions</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Subscription</span>
          </button>
        </div>
        <div className="divide-y divide-gray-200">
          {subscriptions.map((subscription) => {
            const billingStatus = getBillingStatus(subscription.nextBillingDate);
            const daysUntil = getDaysUntilBilling(subscription.nextBillingDate);
            
            return (
              <div key={subscription.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-3 h-3 rounded-full ${getCategoryColor(subscription.category)}`}></div>
                      <h3 className="text-lg font-semibold text-gray-900">{subscription.name}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                        {subscription.status}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getBillingStatusColor(billingStatus)}`}>
                        {billingStatus === 'overdue' ? 'Overdue' : 
                         billingStatus === 'upcoming' ? `${daysUntil} days` : 'Normal'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{subscription.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="text-lg font-semibold text-gray-900">{formatCurrency(subscription.amount)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Billing Cycle</p>
                        <p className="text-lg font-semibold text-gray-900 capitalize">{subscription.billingCycle}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Monthly Cost</p>
                        <p className="text-lg font-semibold text-gray-900">{formatCurrency(calculateMonthlyCost(subscription.amount, subscription.billingCycle))}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Next Billing</p>
                        <p className="text-lg font-semibold text-gray-900">{new Date(subscription.nextBillingDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="capitalize">{getCategoryLabel(subscription.category)}</span>
                      <span>Started: {new Date(subscription.startDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col space-y-2">
                    <button
                      onClick={() => toggleSubscriptionStatus(subscription.id)}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        subscription.status === 'active' 
                          ? 'bg-warning-100 text-warning-700 hover:bg-warning-200' 
                          : 'bg-success-100 text-success-700 hover:bg-success-200'
                      }`}
                    >
                      {subscription.status === 'active' ? 'Pause' : 'Activate'}
                    </button>
                    <button
                      onClick={() => deleteSubscription(subscription.id)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Subscription Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Subscription</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                <input
                  type="text"
                  value={newSubscription.name}
                  onChange={(e) => setNewSubscription({...newSubscription, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Netflix"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  value={newSubscription.amount}
                  onChange={(e) => setNewSubscription({...newSubscription, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Billing Cycle</label>
                <select
                  value={newSubscription.billingCycle}
                  onChange={(e) => setNewSubscription({...newSubscription, billingCycle: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {billingCycles.map(cycle => (
                    <option key={cycle.value} value={cycle.value}>{cycle.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newSubscription.category}
                  onChange={(e) => setNewSubscription({...newSubscription, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>{category.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Next Billing Date</label>
                <input
                  type="date"
                  value={newSubscription.nextBillingDate}
                  onChange={(e) => setNewSubscription({...newSubscription, nextBillingDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <input
                  type="text"
                  value={newSubscription.description}
                  onChange={(e) => setNewSubscription({...newSubscription, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Brief description of the service"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSubscription}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Add Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;