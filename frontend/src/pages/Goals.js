import React, { useState, useEffect } from 'react';
import { PlusIcon, FlagIcon, CalendarIcon, CurrencyPoundIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '0',
    targetDate: '',
    category: '',
    description: ''
  });

  // Mock goals data
  useEffect(() => {
    const mockGoals = [
      {
        id: 1,
        name: 'Emergency Fund',
        targetAmount: 5000,
        currentAmount: 3200,
        targetDate: '2024-06-15',
        category: 'Emergency',
        description: 'Build a 6-month emergency fund',
        progress: 64,
        status: 'on-track'
      },
      {
        id: 2,
        name: 'Holiday to Spain',
        targetAmount: 2500,
        currentAmount: 1800,
        targetDate: '2024-08-20',
        category: 'Travel',
        description: 'Summer holiday with family',
        progress: 72,
        status: 'on-track'
      },
      {
        id: 3,
        name: 'New Car',
        targetAmount: 15000,
        currentAmount: 8500,
        targetDate: '2025-03-10',
        category: 'Vehicle',
        description: 'Down payment for a new car',
        progress: 57,
        status: 'behind'
      }
    ];
    setGoals(mockGoals);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'on-track':
        return 'text-success-600 bg-success-100';
      case 'behind':
        return 'text-warning-600 bg-warning-100';
      case 'ahead':
        return 'text-primary-600 bg-primary-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-success-500';
    if (progress >= 60) return 'bg-primary-500';
    if (progress >= 40) return 'bg-warning-500';
    return 'bg-danger-500';
  };

  const handleAddGoal = () => {
    if (newGoal.name && newGoal.targetAmount && newGoal.targetDate) {
      const progress = Math.round((parseFloat(newGoal.currentAmount) / parseFloat(newGoal.targetAmount)) * 100);
      const status = progress >= 80 ? 'ahead' : progress >= 60 ? 'on-track' : 'behind';
      
      const goal = {
        id: Date.now(),
        name: newGoal.name,
        targetAmount: parseFloat(newGoal.targetAmount),
        currentAmount: parseFloat(newGoal.currentAmount),
        targetDate: newGoal.targetDate,
        category: newGoal.category,
        description: newGoal.description,
        progress,
        status
      };
      
      setGoals([...goals, goal]);
      setNewGoal({
        name: '',
        targetAmount: '',
        currentAmount: '0',
        targetDate: '',
        category: '',
        description: ''
      });
      setShowAddModal(false);
    }
  };

  const updateGoalProgress = (goalId, newAmount) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const progress = Math.round((newAmount / goal.targetAmount) * 100);
        const status = progress >= 80 ? 'ahead' : progress >= 60 ? 'on-track' : 'behind';
        return { ...goal, currentAmount: newAmount, progress, status };
      }
      return goal;
    }));
  };

  const goalCategories = [
    'Emergency', 'Travel', 'Vehicle', 'Home', 'Education', 
    'Investment', 'Wedding', 'Business', 'Other'
  ];

  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrent = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const overallProgress = totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Goals</h1>
          <p className="text-gray-600">Set and track your financial goals</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center cursor-pointer"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Goal
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <FlagIcon className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Goals</p>
              <p className="text-2xl font-bold text-gray-900">{goals.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-success-100 rounded-lg">
              <CurrencyPoundIcon className="w-6 h-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Target</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalTarget)}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-warning-100 rounded-lg">
              <CurrencyPoundIcon className="w-6 h-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Saved</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCurrent)}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-info-100 rounded-lg">
              <FlagIcon className="w-6 h-6 text-info-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overall Progress</p>
              <p className="text-2xl font-bold text-gray-900">{overallProgress}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Goals List */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Goals</h2>
        <div className="space-y-6">
          {goals.map((goal) => (
            <div key={goal.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{goal.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(goal.status)}`}>
                      {goal.category}
                    </span>
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      {formatDate(goal.targetDate)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                  </p>
                  <p className="text-sm text-gray-500">{goal.progress}% complete</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div
                  className={`h-3 rounded-full ${getProgressColor(goal.progress)}`}
                  style={{ width: `${Math.min(goal.progress, 100)}%` }}
                ></div>
              </div>

              {/* Update Progress */}
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Update Progress:</label>
                <input
                  type="number"
                  placeholder="New amount"
                  className="input-field w-32"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const newAmount = parseFloat(e.target.value);
                      if (!isNaN(newAmount)) {
                        updateGoalProgress(goal.id, newAmount);
                        e.target.value = '';
                      }
                    }
                  }}
                />
                <span className="text-sm text-gray-500">Press Enter to update</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add Financial Goal</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Goal Name</label>
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                  className="input-field w-full"
                  placeholder="e.g., Emergency Fund"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                  className="input-field w-full"
                  rows="3"
                  placeholder="Describe your goal..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount (£)</label>
                <input
                  type="number"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                  className="input-field w-full"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Amount (£)</label>
                <input
                  type="number"
                  value={newGoal.currentAmount}
                  onChange={(e) => setNewGoal({...newGoal, currentAmount: e.target.value})}
                  className="input-field w-full"
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
                  className="input-field w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                  className="input-field w-full"
                >
                  <option value="">Select category</option>
                  {goalCategories.map(category => (
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
                onClick={handleAddGoal}
                className="flex-1 btn-primary"
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