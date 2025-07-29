import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon,
  ChartBarIcon,
  CreditCardIcon,
  ChatBubbleLeftRightIcon,
  FlagIcon,
  CogIcon,
  UserGroupIcon,
  BanknotesIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Budget', href: '/budget', icon: ChartBarIcon },
    { name: 'Transactions', href: '/transactions', icon: CreditCardIcon },
    { name: 'AI Assistant', href: '/ai-assistant', icon: ChatBubbleLeftRightIcon },
    { name: 'Goals', href: '/goals', icon: FlagIcon },
    { name: 'Subscriptions', href: '/subscriptions', icon: BanknotesIcon },
    { name: 'Investments', href: '/investments', icon: SparklesIcon },
    { name: 'Family Hub', href: '/family', icon: UserGroupIcon },
    { name: 'Settings', href: '/settings', icon: CogIcon },
  ];

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <div className="p-6">
        {/* Navigation */}
        <nav className="space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Quick Actions */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200">
              <div className="w-2 h-2 bg-success-500 rounded-full mr-3"></div>
              Add Transaction
            </button>
            <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200">
              <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
              Set Budget
            </button>
            <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200">
              <div className="w-2 h-2 bg-warning-500 rounded-full mr-3"></div>
              Create Goal
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-success-500 rounded-full mt-2"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">Added transaction</p>
                <p className="text-xs text-gray-500">$45.67 - Coffee Shop</p>
                <p className="text-xs text-gray-400">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">Updated budget</p>
                <p className="text-xs text-gray-500">Groceries - $500</p>
                <p className="text-xs text-gray-400">1 day ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-warning-500 rounded-full mt-2"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">Created goal</p>
                <p className="text-xs text-gray-500">Emergency Fund</p>
                <p className="text-xs text-gray-400">3 days ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pro Tip */}
        <div className="mt-8 p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg">
          <h4 className="text-sm font-semibold text-primary-900 mb-2">
            💡 Pro Tip
          </h4>
          <p className="text-xs text-primary-800">
            Use the AI Assistant to get personalized financial advice and insights about your spending patterns.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;