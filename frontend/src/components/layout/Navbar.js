import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  BellIcon, 
  UserCircleIcon, 
  CogIcon, 
  ArrowRightOnRectangleIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showBalance, setShowBalance] = useState(true);

  // Mock data - replace with real data from API
  const quickStats = {
    spendingToday: 45.67,
    weeklyStatus: 'on_track',
    paydayCountdown: 3,
    monthlySavings: 1250.00
  };

  // Currency formatting function
  const formatCurrency = (amount) => {
    const settings = JSON.parse(localStorage.getItem('financeAppSettings') || '{}');
    const currency = settings.preferences?.currency || 'GBP';
    const locale = currency === 'USD' ? 'en-US' : 'en-GB';
    
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch (error) {
      const symbol = currency === 'USD' ? '$' : '£';
      return `${symbol}${amount.toFixed(2)}`;
    }
  };

  const getWeeklyStatusColor = (status) => {
    switch (status) {
      case 'on_track':
        return 'text-success-600 bg-success-100';
      case 'over_budget':
        return 'text-danger-600 bg-danger-100';
      case 'under_budget':
        return 'text-warning-600 bg-warning-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getWeeklyStatusText = (status) => {
    switch (status) {
      case 'on_track':
        return 'On Track';
      case 'over_budget':
        return 'Over Budget';
      case 'under_budget':
        return 'Under Budget';
      default:
        return 'Unknown';
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Quick Stats */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">$</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gradient">AI Finance</span>
            </div>

            {/* Quick Stats Bar */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Today:</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(quickStats.spendingToday)}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Week:</span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getWeeklyStatusColor(quickStats.weeklyStatus)}`}>
                  {getWeeklyStatusText(quickStats.weeklyStatus)}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Payday:</span>
                <span className="text-sm font-medium text-gray-900">
                  {quickStats.paydayCountdown} days
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Savings:</span>
                <div className="flex items-center space-x-1">
                  {showBalance ? (
                    <>
                      <span className="text-sm font-medium text-success-600">
                        {formatCurrency(quickStats.monthlySavings)}
                      </span>
                      <button
                        onClick={() => setShowBalance(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <EyeSlashIcon className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-sm font-medium text-gray-400">••••••</span>
                      <button
                        onClick={() => setShowBalance(true)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Notifications and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-600 relative">
              <BellIcon className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none">
                <UserCircleIcon className="w-8 h-8" />
                <span className="hidden md:block text-sm font-medium">
                  {user?.first_name} {user?.last_name}
                </span>
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                      >
                        <UserCircleIcon className="w-4 h-4 mr-3" />
                        Profile
                      </button>
                    )}
                  </Menu.Item>
                  
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                      >
                        <CogIcon className="w-4 h-4 mr-3" />
                        Settings
                      </button>
                    )}
                  </Menu.Item>
                  
                  <div className="border-t border-gray-200 my-1"></div>
                  
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={logout}
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                        Sign Out
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;