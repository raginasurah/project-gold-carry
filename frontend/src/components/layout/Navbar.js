import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import SyncStatus from '../ui/SyncStatus';
import { formatCurrency, getCurrencySymbol, useCurrencyListener } from '../../utils/currency';
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
  const [currentCurrency, setCurrentCurrency] = useState(getCurrencySymbol());

  // Listen for currency changes
  useCurrencyListener((newCurrency) => {
    setCurrentCurrency(getCurrencySymbol(newCurrency));
  });

  // Mock data - replace with real data from API
  const quickStats = {
    spendingToday: 45.67,
    weeklyStatus: 'on_track',
    paydayCountdown: 3,
    monthlySavings: 1250.00
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
    <nav className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">{currentCurrency}</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI Finance</h1>
            <p className="text-xs text-gray-500">Personal Finance Management</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Today's Spending */}
          <div className="text-center">
            <p className="text-xs text-gray-500">Today's Spending</p>
            <p className="text-sm font-semibold text-gray-900">{formatCurrency(quickStats.spendingToday)}</p>
          </div>

          {/* Weekly Status */}
          <div className="text-center">
            <p className="text-xs text-gray-500">Weekly Status</p>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getWeeklyStatusColor(quickStats.weeklyStatus)}`}>
              {getWeeklyStatusText(quickStats.weeklyStatus)}
            </span>
          </div>

          {/* Payday Countdown */}
          <div className="text-center">
            <p className="text-xs text-gray-500">Days to Payday</p>
            <p className="text-sm font-semibold text-gray-900">{quickStats.paydayCountdown}</p>
          </div>

          {/* Monthly Savings */}
          <div className="text-center">
            <p className="text-xs text-gray-500">Monthly Savings</p>
            <p className="text-sm font-semibold text-gray-900">{formatCurrency(quickStats.monthlySavings)}</p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Sync Status */}
          <SyncStatus className="hidden sm:block" />

          {/* Balance Toggle */}
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title={showBalance ? 'Hide Balance' : 'Show Balance'}
          >
            {showBalance ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
          </button>

          {/* Notifications */}
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
            <BellIcon className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
          </button>

          {/* User Menu */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center space-x-2 p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <UserCircleIcon className="w-6 h-6" />
              <span className="text-sm font-medium text-gray-700">{user?.first_name || 'User'}</span>
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
              <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                    >
                      <CogIcon className="w-4 h-4 mr-2" />
                      Settings
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={logout}
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;