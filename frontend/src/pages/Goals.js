import React, { useState, useEffect } from 'react';
import { formatCurrency, useCurrencyListener } from '../utils/currency';
import { 
  PlusIcon, 
  FlagIcon, 
  ArrowTrendingUpIcon, 
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [currentCurrency, setCurrentCurrency] = useState('GBP');

  // Listen for currency changes
  useCurrencyListener((newCurrency) => {
    setCurrentCurrency(newCurrency);
  });

  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
    category: 'savings'
  });

  // Mock goals data - replace with real API data
  useEffect(() => {
    const mockGoals = [
      {
        id: 1,
        name: 'Emergency Fund',
        targetAmount: 5000,
        currentAmount: 3200,
        targetDate: '2024-06-30',
        category: 'savings',
        status: 'in_progress'
      },
      {
        id: 2,
        name: 'Vacation Fund',
        targetAmount: 3000,
        currentAmount: 3000,
        targetDate: '2024-03-15',
        category: 'travel',
        status: 'completed'
      },
      {
        id: 3,
        name: 'New Car',
        targetAmount: 15000,
        currentAmount: 8500,
        targetDate: '2024-12-31',
        category: 'vehicle',
        status: 'in_progress'
      },
      {
        id: 4,
        name: 'Home Down Payment',
        targetAmount: 50000,
        currentAmount: 12500,
        targetDate: '2025-06-30',
        category: 'housing',
        status: 'in_progress'
      }
    ];
    setGoals(mockGoals);
  }, []);

  const categories = [
    { value: 'savings', label: 'Savings', color: 'bg-blue-500' },
    { value: 'travel', label: 'Travel', color: 'bg-green-500' },
    { value: 'vehicle', label: 'Vehicle', color: 'bg-purple-500' },
    { value: 'housing', label: 'Housing', color: 'bg-orange-500' },
    { value: 'education', label: 'Education', color: 'bg-red-500' },
    { value: 'business', label: 'Business', color: 'bg-indigo-500' }
  ];

  const getCategoryColor = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.color : 'bg-gray-500';
  };

  const getCategoryLabel = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.label : 'Other';
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success-600 bg-success-100';
      case 'in_progress':
        return 'text-primary-600 bg-primary-100';
      case 'overdue':
        return 'text-danger-600 bg-danger-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-success-600" />;
      case 'in_progress':
        return <ArrowTrendingUpIcon className="w-5 h-5 text-primary-600" />;
      case 'overdue':
        return <ExclamationTriangleIcon className="w-5 h-5 text-danger-600" />;
      default:
        return <FlagIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  const getDaysRemaining = (targetDate) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleAddGoal = () => {
    if (newGoal.name && newGoal.targetAmount && newGoal.targetDate) {
      const goal = {
        id: Date.now(),
        name: newGoal.name,
        targetAmount: parseFloat(newGoal.targetAmount),
        currentAmount: parseFloat(newGoal.currentAmount) || 0,
        targetDate: newGoal.targetDate,
        category: newGoal.category,
        status: 'in_progress'
      };
      setGoals([...goals, goal]);
      setNewGoal({
        name: '',
        targetAmount: '',
        currentAmount: '',
        targetDate: '',
        category: 'savings'
      });
      setShowAddModal(false);
    }
  };

  const updateGoalProgress = (goalId, newAmount) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const updatedGoal = { ...goal, currentAmount: newAmount };
        if (newAmount >= goal.targetAmount) {
          updatedGoal.status = 'completed';
        }
        return updatedGoal;
      }
      return goal;
    }));
  };

  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrent = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const overallProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Financial Goals</h1>
        <p className="text-primary-100">
          Set and track your financial milestones
        </p>
      </div>

      {/* Overall Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Target</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalTarget)}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-lg">
                              <FlagIcon className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Saved</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCurrent)}</p>
            </div>
            <div className="p-3 bg-success-100 rounded-lg">
                              <ArrowTrendingUpIcon className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
          <span className="text-sm font-medium text-gray-600">{overallProgress.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>{formatCurrency(totalCurrent)} saved</span>
          <span>{formatCurrency(totalTarget - totalCurrent)} remaining</span>
        </div>
      </div>

      {/* Goals List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Your Goals</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Goal</span>
          </button>
        </div>
        <div className="divide-y divide-gray-200">
          {goals.map((goal) => (
            <div key={goal.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`w-3 h-3 rounded-full ${getCategoryColor(goal.category)}`}></div>
                    <h3 className="text-lg font-semibold text-gray-900">{goal.name}</h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                      {goal.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Target Amount</p>
                      <p className="text-lg font-semibold text-gray-900">{formatCurrency(goal.targetAmount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Current Amount</p>
                      <p className="text-lg font-semibold text-gray-900">{formatCurrency(goal.currentAmount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Progress</p>
                      <p className="text-lg font-semibold text-gray-900">{getProgressPercentage(goal.currentAmount, goal.targetAmount).toFixed(1)}%</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        goal.status === 'completed' ? 'bg-success-500' : 'bg-primary-500'
                      }`}
                      style={{ width: `${getProgressPercentage(goal.currentAmount, goal.targetAmount)}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}</span>
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{getDaysRemaining(goal.targetDate)} days left</span>
                      </span>
                      <span className="capitalize">{getCategoryLabel(goal.category)}</span>
                    </div>
                  </div>
                </div>

                <div className="ml-4">
                  {getStatusIcon(goal.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Goal</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Goal Name</label>
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Emergency Fund"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount</label>
                <input
                  type="number"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Amount (Optional)</label>
                <input
                  type="number"
                  value={newGoal.currentAmount}
                  onChange={(e) => setNewGoal({...newGoal, currentAmount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
                <input
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>{category.label}</option>
                  ))}
                </select>
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
                onClick={handleAddGoal}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Add Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;