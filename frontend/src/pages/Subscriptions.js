import React, { useState, useEffect } from 'react';
import { PlusIcon, CalendarIcon, CurrencyPoundIcon, XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubscription, setNewSubscription] = useState({
    name: '',
    amount: '',
    billingCycle: 'monthly',
    category: '',
    nextBillingDate: '',
    description: ''
  });

  // Mock subscriptions data
  useEffect(() => {
    const mockSubscriptions = [
      {
        id: 1,
        name: 'Netflix',
        amount: 12.99,
        billingCycle: 'monthly',
        category: 'Entertainment',
        nextBillingDate: '2024-02-15',
        description: 'Premium streaming service',
        status: 'active',
        daysUntilRenewal: 5
      },
      {
        id: 2,
        name: 'Spotify Premium',
        amount: 9.99,
        billingCycle: 'monthly',
        category: 'Entertainment',
        nextBillingDate: '2024-02-20',
        description: 'Music streaming service',
        status: 'active',
        daysUntilRenewal: 10
      },
      {
        id: 3,
        name: 'Amazon Prime',
        amount: 8.99,
        billingCycle: 'monthly',
        category: 'Shopping',
        nextBillingDate: '2024-02-25',
        description: 'Prime membership with free shipping',
        status: 'active',
        daysUntilRenewal: 15
      },
      {
        id: 4,
        name: 'Gym Membership',
        amount: 45.00,
        billingCycle: 'monthly',
        category: 'Health & Fitness',
        nextBillingDate: '2024-02-28',
        description: 'Local gym membership',
        status: 'active',
        daysUntilRenewal: 18
      }
    ];
    setSubscriptions(mockSubscriptions);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getRenewalStatus = (daysUntilRenewal) => {
    if (daysUntilRenewal <= 3) return 'urgent';
    if (daysUntilRenewal <= 7) return 'warning';
    return 'normal';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'urgent':
        return 'text-danger-600 bg-danger-100';
      case 'warning':
        return 'text-warning-600 bg-warning-100';
      case 'normal':
        return 'text-success-600 bg-success-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleAddSubscription = () => {
    if (newSubscription.name && newSubscription.amount && newSubscription.nextBillingDate) {
      const today = new Date();
      const nextBilling = new Date(newSubscription.nextBillingDate);
      const daysUntilRenewal = Math.ceil((nextBilling - today) / (1000 * 60 * 60 * 24));
      
      const subscription = {
        id: Date.now(),
        name: newSubscription.name,
        amount: parseFloat(newSubscription.amount),
        billingCycle: newSubscription.billingCycle,
        category: newSubscription.category,
        nextBillingDate: newSubscription.nextBillingDate,
        description: newSubscription.description,
        status: 'active',
        daysUntilRenewal
      };
      
      setSubscriptions([...subscriptions, subscription]);
      setNewSubscription({
        name: '',
        amount: '',
        billingCycle: 'monthly',
        category: '',
        nextBillingDate: '',
        description: ''
      });
      setShowAddModal(false);
    }
  };

  const cancelSubscription = (id) => {
    setSubscriptions(subscriptions.map(sub => 
      sub.id === id ? { ...sub, status: 'cancelled' } : sub
    ));
  };

  const subscriptionCategories = [
    'Entertainment', 'Shopping', 'Health & Fitness', 'Software', 
    'Food & Dining', 'Transportation', 'Education', 'Other'
  ];

  const billingCycles = ['monthly', 'quarterly', 'yearly'];

  const totalMonthlyCost = subscriptions
    .filter(sub => sub.status === 'active')
    .reduce((sum, sub) => {
      if (sub.billingCycle === 'monthly') return sum + sub.amount;
      if (sub.billingCycle === 'quarterly') return sum + (sub.amount / 3);
      if (sub.billingCycle === 'yearly') return sum + (sub.amount / 12);
      return sum;
    }, 0);

  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active');
  const urgentRenewals = subscriptions.filter(sub => 
    sub.status === 'active' && sub.daysUntilRenewal <= 7
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
          <p className="text-gray-600">Track and manage your subscriptions</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center cursor-pointer"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Subscription
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <CurrencyPoundIcon className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Monthly Cost</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalMonthlyCost)}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-success-100 rounded-lg">
              <CalendarIcon className="w-6 h-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
              <p className="text-2xl font-bold text-gray-900">{activeSubscriptions.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-warning-100 rounded-lg">
              <ExclamationTriangleIcon className="w-6 h-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Renewals This Week</p>
              <p className="text-2xl font-bold text-gray-900">{urgentRenewals.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-info-100 rounded-lg">
              <CurrencyPoundIcon className="w-6 h-6 text-info-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Annual Cost</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalMonthlyCost * 12)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Renewal Alerts */}
      {urgentRenewals.length > 0 && (
        <div className="card bg-warning-50 border-warning-200">
          <h3 className="text-lg font-semibold text-warning-900 mb-3">⚠️ Renewal Alerts</h3>
          <div className="space-y-2">
            {urgentRenewals.map(sub => (
              <div key={sub.id} className="flex justify-between items-center p-3 bg-white rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{sub.name}</p>
                  <p className="text-sm text-gray-600">Renews in {sub.daysUntilRenewal} days</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(sub.amount)}</p>
                  <p className="text-sm text-gray-600">{formatDate(sub.nextBillingDate)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subscriptions List */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Subscriptions</h2>
        <div className="space-y-4">
          {subscriptions.map((subscription) => (
            <div key={subscription.id} className={`border rounded-lg p-4 ${
              subscription.status === 'cancelled' ? 'border-gray-200 bg-gray-50' : 'border-gray-200'
            }`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className={`text-lg font-semibold ${
                      subscription.status === 'cancelled' ? 'text-gray-500' : 'text-gray-900'
                    }`}>
                      {subscription.name}
                    </h3>
                    {subscription.status === 'cancelled' && (
                      <span className="px-2 py-1 text-xs font-medium bg-gray-200 text-gray-600 rounded-full">
                        Cancelled
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{subscription.description}</p>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-600 rounded-full">
                      {subscription.category}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                      {subscription.billingCycle}
                    </span>
                    {subscription.status === 'active' && (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(getRenewalStatus(subscription.daysUntilRenewal))}`}>
                        {subscription.daysUntilRenewal <= 0 ? 'Due today' : 
                         subscription.daysUntilRenewal === 1 ? 'Due tomorrow' :
                         `Renews in ${subscription.daysUntilRenewal} days`}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${
                    subscription.status === 'cancelled' ? 'text-gray-500' : 'text-gray-900'
                  }`}>
                    {formatCurrency(subscription.amount)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(subscription.nextBillingDate)}
                  </p>
                  {subscription.status === 'active' && (
                    <button
                      onClick={() => cancelSubscription(subscription.id)}
                      className="mt-2 text-sm text-danger-600 hover:text-danger-700"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Subscription Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add Subscription</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Name</label>
                <input
                  type="text"
                  value={newSubscription.name}
                  onChange={(e) => setNewSubscription({...newSubscription, name: e.target.value})}
                  className="input-field w-full"
                  placeholder="e.g., Netflix"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newSubscription.description}
                  onChange={(e) => setNewSubscription({...newSubscription, description: e.target.value})}
                  className="input-field w-full"
                  rows="2"
                  placeholder="Brief description..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (£)</label>
                <input
                  type="number"
                  value={newSubscription.amount}
                  onChange={(e) => setNewSubscription({...newSubscription, amount: e.target.value})}
                  className="input-field w-full"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Billing Cycle</label>
                <select
                  value={newSubscription.billingCycle}
                  onChange={(e) => setNewSubscription({...newSubscription, billingCycle: e.target.value})}
                  className="input-field w-full"
                >
                  {billingCycles.map(cycle => (
                    <option key={cycle} value={cycle}>{cycle.charAt(0).toUpperCase() + cycle.slice(1)}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Next Billing Date</label>
                <input
                  type="date"
                  value={newSubscription.nextBillingDate}
                  onChange={(e) => setNewSubscription({...newSubscription, nextBillingDate: e.target.value})}
                  className="input-field w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newSubscription.category}
                  onChange={(e) => setNewSubscription({...newSubscription, category: e.target.value})}
                  className="input-field w-full"
                >
                  <option value="">Select category</option>
                  {subscriptionCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSubscription}
                className="flex-1 btn-primary"
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