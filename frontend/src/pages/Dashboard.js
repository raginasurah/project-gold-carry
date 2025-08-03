import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency, useCurrencyListener } from '../utils/currency';
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon, 
  CurrencyPoundIcon,
  CalendarIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentCurrency, setCurrentCurrency] = useState('GBP');

  // Listen for currency changes
  useCurrencyListener((newCurrency) => {
    setCurrentCurrency(newCurrency);
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call delay
        
        // Mock data - replace with real API call
        const mockData = {
          overview: {
            totalBalance: 15420.50,
            monthlyIncome: 3200.00,
            monthlyExpenses: 1850.00,
            savingsRate: 42.2
          },
          recentTransactions: [
            { id: 1, description: 'Grocery Shopping', amount: -85.30, category: 'Food', date: '2024-01-15' },
            { id: 2, description: 'Salary Deposit', amount: 3200.00, category: 'Income', date: '2024-01-14' },
            { id: 3, description: 'Gas Station', amount: -45.20, category: 'Transport', date: '2024-01-13' },
            { id: 4, description: 'Netflix Subscription', amount: -12.99, category: 'Entertainment', date: '2024-01-12' },
            { id: 5, description: 'Freelance Project', amount: 500.00, category: 'Income', date: '2024-01-11' }
          ],
          spendingByCategory: [
            { name: 'Housing', value: 1200, color: '#3B82F6' },
            { name: 'Food', value: 450, color: '#10B981' },
            { name: 'Transport', value: 300, color: '#F59E0B' },
            { name: 'Entertainment', value: 200, color: '#8B5CF6' },
            { name: 'Utilities', value: 150, color: '#EF4444' }
          ],
          monthlyTrend: [
            { month: 'Jan', income: 3200, expenses: 1850 },
            { month: 'Feb', income: 3200, expenses: 2100 },
            { month: 'Mar', income: 3200, expenses: 1750 },
            { month: 'Apr', income: 3200, expenses: 1950 },
            { month: 'May', income: 3200, expenses: 1800 },
            { month: 'Jun', income: 3200, expenses: 1900 }
          ]
        };
        
        setDashboardData(mockData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setDashboardData(null); // Set to null or an error state
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Failed to load dashboard data</p>
      </div>
    );
  }

  // Format data for charts
  const formattedOverview = {
    totalBalance: formatCurrency(dashboardData.overview.totalBalance),
    monthlyIncome: formatCurrency(dashboardData.overview.monthlyIncome),
    monthlyExpenses: formatCurrency(dashboardData.overview.monthlyExpenses),
    savingsRate: dashboardData.overview.savingsRate
  };

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.first_name || 'User'}! 👋
        </h1>
        <p className="text-primary-100">
          Here's your financial overview for today
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Balance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Balance</p>
              <p className="text-2xl font-bold text-gray-900">{formattedOverview.totalBalance}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-lg">
              <CurrencyPoundIcon className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        {/* Monthly Income */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Income</p>
              <p className="text-2xl font-bold text-gray-900">{formattedOverview.monthlyIncome}</p>
            </div>
            <div className="p-3 bg-success-100 rounded-lg">
                              <ArrowTrendingUpIcon className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </div>

        {/* Monthly Expenses */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Expenses</p>
              <p className="text-2xl font-bold text-gray-900">{formattedOverview.monthlyExpenses}</p>
            </div>
            <div className="p-3 bg-danger-100 rounded-lg">
                              <ArrowTrendingDownIcon className="w-6 h-6 text-danger-600" />
            </div>
          </div>
        </div>

        {/* Savings Rate */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Savings Rate</p>
              <p className="text-2xl font-bold text-gray-900">{formattedOverview.savingsRate}%</p>
            </div>
            <div className="p-3 bg-warning-100 rounded-lg">
              <ChartBarIcon className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboardData.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} name="Income" />
              <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} name="Expenses" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Spending by Category */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dashboardData.spendingByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {dashboardData.spendingByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {dashboardData.recentTransactions.map((transaction) => (
            <div key={transaction.id} className="p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <ClockIcon className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-500">{transaction.category} • {transaction.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${transaction.amount > 0 ? 'text-success-600' : 'text-danger-600'}`}>
                  {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;