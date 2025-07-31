import React, { useState, useEffect } from 'react';
import { PlusIcon, ChartBarIcon, CogIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Budget = () => {
  const [selectedMethod, setSelectedMethod] = useState('50/30/20');
  const [monthlyIncome, setMonthlyIncome] = useState(5000);
  const [budgets, setBudgets] = useState([]);
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category: '',
    budget: '',
    type: 'needs'
  });

  const budgetingMethods = [
    {
      id: '50/30/20',
      name: '50/30/20 Rule',
      description: '50% needs, 30% wants, 20% savings',
      breakdown: {
        needs: 50,
        wants: 30,
        savings: 20
      },
      color: 'primary',
      icon: '📊'
    },
    {
      id: 'Zero-based',
      name: 'Zero-Based Budgeting',
      description: 'Every dollar has a purpose',
      breakdown: {
        needs: 60,
        wants: 25,
        savings: 15
      },
      color: 'success',
      icon: '🎯'
    },
    {
      id: '70/20/10',
      name: '70/20/10 Rule',
      description: '70% living, 20% savings, 10% debt',
      breakdown: {
        needs: 70,
        savings: 20,
        debt: 10
      },
      color: 'warning',
      icon: '💰'
    },
    {
      id: '60%',
      name: '60% Solution',
      description: '60% committed expenses, 40% flexible',
      breakdown: {
        committed: 60,
        flexible: 40
      },
      color: 'info',
      icon: '⚖️'
    }
  ];

  // Mock budget data
  useEffect(() => {
    const mockBudgets = [
      { id: 1, category: 'Housing', budget: 1500, spent: 1500, type: 'needs' },
      { id: 2, category: 'Transportation', budget: 400, spent: 350, type: 'needs' },
      { id: 3, category: 'Food & Dining', budget: 600, spent: 720, type: 'needs' },
      { id: 4, category: 'Entertainment', budget: 300, spent: 250, type: 'wants' },
      { id: 5, category: 'Shopping', budget: 200, spent: 180, type: 'wants' },
      { id: 6, category: 'Savings', budget: 1000, spent: 1000, type: 'savings' },
      { id: 7, category: 'Emergency Fund', budget: 500, spent: 500, type: 'savings' }
    ];
    setBudgets(mockBudgets);
  }, []);

  const getCurrentMethod = () => {
    return budgetingMethods.find(method => method.id === selectedMethod);
  };

  const calculateBudgetAllocation = () => {
    const method = getCurrentMethod();
    const allocation = {};
    
    Object.entries(method.breakdown).forEach(([key, percentage]) => {
      allocation[key] = (monthlyIncome * percentage) / 100;
    });
    
    return allocation;
  };

  const getProgressColor = (spent, budget) => {
    const percentage = (spent / budget) * 100;
    if (percentage >= 90) return 'text-danger-600';
    if (percentage >= 75) return 'text-warning-600';
    return 'text-success-600';
  };

  const getProgressBarColor = (spent, budget) => {
    const percentage = (spent / budget) * 100;
    if (percentage >= 90) return 'bg-danger-500';
    if (percentage >= 75) return 'bg-warning-500';
    return 'bg-success-500';
  };

  const getBudgetAlerts = () => {
    return budgets.filter(budget => {
      const percentage = (budget.spent / budget.budget) * 100;
      return percentage >= 75;
    });
  };

  const getMethodColor = (color) => {
    switch (color) {
      case 'primary': return 'border-primary-500 bg-primary-50';
      case 'success': return 'border-success-500 bg-success-50';
      case 'warning': return 'border-warning-500 bg-warning-50';
      case 'info': return 'border-info-500 bg-info-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const handleAddBudget = () => {
    if (newBudget.category && newBudget.budget) {
      const budget = {
        id: Date.now(),
        category: newBudget.category,
        budget: parseFloat(newBudget.budget),
        spent: 0,
        type: newBudget.type
      };
      setBudgets([...budgets, budget]);
      setNewBudget({
        category: '',
        budget: '',
        type: 'needs'
      });
      setShowAddBudget(false);
    }
  };

  const budgetTypes = ['needs', 'wants', 'savings'];
  const budgetCategories = [
    'Housing', 'Transportation', 'Food & Dining', 'Utilities', 
    'Healthcare', 'Entertainment', 'Shopping', 'Education', 'Savings', 'Emergency Fund'
  ];

  const allocation = calculateBudgetAllocation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Budget Management</h1>
          <p className="text-gray-600">Track and manage your spending with smart budgeting</p>
        </div>
        <button 
          onClick={() => setShowAddBudget(true)}
          className="btn-primary flex items-center cursor-pointer"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Budget
        </button>
      </div>

      {/* Budgeting Method Selection */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Budgeting Method</h2>
          <div className="flex items-center space-x-2">
            <CogIcon className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">Customize</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {budgetingMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                selectedMethod === method.id
                  ? getMethodColor(method.color)
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">{method.icon}</span>
                <h3 className="font-semibold text-gray-900">{method.name}</h3>
              </div>
              <p className="text-sm text-gray-600">{method.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Income Input */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Income</h2>
        <div className="flex items-center space-x-4">
          <input
            type="number"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(Number(e.target.value))}
            className="input-field w-48"
            placeholder="Enter monthly income"
          />
          <span className="text-gray-600">per month</span>
        </div>
      </div>

      {/* Budget Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Allocation Chart */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Budget Allocation</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={Object.entries(allocation).map(([key, value]) => ({ name: key, amount: value }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="amount" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Allocation Breakdown */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Allocation Breakdown</h2>
          <div className="space-y-4">
            {Object.entries(allocation).map(([category, amount]) => (
              <div key={category} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 capitalize">{category}</p>
                  <p className="text-sm text-gray-500">
                    {getCurrentMethod().breakdown[category]}% of income
                  </p>
                </div>
                <p className="font-semibold text-gray-900">{formatCurrency(amount)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Budget Alerts */}
      {getBudgetAlerts().length > 0 && (
        <div className="card bg-warning-50 border-warning-200">
          <h2 className="text-lg font-semibold text-warning-900 mb-4">⚠️ Budget Alerts</h2>
          <div className="space-y-3">
            {getBudgetAlerts().map((budget) => (
              <div key={budget.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{budget.category}</p>
                  <p className="text-sm text-gray-600">
                    {((budget.spent / budget.budget) * 100).toFixed(1)}% of budget used
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-warning-600">
                    {formatCurrency(budget.spent)} / {formatCurrency(budget.budget)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {budget.spent > budget.budget ? 'Over budget' : 'Near limit'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Budget Categories */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Budget Categories</h2>
          <div className="flex items-center space-x-2">
            <ChartBarIcon className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">View Analytics</span>
          </div>
        </div>

        <div className="space-y-4">
          {budgets.map((budget) => (
            <div key={budget.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    budget.type === 'needs' ? 'bg-danger-500' :
                    budget.type === 'wants' ? 'bg-warning-500' : 'bg-success-500'
                  }`}></div>
                  <h3 className="font-medium text-gray-900">{budget.category}</h3>
                  <span className={`badge ${
                    budget.type === 'needs' ? 'badge-danger' :
                    budget.type === 'wants' ? 'badge-warning' : 'badge-success'
                  }`}>
                    {budget.type}
                  </span>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${getProgressColor(budget.spent, budget.budget)}`}>
                    {formatCurrency(budget.spent)} / {formatCurrency(budget.budget)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {((budget.spent / budget.budget) * 100).toFixed(1)}% used
                  </p>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getProgressBarColor(budget.spent, budget.budget)}`}
                  style={{ width: `${Math.min((budget.spent / budget.budget) * 100, 100)}%` }}
                ></div>
              </div>
              
              {budget.spent > budget.budget && (
                <p className="text-sm text-danger-600 mt-2">
                  ⚠️ You're over budget by {formatCurrency(budget.spent - budget.budget)}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Budget Tips */}
      <div className="card bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
        <h3 className="font-semibold text-primary-900 mb-3">💡 Budgeting Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-primary-800">
          <div>
            <p className="font-medium mb-1">• Track every expense</p>
            <p>Use the app to log all your transactions for better insights</p>
          </div>
          <div>
            <p className="font-medium mb-1">• Review weekly</p>
            <p>Check your progress regularly to stay on track</p>
          </div>
          <div>
            <p className="font-medium mb-1">• Adjust as needed</p>
            <p>Life changes, so should your budget</p>
          </div>
          <div>
            <p className="font-medium mb-1">• Emergency fund first</p>
            <p>Prioritize building your emergency fund</p>
          </div>
        </div>
      </div>

      {/* Add Budget Modal */}
      {showAddBudget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add Budget Category</h2>
              <button 
                onClick={() => setShowAddBudget(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newBudget.category}
                  onChange={(e) => setNewBudget({...newBudget, category: e.target.value})}
                  className="input-field w-full"
                >
                  <option value="">Select category</option>
                  {budgetCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Budget Amount</label>
                <input
                  type="number"
                  value={newBudget.budget}
                  onChange={(e) => setNewBudget({...newBudget, budget: e.target.value})}
                  className="input-field w-full"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={newBudget.type}
                  onChange={(e) => setNewBudget({...newBudget, type: e.target.value})}
                  className="input-field w-full"
                >
                  {budgetTypes.map(type => (
                    <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddBudget(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBudget}
                className="flex-1 btn-primary"
              >
                Add Budget
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budget;