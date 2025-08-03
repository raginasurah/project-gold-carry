import React, { useState, useEffect } from 'react';
import { formatCurrency, useCurrencyListener } from '../utils/currency';
import { BUDGETING_METHODS } from '../utils/budgetingMethods';
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const Budget = () => {
  const [selectedMethod, setSelectedMethod] = useState('50/30/20');
  const [monthlyIncome, setMonthlyIncome] = useState(3200);
  const [currentCurrency, setCurrentCurrency] = useState('GBP');

  // Listen for currency changes
  useCurrencyListener((newCurrency) => {
    setCurrentCurrency(newCurrency);
  });

  const method = BUDGETING_METHODS[selectedMethod];

  // Calculate allocations based on income
  const calculateAllocations = () => {
    return method.categories.map(category => ({
      ...category,
      amount: (monthlyIncome * category.percentage) / 100
    }));
  };

  const allocations = calculateAllocations();

  // Mock budget data - replace with real API data
  const budgetData = {
    food: { budget: 450, spent: 380, remaining: 70 },
    transport: { budget: 300, spent: 320, remaining: -20 },
    entertainment: { budget: 200, spent: 150, remaining: 50 },
    utilities: { budget: 150, spent: 145, remaining: 5 },
    housing: { budget: 1200, spent: 1200, remaining: 0 }
  };

  const chartData = allocations.map(allocation => ({
    name: allocation.name,
    value: allocation.amount,
    color: allocation.color
  }));

  const getStatusColor = (remaining) => {
    if (remaining >= 0) return 'text-success-600';
    return 'text-danger-600';
  };

  const getStatusIcon = (remaining) => {
    if (remaining >= 0) return <CheckCircleIcon className="w-5 h-5 text-success-600" />;
    return <ExclamationTriangleIcon className="w-5 h-5 text-danger-600" />;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Budget Planning</h1>
        <p className="text-primary-100">
          Choose your budgeting method and track your spending
        </p>
      </div>

      {/* Budgeting Method Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Method</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(BUDGETING_METHODS).map(([key, method]) => (
            <div
              key={key}
              onClick={() => setSelectedMethod(key)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedMethod === key
                  ? `border-${method.theme.primary}-500 bg-${method.theme.bg}`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{method.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{method.name}</h3>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Income Input */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Income</h2>
        <div className="flex items-center space-x-4">
          <input
            type="number"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(parseFloat(e.target.value) || 0)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter your monthly income"
          />
          <span className="text-gray-600 font-medium">
            {formatCurrency(monthlyIncome)}
          </span>
        </div>
      </div>

      {/* Method Rules */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Method Rules</h2>
        <div className="space-y-2">
          {method.rules.map((rule, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
              <p className="text-gray-700">{rule}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Budget Allocation Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Budget Allocation</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Allocation Details</h2>
          <div className="space-y-4">
            {allocations.map((allocation) => (
              <div key={allocation.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${allocation.color}`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{allocation.name}</p>
                    <p className="text-sm text-gray-500">{allocation.percentage}%</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(allocation.amount)}</p>
                  <div className="text-xs text-gray-500 mt-1">
                    {allocation.examples.slice(0, 2).join(', ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current Budget Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Budget Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(budgetData).map(([category, budget]) => (
            <div key={category} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900 capitalize">{category}</h3>
                {getStatusIcon(budget.remaining)}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Budget:</span>
                  <span className="font-medium">{formatCurrency(budget.budget)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Spent:</span>
                  <span className="font-medium">{formatCurrency(budget.spent)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Remaining:</span>
                  <span className={`font-medium ${getStatusColor(budget.remaining)}`}>
                    {formatCurrency(budget.remaining)}
                  </span>
                </div>
                {budget.remaining < 0 && (
                  <div className="mt-2 p-2 bg-danger-50 border border-danger-200 rounded text-xs text-danger-700">
                    ⚠️ You're over budget by {formatCurrency(budget.spent - budget.budget)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Budget;