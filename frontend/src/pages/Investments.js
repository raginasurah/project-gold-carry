import React, { useState, useEffect } from 'react';
import { PlusIcon, ChartBarIcon, CurrencyPoundIcon, XMarkIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

const Investments = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [newInvestment, setNewInvestment] = useState({
    name: '',
    type: 'stock',
    amount: '',
    quantity: '',
    purchaseDate: '',
    symbol: '',
    category: ''
  });
  const [newPortfolio, setNewPortfolio] = useState({
    name: '',
    description: '',
    type: 'personal'
  });

  // Mock investment data
  useEffect(() => {
    const mockPortfolios = [
      {
        id: 1,
        name: 'Main Portfolio',
        description: 'Primary investment portfolio',
        type: 'personal',
        totalValue: 25000,
        totalGain: 3200,
        gainPercentage: 14.7,
        investments: [
          {
            id: 1,
            name: 'Apple Inc.',
            symbol: 'AAPL',
            type: 'stock',
            quantity: 10,
            purchasePrice: 150,
            currentPrice: 175,
            purchaseDate: '2023-06-15',
            category: 'Technology',
            gain: 250,
            gainPercentage: 16.7
          },
          {
            id: 2,
            name: 'Tesla Inc.',
            symbol: 'TSLA',
            type: 'stock',
            quantity: 5,
            purchasePrice: 200,
            currentPrice: 180,
            purchaseDate: '2023-08-20',
            category: 'Automotive',
            gain: -100,
            gainPercentage: -10.0
          },
          {
            id: 3,
            name: 'London Property Fund',
            symbol: 'LPF',
            type: 'property',
            quantity: 100,
            purchasePrice: 85,
            currentPrice: 92,
            purchaseDate: '2023-03-10',
            category: 'Real Estate',
            gain: 700,
            gainPercentage: 8.2
          }
        ]
      },
      {
        id: 2,
        name: 'Retirement Fund',
        description: 'Long-term retirement savings',
        type: 'retirement',
        totalValue: 15000,
        totalGain: 1800,
        gainPercentage: 13.6,
        investments: [
          {
            id: 4,
            name: 'Vanguard S&P 500 ETF',
            symbol: 'VOO',
            type: 'etf',
            quantity: 25,
            purchasePrice: 380,
            currentPrice: 420,
            purchaseDate: '2023-01-15',
            category: 'Index Fund',
            gain: 1000,
            gainPercentage: 10.5
          }
        ]
      }
    ];
    setPortfolios(mockPortfolios);
    setSelectedPortfolio(mockPortfolios[0]);
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

  const getGainColor = (gain) => {
    return gain >= 0 ? 'text-success-600' : 'text-danger-600';
  };

  const getGainIcon = (gain) => {
    return gain >= 0 ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;
  };

  const handleAddInvestment = () => {
    if (newInvestment.name && newInvestment.amount && selectedPortfolio) {
      const investment = {
        id: Date.now(),
        name: newInvestment.name,
        symbol: newInvestment.symbol,
        type: newInvestment.type,
        quantity: parseFloat(newInvestment.quantity),
        purchasePrice: parseFloat(newInvestment.amount),
        currentPrice: parseFloat(newInvestment.amount), // For demo, same as purchase
        purchaseDate: newInvestment.purchaseDate,
        category: newInvestment.category,
        gain: 0,
        gainPercentage: 0
      };
      
      const updatedPortfolio = {
        ...selectedPortfolio,
        investments: [...selectedPortfolio.investments, investment]
      };
      
      setPortfolios(portfolios.map(p => 
        p.id === selectedPortfolio.id ? updatedPortfolio : p
      ));
      setSelectedPortfolio(updatedPortfolio);
      
      setNewInvestment({
        name: '',
        type: 'stock',
        amount: '',
        quantity: '',
        purchaseDate: '',
        symbol: '',
        category: ''
      });
      setShowAddModal(false);
    }
  };

  const handleAddPortfolio = () => {
    if (newPortfolio.name) {
      const portfolio = {
        id: Date.now(),
        name: newPortfolio.name,
        description: newPortfolio.description,
        type: newPortfolio.type,
        totalValue: 0,
        totalGain: 0,
        gainPercentage: 0,
        investments: []
      };
      
      setPortfolios([...portfolios, portfolio]);
      setNewPortfolio({
        name: '',
        description: '',
        type: 'personal'
      });
      setShowPortfolioModal(false);
    }
  };

  const investmentTypes = ['stock', 'etf', 'property', 'bond', 'crypto', 'commodity'];
  const investmentCategories = [
    'Technology', 'Healthcare', 'Finance', 'Consumer Goods', 'Energy', 
    'Real Estate', 'Automotive', 'Index Fund', 'Other'
  ];

  const portfolioTypes = ['personal', 'retirement', 'business', 'education'];

  const totalPortfolioValue = portfolios.reduce((sum, p) => sum + p.totalValue, 0);
  const totalPortfolioGain = portfolios.reduce((sum, p) => sum + p.totalGain, 0);
  const overallGainPercentage = totalPortfolioValue > 0 ? 
    ((totalPortfolioGain / (totalPortfolioValue - totalPortfolioGain)) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Investments</h1>
          <p className="text-gray-600">Track and manage your investment portfolio</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowPortfolioModal(true)}
            className="btn-secondary flex items-center cursor-pointer"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            New Portfolio
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center cursor-pointer"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Investment
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <CurrencyPoundIcon className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPortfolioValue)}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-success-100 rounded-lg">
                              <ArrowTrendingUpIcon className="w-6 h-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Gain</p>
              <p className={`text-2xl font-bold ${getGainColor(totalPortfolioGain)}`}>
                {formatCurrency(totalPortfolioGain)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-info-100 rounded-lg">
              <ChartBarIcon className="w-6 h-6 text-info-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Gain %</p>
              <p className={`text-2xl font-bold ${getGainColor(overallGainPercentage)}`}>
                {overallGainPercentage.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-warning-100 rounded-lg">
              <ChartBarIcon className="w-6 h-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Portfolios</p>
              <p className="text-2xl font-bold text-gray-900">{portfolios.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Selector */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Portfolio</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {portfolios.map((portfolio) => (
            <div
              key={portfolio.id}
              onClick={() => setSelectedPortfolio(portfolio)}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedPortfolio?.id === portfolio.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h3 className="font-semibold text-gray-900">{portfolio.name}</h3>
              <p className="text-sm text-gray-600">{portfolio.description}</p>
              <div className="mt-2">
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(portfolio.totalValue)}
                </p>
                <p className={`text-sm ${getGainColor(portfolio.totalGain)}`}>
                  {formatCurrency(portfolio.totalGain)} ({portfolio.gainPercentage.toFixed(1)}%)
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Portfolio Details */}
      {selectedPortfolio && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedPortfolio.name} - Portfolio Details
            </h2>
            <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-600 rounded-full">
              {selectedPortfolio.type}
            </span>
          </div>

          {/* Portfolio Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(selectedPortfolio.totalValue)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Gain</p>
              <p className={`text-xl font-bold ${getGainColor(selectedPortfolio.totalGain)}`}>
                {formatCurrency(selectedPortfolio.totalGain)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Gain %</p>
              <p className={`text-xl font-bold ${getGainColor(selectedPortfolio.gainPercentage)}`}>
                {selectedPortfolio.gainPercentage.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Investments List */}
          <div className="space-y-4">
            <h3 className="text-md font-semibold text-gray-900">Investments</h3>
            {selectedPortfolio.investments.map((investment) => {
              const GainIcon = getGainIcon(investment.gain);
              return (
                <div key={investment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {investment.name}
                        </h4>
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                          {investment.symbol}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-600 rounded-full">
                          {investment.type.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{investment.category}</p>
                      <div className="flex items-center mt-2 space-x-4">
                        <span className="text-sm text-gray-500">
                          Quantity: {investment.quantity}
                        </span>
                        <span className="text-sm text-gray-500">
                          Purchase: {formatDate(investment.purchaseDate)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(investment.currentPrice * investment.quantity)}
                      </p>
                      <div className="flex items-center justify-end space-x-1">
                        <GainIcon className={`w-4 h-4 ${getGainColor(investment.gain)}`} />
                        <p className={`text-sm ${getGainColor(investment.gain)}`}>
                          {formatCurrency(investment.gain)} ({investment.gainPercentage.toFixed(1)}%)
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(investment.currentPrice)} per unit
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Investment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add Investment</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Investment Name</label>
                <input
                  type="text"
                  value={newInvestment.name}
                  onChange={(e) => setNewInvestment({...newInvestment, name: e.target.value})}
                  className="input-field w-full"
                  placeholder="e.g., Apple Inc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Symbol/Ticker</label>
                <input
                  type="text"
                  value={newInvestment.symbol}
                  onChange={(e) => setNewInvestment({...newInvestment, symbol: e.target.value})}
                  className="input-field w-full"
                  placeholder="e.g., AAPL"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={newInvestment.type}
                  onChange={(e) => setNewInvestment({...newInvestment, type: e.target.value})}
                  className="input-field w-full"
                >
                  {investmentTypes.map(type => (
                    <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newInvestment.category}
                  onChange={(e) => setNewInvestment({...newInvestment, category: e.target.value})}
                  className="input-field w-full"
                >
                  <option value="">Select category</option>
                  {investmentCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  value={newInvestment.quantity}
                  onChange={(e) => setNewInvestment({...newInvestment, quantity: e.target.value})}
                  className="input-field w-full"
                  placeholder="0"
                  step="1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price per Unit (£)</label>
                <input
                  type="number"
                  value={newInvestment.amount}
                  onChange={(e) => setNewInvestment({...newInvestment, amount: e.target.value})}
                  className="input-field w-full"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
                <input
                  type="date"
                  value={newInvestment.purchaseDate}
                  onChange={(e) => setNewInvestment({...newInvestment, purchaseDate: e.target.value})}
                  className="input-field w-full"
                />
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
                onClick={handleAddInvestment}
                className="flex-1 btn-primary"
              >
                Add Investment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Portfolio Modal */}
      {showPortfolioModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Create New Portfolio</h2>
              <button 
                onClick={() => setShowPortfolioModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio Name</label>
                <input
                  type="text"
                  value={newPortfolio.name}
                  onChange={(e) => setNewPortfolio({...newPortfolio, name: e.target.value})}
                  className="input-field w-full"
                  placeholder="e.g., Growth Portfolio"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newPortfolio.description}
                  onChange={(e) => setNewPortfolio({...newPortfolio, description: e.target.value})}
                  className="input-field w-full"
                  rows="3"
                  placeholder="Describe your portfolio..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio Type</label>
                <select
                  value={newPortfolio.type}
                  onChange={(e) => setNewPortfolio({...newPortfolio, type: e.target.value})}
                  className="input-field w-full"
                >
                  {portfolioTypes.map(type => (
                    <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowPortfolioModal(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPortfolio}
                className="flex-1 btn-primary"
              >
                Create Portfolio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Investments;