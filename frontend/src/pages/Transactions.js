import React, { useState, useEffect } from 'react';
import { formatCurrency, useCurrencyListener } from '../utils/currency';
import { 
  PlusIcon, 
  FunnelIcon, 
  MagnifyingGlassIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CreditCardIcon,
  BanknotesIcon,
  BuildingLibraryIcon
} from '@heroicons/react/24/outline';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [currentCurrency, setCurrentCurrency] = useState('GBP');

  // Listen for currency changes
  useCurrencyListener((newCurrency) => {
    setCurrentCurrency(newCurrency);
  });

  // Mock transaction data - replace with real API data
  useEffect(() => {
    const mockTransactions = [
      {
        id: 1,
        description: 'Grocery Shopping',
        amount: -85.30,
        category: 'Food & Dining',
        date: '2024-01-15',
        type: 'expense',
        paymentMethod: 'Credit Card',
        status: 'completed'
      },
      {
        id: 2,
        description: 'Salary Deposit',
        amount: 3200.00,
        category: 'Income',
        date: '2024-01-14',
        type: 'income',
        paymentMethod: 'Bank Transfer',
        status: 'completed'
      },
      {
        id: 3,
        description: 'Gas Station',
        amount: -45.20,
        category: 'Transportation',
        date: '2024-01-13',
        type: 'expense',
        paymentMethod: 'Debit Card',
        status: 'completed'
      },
      {
        id: 4,
        description: 'Netflix Subscription',
        amount: -12.99,
        category: 'Entertainment',
        date: '2024-01-12',
        type: 'expense',
        paymentMethod: 'Credit Card',
        status: 'completed'
      },
      {
        id: 5,
        description: 'Freelance Project',
        amount: 500.00,
        category: 'Income',
        date: '2024-01-11',
        type: 'income',
        paymentMethod: 'Bank Transfer',
        status: 'completed'
      },
      {
        id: 6,
        description: 'Restaurant Dinner',
        amount: -65.50,
        category: 'Food & Dining',
        date: '2024-01-10',
        type: 'expense',
        paymentMethod: 'Credit Card',
        status: 'completed'
      },
      {
        id: 7,
        description: 'Electricity Bill',
        amount: -120.00,
        category: 'Utilities',
        date: '2024-01-09',
        type: 'expense',
        paymentMethod: 'Direct Debit',
        status: 'completed'
      },
      {
        id: 8,
        description: 'Investment Dividend',
        amount: 150.00,
        category: 'Investment',
        date: '2024-01-08',
        type: 'income',
        paymentMethod: 'Bank Transfer',
        status: 'completed'
      }
    ];
    setTransactions(mockTransactions);
    setFilteredTransactions(mockTransactions);
  }, []);

  // Filter transactions based on search and filter
  useEffect(() => {
    let filtered = transactions;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.type === selectedFilter);
    }

    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, selectedFilter]);

  const getTransactionIcon = (category) => {
    switch (category) {
      case 'Food & Dining':
        return <BanknotesIcon className="w-5 h-5" />;
      case 'Transportation':
        return <ArrowUpIcon className="w-5 h-5" />;
      case 'Entertainment':
        return <BuildingLibraryIcon className="w-5 h-5" />;
      case 'Income':
        return <ArrowDownIcon className="w-5 h-5" />;
      default:
        return <CreditCardIcon className="w-5 h-5" />;
    }
  };

  const getTransactionColor = (type) => {
    return type === 'income' ? 'text-success-600' : 'text-danger-600';
  };

  const getTransactionBgColor = (type) => {
    return type === 'income' ? 'bg-success-100' : 'bg-danger-100';
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'Credit Card':
        return <CreditCardIcon className="w-4 h-4" />;
      case 'Debit Card':
        return <CreditCardIcon className="w-4 h-4" />;
      case 'Bank Transfer':
        return <BuildingLibraryIcon className="w-4 h-4" />;
      case 'Direct Debit':
        return <BanknotesIcon className="w-4 h-4" />;
      default:
        return <CreditCardIcon className="w-4 h-4" />;
    }
  };

  const calculateTotals = () => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    return { income, expenses, net: income - expenses };
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Transactions</h1>
        <p className="text-primary-100">
          Track and manage all your financial transactions
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-success-600">{formatCurrency(totals.income)}</p>
            </div>
            <div className="p-3 bg-success-100 rounded-lg">
              <ArrowDownIcon className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-danger-600">{formatCurrency(totals.expenses)}</p>
            </div>
            <div className="p-3 bg-danger-100 rounded-lg">
              <ArrowUpIcon className="w-6 h-6 text-danger-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Amount</p>
              <p className={`text-2xl font-bold ${totals.net >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                {formatCurrency(totals.net)}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${totals.net >= 0 ? 'bg-success-100' : 'bg-danger-100'}`}>
              {totals.net >= 0 ? (
                <ArrowDownIcon className="w-6 h-6 text-success-600" />
              ) : (
                <ArrowUpIcon className="w-6 h-6 text-danger-600" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Transactions</option>
              <option value="income">Income Only</option>
              <option value="expense">Expenses Only</option>
            </select>
          </div>

          {/* Add Transaction Button */}
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
            <PlusIcon className="w-5 h-5" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Transactions ({filteredTransactions.length})
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${getTransactionBgColor(transaction.type)}`}>
                    {getTransactionIcon(transaction.category)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{transaction.description}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{transaction.category}</span>
                      <span>•</span>
                      <span>{transaction.date}</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        {getPaymentMethodIcon(transaction.paymentMethod)}
                        <span>{transaction.paymentMethod}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">{transaction.type}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="p-6 text-center">
            <p className="text-gray-500">No transactions found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;