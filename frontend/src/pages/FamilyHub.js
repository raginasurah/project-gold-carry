import React, { useState, useEffect } from 'react';
import { 
  UserPlusIcon, 
  CogIcon, 
  EyeIcon, 
  PencilIcon, 
  TrashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ShareIcon,
  ChartBarIcon,
  BanknotesIcon,
  UserGroupIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';

const FamilyHub = () => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [sharedBudgets, setSharedBudgets] = useState([]);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showCreateBudgetModal, setShowCreateBudgetModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [inviteLink, setInviteLink] = useState('');
  const [familyStats, setFamilyStats] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'viewer',
    relationship: ''
  });

  const [newBudget, setNewBudget] = useState({
    name: '',
    totalBudget: '',
    categories: [],
    members: [],
    period: 'monthly'
  });

  // Currency formatting
  const formatCurrency = (amount) => {
    const settings = JSON.parse(localStorage.getItem('financeAppSettings') || '{}');
    const currency = settings.preferences?.currency || 'GBP';
    const locale = currency === 'USD' ? 'en-US' : 'en-GB';
    
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    } catch (error) {
      const symbol = currency === 'USD' ? '$' : '£';
      return `${symbol}${amount.toLocaleString()}`;
    }
  };

  // Load data on component mount
  useEffect(() => {
    // Demo family members
    const demoMembers = [
      {
        id: '1',
        name: 'Rinoz Razick',
        email: 'rinoz@example.com',
        role: 'admin',
        relationship: 'self',
        joinedDate: '2024-01-15',
        status: 'active',
        avatar: '👨‍💼',
        permissions: ['view', 'edit', 'admin'],
        lastActivity: 'Now'
      },
      {
        id: '2',
        name: 'Sarah Razick',
        email: 'sarah@example.com',
        role: 'co-manager',
        relationship: 'partner',
        joinedDate: '2024-01-20',
        status: 'active',
        avatar: '👩‍💼',
        permissions: ['view', 'edit'],
        lastActivity: '2 hours ago'
      },
      {
        id: '3',
        name: 'Jamie Razick',
        email: 'jamie@example.com',
        role: 'viewer',
        relationship: 'child',
        joinedDate: '2024-02-01',
        status: 'active',
        avatar: '👦',
        permissions: ['view'],
        lastActivity: '1 day ago'
      }
    ];

    // Demo shared budgets
    const demoBudgets = [
      {
        id: '1',
        name: 'Household Expenses',
        totalBudget: 3500,
        spent: 2100,
        remaining: 1400,
        categories: ['Groceries', 'Utilities', 'Mortgage'],
        members: ['1', '2'],
        creator: '1',
        status: 'active',
        period: 'monthly',
        progress: 60
      },
      {
        id: '2',
        name: 'Family Vacation Fund',
        totalBudget: 5000,
        spent: 1200,
        remaining: 3800,
        categories: ['Travel', 'Accommodation', 'Activities'],
        members: ['1', '2', '3'],
        creator: '2',
        status: 'active',
        period: 'annual',
        progress: 24
      },
      {
        id: '3',
        name: 'Emergency Fund',
        totalBudget: 10000,
        spent: 0,
        remaining: 10000,
        categories: ['Savings'],
        members: ['1', '2'],
        creator: '1',
        status: 'active',
        period: 'ongoing',
        progress: 0
      }
    ];

    setFamilyMembers(demoMembers);
    setSharedBudgets(demoBudgets);

    // Generate invite link
    setInviteLink(`https://ai-finance.app/invite/${Math.random().toString(36).substr(2, 9)}`);

    // Calculate family stats
    const totalBudgetAmount = demoBudgets.reduce((sum, budget) => sum + budget.totalBudget, 0);
    const totalSpent = demoBudgets.reduce((sum, budget) => sum + budget.spent, 0);
    const totalRemaining = demoBudgets.reduce((sum, budget) => sum + budget.remaining, 0);

    setFamilyStats({
      totalMembers: demoMembers.length,
      totalBudgets: demoBudgets.length,
      totalBudgetAmount,
      totalSpent,
      totalRemaining,
      spendingPercentage: totalBudgetAmount > 0 ? Math.round((totalSpent / totalBudgetAmount) * 100) : 0
    });

    // Demo notifications
    setNotifications([
      {
        id: '1',
        type: 'budget_alert',
        message: 'Household Expenses is 60% spent this month',
        member: 'Sarah Razick',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: false,
        icon: '⚠️'
      },
      {
        id: '2',
        type: 'member_joined',
        message: 'Jamie joined the Family Hub',
        member: 'Jamie Razick',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        read: true,
        icon: '👋'
      },
      {
        id: '3',
        type: 'budget_created',
        message: 'Emergency Fund budget was created',
        member: 'Rinoz Razick',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        read: true,
        icon: '💰'
      }
    ]);
  }, []);

  const handleAddMember = () => {
    if (newMember.name && newMember.email) {
      const member = {
        id: Date.now().toString(),
        ...newMember,
        joinedDate: new Date().toISOString().split('T')[0],
        status: 'invited',
        avatar: '👤',
        permissions: newMember.role === 'admin' ? ['view', 'edit', 'admin'] : 
                    newMember.role === 'co-manager' ? ['view', 'edit'] : ['view'],
        lastActivity: 'Invited'
      };

      setFamilyMembers([...familyMembers, member]);
      setNewMember({ name: '', email: '', role: 'viewer', relationship: '' });
      setShowAddMemberModal(false);

      // Show success toast
      showToast(`Invitation sent to ${member.name}`, 'success');
    }
  };

  const handleCreateBudget = () => {
    if (newBudget.name && newBudget.totalBudget) {
      const budget = {
        id: Date.now().toString(),
        ...newBudget,
        totalBudget: parseInt(newBudget.totalBudget),
        spent: 0,
        remaining: parseInt(newBudget.totalBudget),
        creator: '1',
        status: 'active',
        progress: 0
      };

      setSharedBudgets([...sharedBudgets, budget]);
      setNewBudget({ name: '', totalBudget: '', categories: [], members: [], period: 'monthly' });
      setShowCreateBudgetModal(false);

      // Show success toast
      showToast(`Budget "${budget.name}" created successfully`, 'success');
    }
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    showToast('Invite link copied to clipboard!', 'success');
  };

  const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : 
                   type === 'error' ? 'bg-red-500' : 
                   type === 'info' ? 'bg-blue-500' : 'bg-yellow-500';
    
    toast.className = `fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-white shadow-lg ${bgColor} transform transition-all duration-300`;
    toast.innerHTML = `
      <div class="flex items-center space-x-2">
        <span class="text-sm font-medium">${message}</span>
        <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200 text-lg">&times;</button>
      </div>
    `;
    
    document.body.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
      }
    }, 3000);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'co-manager': return 'bg-blue-100 text-blue-800';
      case 'contributor': return 'bg-green-100 text-green-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'invited': return 'text-yellow-600';
      case 'inactive': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Family Hub</h1>
          <p className="text-gray-600">Collaborate on finances with your family</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAddMemberModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <UserPlusIcon className="w-4 h-4" />
            <span>Add Member</span>
          </button>
          <button
            onClick={() => setShowCreateBudgetModal(true)}
            className="btn-secondary flex items-center space-x-2"
          >
            <BanknotesIcon className="w-4 h-4" />
            <span>Create Budget</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'members', 'budgets', 'activity'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Family Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <UserGroupIcon className="w-8 h-8 text-blue-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Family Members</p>
                  <p className="text-2xl font-bold text-gray-900">{familyStats.totalMembers}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <ChartBarIcon className="w-8 h-8 text-green-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Shared Budgets</p>
                  <p className="text-2xl font-bold text-gray-900">{familyStats.totalBudgets}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <BanknotesIcon className="w-8 h-8 text-purple-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Total Budget</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(familyStats.totalBudgetAmount)}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-bold">{familyStats.spendingPercentage}%</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Spending Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(familyStats.totalSpent)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {notifications.slice(0, 5).map((notification) => (
                  <div key={notification.id} className="flex items-start space-x-3">
                    <span className="text-2xl">{notification.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500">
                        {notification.member} • {notification.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowAddMemberModal(true)}
                  className="w-full p-3 text-left rounded-lg border-2 border-dashed border-gray-300 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <UserPlusIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Invite family member</span>
                  </div>
                </button>
                <button
                  onClick={() => setShowCreateBudgetModal(true)}
                  className="w-full p-3 text-left rounded-lg border-2 border-dashed border-gray-300 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <BanknotesIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Create shared budget</span>
                  </div>
                </button>
                <button
                  onClick={copyInviteLink}
                  className="w-full p-3 text-left rounded-lg border-2 border-dashed border-gray-300 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <ShareIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Share invite link</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Family Members</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {familyMembers.map((member) => (
                <div key={member.id} className="p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{member.avatar}</div>
                    <div>
                      <h4 className="font-medium text-gray-900">{member.name}</h4>
                      <p className="text-sm text-gray-500">{member.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(member.role)}`}>
                          {member.role}
                        </span>
                        <span className={`text-xs ${getStatusColor(member.status)}`}>
                          {member.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Last active</p>
                    <p className="text-sm font-medium text-gray-900">{member.lastActivity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invite Link */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-blue-900">Share Invite Link</h4>
                <p className="text-sm text-blue-700">Send this link to invite new family members</p>
              </div>
              <button
                onClick={copyInviteLink}
                className="btn-secondary flex items-center space-x-2"
              >
                <ClipboardDocumentIcon className="w-4 h-4" />
                <span>Copy Link</span>
              </button>
            </div>
            <div className="mt-3 p-2 bg-white rounded border text-sm font-mono text-gray-600 break-all">
              {inviteLink}
            </div>
          </div>
        </div>
      )}

      {/* Budgets Tab */}
      {activeTab === 'budgets' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sharedBudgets.map((budget) => (
              <div key={budget.id} className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{budget.name}</h3>
                  <span className="text-sm text-gray-500 capitalize">{budget.period}</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Spent</span>
                    <span className="font-medium">{formatCurrency(budget.spent)} of {formatCurrency(budget.totalBudget)}</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${budget.progress > 80 ? 'bg-red-500' : budget.progress > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${Math.min(budget.progress, 100)}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Remaining</span>
                    <span className="font-medium text-green-600">{formatCurrency(budget.remaining)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Members</span>
                    <span className="font-medium">{budget.members.length}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <div key={notification.id} className="p-6 flex items-start space-x-4">
                <span className="text-2xl">{notification.icon}</span>
                <div className="flex-1">
                  <p className="text-gray-900">{notification.message}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-500">{notification.member}</span>
                    <span className="text-sm text-gray-400">•</span>
                    <span className="text-sm text-gray-500">{notification.timestamp.toLocaleDateString()}</span>
                  </div>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Family Member</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="input-field w-full"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  className="input-field w-full"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  className="input-field w-full"
                >
                  <option value="viewer">Viewer (Read only)</option>
                  <option value="contributor">Contributor (Can add transactions)</option>
                  <option value="co-manager">Co-Manager (Can edit budgets)</option>
                  <option value="admin">Admin (Full access)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                <input
                  type="text"
                  value={newMember.relationship}
                  onChange={(e) => setNewMember({ ...newMember, relationship: e.target.value })}
                  className="input-field w-full"
                  placeholder="e.g., spouse, child, parent"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddMemberModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMember}
                className="btn-primary flex-1"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Budget Modal */}
      {showCreateBudgetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Shared Budget</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Budget Name</label>
                <input
                  type="text"
                  value={newBudget.name}
                  onChange={(e) => setNewBudget({ ...newBudget, name: e.target.value })}
                  className="input-field w-full"
                  placeholder="e.g., Household Expenses"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Budget</label>
                <input
                  type="number"
                  value={newBudget.totalBudget}
                  onChange={(e) => setNewBudget({ ...newBudget, totalBudget: e.target.value })}
                  className="input-field w-full"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
                <select
                  value={newBudget.period}
                  onChange={(e) => setNewBudget({ ...newBudget, period: e.target.value })}
                  className="input-field w-full"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annual">Annual</option>
                  <option value="ongoing">Ongoing</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCreateBudgetModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBudget}
                className="btn-primary flex-1"
              >
                Create Budget
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyHub;