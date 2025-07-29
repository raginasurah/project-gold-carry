import React, { useState, useEffect } from 'react';
import { PlusIcon, FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock transactions data
  useEffect(() => {
    const mockTransactions = [
      { id: 1, description: 'Coffee Shop', amount: -4.50, category: 'Food & Dining', date: '2024-01-15', type: 'expense' },
      { id: 2, description: 'Gas Station', amount: -45.00, category: 'Transportation', date: '2024-01-15', type: 'expense' },
      { id: 3, description: 'Salary Deposit', amount: 4250.00, category: 'Income', date: '2024-01-14', type: 'income' },
      { id: 4, description: 'Grocery Store', amount: -85.30, category: 'Food & Dining', date: '2024-01-14', type: 'expense' },
      { id: 5, description: 'Netflix Subscription', amount: -15.99, category: 'Entertainment', date: '2024-01-13', type: 'expense' },
      { id: 6, description: 'Freelance Payment', amount: 500.00, category: 'Income', date: '2024-01-12', type: 'income' },
      { id: 7, description: 'Restaurant', amount: -32.50, category: 'Food & Dining', date: '2024-01-12', type: 'expense' },
      { id: 8, description: 'Amazon Purchase', amount: -67.89, category: 'Shopping', date: '2024-01-11', type: 'expense' }
    ];
    setTransactions(mockTransactions);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesFilter = filter === 'all' || transaction.type === filter;
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600">Track and manage your financial transactions</p>
        </div>
        <button className="btn-primary flex items-center">
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Transaction
        </button>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-4 h-4 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Transactions</option>
              <option value="income">Income</option>
              <option value="expense">Expenses</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="card">
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  transaction.type === 'income' ? 'bg-success-100' : 'bg-danger-100'
                }`}>
                  <span className={`text-sm font-bold ${
                    transaction.type === 'income' ? 'text-success-600' : 'text-danger-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{transaction.description}</h3>
                  <p className="text-sm text-gray-500">{transaction.category} • {formatDate(transaction.date)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'income' ? 'text-success-600' : 'text-gray-900'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Transactions;