import React, { useState, useEffect } from 'react';
import { PlusIcon, UserGroupIcon, CurrencyPoundIcon, XMarkIcon, UserIcon, CogIcon } from '@heroicons/react/24/outline';

const FamilyHub = () => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [sharedBudgets, setSharedBudgets] = useState([]);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'contributor',
    relationship: ''
  });
  const [newBudget, setNewBudget] = useState({
    name: '',
    amount: '',
    category: '',
    description: ''
  });

  // Mock family data
  useEffect(() => {
    const mockFamilyMembers = [
      {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        role: 'co-manager',
        relationship: 'Spouse',
        avatar: 'SJ',
        status: 'active',
        joinedDate: '2024-01-15'
      },
      {
        id: 2,
        name: 'Emma Johnson',
        email: 'emma@example.com',
        role: 'contributor',
        relationship: 'Daughter',
        avatar: 'EJ',
        status: 'active',
        joinedDate: '2024-01-20'
      },
      {
        id: 3,
        name: 'Michael Johnson',
        email: 'michael@example.com',
        role: 'viewer',
        relationship: 'Son',
        avatar: 'MJ',
        status: 'pending',
        joinedDate: '2024-01-25'
      }
    ];

    const mockSharedBudgets = [
      {
        id: 1,
        name: 'Family Groceries',
        amount: 800,
        spent: 650,
        category: 'Food & Dining',
        description: 'Monthly family grocery budget',
        members: ['Sarah Johnson', 'Emma Johnson'],
        status: 'active',
        progress: 81.25
      },
      {
        id: 2,
        name: 'Family Entertainment',
        amount: 300,
        spent: 180,
        category: 'Entertainment',
        description: 'Movies, games, and family activities',
        members: ['Sarah Johnson', 'Emma Johnson', 'Michael Johnson'],
        status: 'active',
        progress: 60
      },
      {
        id: 3,
        name: 'Home Maintenance',
        amount: 500,
        spent: 320,
        category: 'Home',
        description: 'Repairs and maintenance',
        members: ['Sarah Johnson'],
        status: 'active',
        progress: 64
      }
    ];

    setFamilyMembers(mockFamilyMembers);
    setSharedBudgets(mockSharedBudgets);
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

  const getRoleColor = (role) => {
    switch (role) {
      case 'co-manager':
        return 'text-primary-600 bg-primary-100';
      case 'contributor':
        return 'text-success-600 bg-success-100';
      case 'viewer':
        return 'text-warning-600 bg-warning-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'text-success-600 bg-success-100' : 'text-warning-600 bg-warning-100';
  };

  const getProgressColor = (progress) => {
    if (progress >= 90) return 'bg-danger-500';
    if (progress >= 75) return 'bg-warning-500';
    return 'bg-success-500';
  };

  const handleAddMember = () => {
    if (newMember.name && newMember.email) {
      const member = {
        id: Date.now(),
        name: newMember.name,
        email: newMember.email,
        role: newMember.role,
        relationship: newMember.relationship,
        avatar: newMember.name.split(' ').map(n => n[0]).join(''),
        status: 'pending',
        joinedDate: new Date().toISOString().split('T')[0]
      };
      
      setFamilyMembers([...familyMembers, member]);
      setNewMember({
        name: '',
        email: '',
        role: 'contributor',
        relationship: ''
      });
      setShowAddMemberModal(false);
    }
  };

  const handleAddBudget = () => {
    if (newBudget.name && newBudget.amount) {
      const budget = {
        id: Date.now(),
        name: newBudget.name,
        amount: parseFloat(newBudget.amount),
        spent: 0,
        category: newBudget.category,
        description: newBudget.description,
        members: ['Sarah Johnson'], // Default to current user
        status: 'active',
        progress: 0
      };
      
      setSharedBudgets([...sharedBudgets, budget]);
      setNewBudget({
        name: '',
        amount: '',
        category: '',
        description: ''
      });
      setShowAddBudgetModal(false);
    }
  };

  const removeMember = (id) => {
    setFamilyMembers(familyMembers.filter(member => member.id !== id));
  };

  const budgetCategories = [
    'Food & Dining', 'Entertainment', 'Home', 'Transportation', 
    'Education', 'Healthcare', 'Shopping', 'Other'
  ];

  const memberRoles = ['co-manager', 'contributor', 'viewer'];
  const relationships = ['Spouse', 'Child', 'Parent', 'Sibling', 'Other'];

  const totalBudgetAmount = sharedBudgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalBudgetSpent = sharedBudgets.reduce((sum, budget) => sum + budget.spent, 0);
  const overallProgress = totalBudgetAmount > 0 ? (totalBudgetSpent / totalBudgetAmount) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Family Hub</h1>
          <p className="text-gray-600">Collaborate on family finances</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowAddMemberModal(true)}
            className="btn-secondary flex items-center cursor-pointer"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Member
          </button>
          <button 
            onClick={() => setShowAddBudgetModal(true)}
            className="btn-primary flex items-center cursor-pointer"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Budget
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <UserGroupIcon className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Family Members</p>
              <p className="text-2xl font-bold text-gray-900">{familyMembers.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-success-100 rounded-lg">
              <CurrencyPoundIcon className="w-6 h-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalBudgetAmount)}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-warning-100 rounded-lg">
              <CurrencyPoundIcon className="w-6 h-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalBudgetSpent)}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-info-100 rounded-lg">
              <UserIcon className="w-6 h-6 text-info-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Members</p>
              <p className="text-2xl font-bold text-gray-900">
                {familyMembers.filter(m => m.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Family Members */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Family Members</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {familyMembers.map((member) => (
            <div key={member.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary-600">{member.avatar}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeMember(member.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Role:</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(member.role)}`}>
                    {member.role.replace('-', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Relationship:</span>
                  <span className="text-sm font-medium text-gray-900">{member.relationship}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(member.status)}`}>
                    {member.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Joined:</span>
                  <span className="text-sm text-gray-900">{formatDate(member.joinedDate)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shared Budgets */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Shared Budgets</h2>
        <div className="space-y-4">
          {sharedBudgets.map((budget) => (
            <div key={budget.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{budget.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{budget.description}</p>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-600 rounded-full">
                      {budget.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {budget.members.length} members
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}
                  </p>
                  <p className="text-sm text-gray-500">{budget.progress.toFixed(1)}% used</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div
                  className={`h-3 rounded-full ${getProgressColor(budget.progress)}`}
                  style={{ width: `${Math.min(budget.progress, 100)}%` }}
                ></div>
              </div>

              {/* Members */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Members:</span>
                {budget.members.map((member, index) => (
                  <span key={index} className="text-sm text-gray-900">
                    {member}{index < budget.members.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add Family Member</h2>
              <button 
                onClick={() => setShowAddMemberModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  className="input-field w-full"
                  placeholder="e.g., John Smith"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                  className="input-field w-full"
                  placeholder="john@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                  className="input-field w-full"
                >
                  {memberRoles.map(role => (
                    <option key={role} value={role}>
                      {role.replace('-', ' ').charAt(0).toUpperCase() + role.replace('-', ' ').slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                <select
                  value={newMember.relationship}
                  onChange={(e) => setNewMember({...newMember, relationship: e.target.value})}
                  className="input-field w-full"
                >
                  <option value="">Select relationship</option>
                  {relationships.map(rel => (
                    <option key={rel} value={rel}>{rel}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddMemberModal(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMember}
                className="flex-1 btn-primary"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Budget Modal */}
      {showAddBudgetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add Shared Budget</h2>
              <button 
                onClick={() => setShowAddBudgetModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Budget Name</label>
                <input
                  type="text"
                  value={newBudget.name}
                  onChange={(e) => setNewBudget({...newBudget, name: e.target.value})}
                  className="input-field w-full"
                  placeholder="e.g., Family Groceries"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newBudget.description}
                  onChange={(e) => setNewBudget({...newBudget, description: e.target.value})}
                  className="input-field w-full"
                  rows="3"
                  placeholder="Describe this budget..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (£)</label>
                <input
                  type="number"
                  value={newBudget.amount}
                  onChange={(e) => setNewBudget({...newBudget, amount: e.target.value})}
                  className="input-field w-full"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              
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
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddBudgetModal(false)}
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

export default FamilyHub; 