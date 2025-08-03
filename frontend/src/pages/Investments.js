import React, { useState, useEffect } from 'react';
import { formatCurrency, useCurrencyListener } from '../utils/currency';
import { 
  PlusIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon, 
  ChartBarIcon,
  BanknotesIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Investments = () => {
  const [investments, setInvestments] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [currentCurrency, setCurrentCurrency] = useState('GBP');

  // Listen for currency changes
  useCurrencyListener((newCurrency) => {
    setCurrentCurrency(newCurrency);
  });

  const [newInvestment, setNewInvestment] = useState({
    name: '',
    type: 'stocks',
    amount: '',
    purchaseDate: '',
    currentValue: '',
    description: ''
  });

  // Mock investments data - replace with real API data
  useEffect(() => {
    const mockInvestments = [
      {
        id: 1,
        name: 'Apple Inc. (AAPL)',
        type: 'stocks',
        amount: 5000,
        purchaseDate: '2023-01-15',
        currentValue: 6200,
        description: 'Technology stock investment',
        performance: 24.0,
        risk: 'medium'
      },
      {
        id: 2,
        name: 'Vanguard S&P 500 ETF',
        type: 'etf',
        amount: 10000,
        purchaseDate: '2022-06-01',
        currentValue: 11200,
        description: 'Index fund tracking S&P 500',
        performance: 12.0,
        risk: 'low'
      },
      {
        id: 3,
        name: 'Tesla Inc. (TSLA)',
        type: 'stocks',
        amount: 3000,
        purchaseDate: '2023-03-10',
        currentValue: 2400,
        description: 'Electric vehicle company stock',
        performance: -20.0,
        risk: 'high'
      },
      {
        id: 4,
        name: 'Government Bonds',
        type: 'bonds',
        amount: 8000,
        purchaseDate: '2022-12-01',
        currentValue: 8160,
        description: 'Low-risk government bonds',
        performance: 2.0,
        risk: 'low'
      },
      {
        id: 5,
        name: 'Bitcoin ETF',
        type: 'crypto',
        amount: 2000,
        purchaseDate: '2023-08-15',
        currentValue: 2800,
        description: 'Cryptocurrency investment',
        performance: 40.0,
        risk: 'high'
      }
    ];
    setInvestments(mockInvestments);
  }, []);

  const investmentTypes = [
    { value: 'stocks', label: 'Stocks', color: 'bg-blue-500' },
    { value: 'etf', label: 'ETF', color: 'bg-green-500' },
    { value: 'bonds', label: 'Bonds', color: 'bg-purple-500' },
    { value: 'crypto', label: 'Cryptocurrency', color: 'bg-orange-500' },
    { value: 'mutual_funds', label: 'Mutual Funds', color: 'bg-red-500' },
    { value: 'real_estate', label: 'Real Estate', color: 'bg-indigo-500' }
  ];

  const getTypeColor = (type) => {
    const investmentType = investmentTypes.find(t => t.value === type);
    return investmentType ? investmentType.color : 'bg-gray-500';
  };

  const getTypeLabel = (type) => {
    const investmentType = investmentTypes.find(t => t.value === type);
    return investmentType ? investmentType.label : 'Other';
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low':
        return 'text-success-600 bg-success-100';
      case 'medium':
        return 'text-warning-600 bg-warning-100';
      case 'high':
        return 'text-danger-600 bg-danger-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPerformanceColor = (performance) => {
    if (performance > 0) return 'text-success-600';
    if (performance < 0) return 'text-danger-600';
    return 'text-gray-600';
  };

  const getPerformanceIcon = (performance) => {
    if (performance > 0) return <ArrowTrendingUpIcon className="w-4 h-4 text-success-600" />;
    if (performance < 0) return <ArrowTrendingDownIcon className="w-4 h-4 text-danger-600" />;
    return <ChartBarIcon className="w-4 h-4 text-gray-600" />;
  };

  const handleAddInvestment = () => {
    if (newInvestment.name && newInvestment.amount && newInvestment.purchaseDate) {
      const currentValue = parseFloat(newInvestment.currentValue) || parseFloat(newInvestment.amount);
      const performance = ((currentValue - parseFloat(newInvestment.amount)) / parseFloat(newInvestment.amount)) * 100;
      
      const investment = {
        id: Date.now(),
        name: newInvestment.name,
        type: newInvestment.type,
        amount: parseFloat(newInvestment.amount),
        purchaseDate: newInvestment.purchaseDate,
        currentValue: currentValue,
        description: newInvestment.description,
        performance: performance,
        risk: getRiskLevel(newInvestment.type)
      };
      setInvestments([...investments, investment]);
      setNewInvestment({
        name: '',
        type: 'stocks',
        amount: '',
        purchaseDate: '',
        currentValue: '',
        description: ''
      });
      setShowAddModal(false);
    }
  };

  const getRiskLevel = (type) => {
    switch (type) {
      case 'bonds':
        return 'low';
      case 'etf':
        return 'low';
      case 'stocks':
        return 'medium';
      case 'mutual_funds':
        return 'medium';
      case 'crypto':
        return 'high';
      case 'real_estate':
        return 'high';
      default:
        return 'medium';
    }
  };

  const updateInvestmentValue = (investmentId, newValue) => {
    setInvestments(investments.map(inv => {
      if (inv.id === investmentId) {
        const performance = ((newValue - inv.amount) / inv.amount) * 100;
        return { ...inv, currentValue: newValue, performance: performance };
      }
      return inv;
    }));
  };

  const deleteInvestment = (investmentId) => {
    setInvestments(investments.filter(inv => inv.id !== investmentId));
  };

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalGainLoss = totalCurrentValue - totalInvested;
  const totalPerformance = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

  // Chart data
  const performanceData = investments.map(inv => ({
    name: inv.name,
    performance: inv.performance,
    value: inv.currentValue
  }));

  const typeDistribution = investmentTypes.map(type => {
    const typeInvestments = investments.filter(inv => inv.type === type.value);
    const totalValue = typeInvestments.reduce((sum, inv) => sum + inv.currentValue, 0);
    return {
      name: type.label,
      value: totalValue,
      color: type.color.replace('bg-', '')
    };
  }).filter(item => item.value > 0);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Investment Portfolio</h1>
        <p className="text-primary-100">
          Track and manage your investment portfolio
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Invested</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalInvested)}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-lg">
              <BanknotesIcon className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCurrentValue)}</p>
            </div>
            <div className="p-3 bg-success-100 rounded-lg">
                              <ArrowTrendingUpIcon className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Gain/Loss</p>
              <p className={`text-2xl font-bold ${getPerformanceColor(totalPerformance)}`}>
                {formatCurrency(totalGainLoss)}
              </p>
            </div>
            <div className="p-3 bg-warning-100 rounded-lg">
              {getPerformanceIcon(totalPerformance)}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Performance</p>
              <p className={`text-2xl font-bold ${getPerformanceColor(totalPerformance)}`}>
                {totalPerformance.toFixed(2)}%
              </p>
            </div>
            <div className="p-3 bg-info-100 rounded-lg">
              <ChartBarIcon className="w-6 h-6 text-info-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance by Investment</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
              <Line type="monotone" dataKey="performance" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={typeDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {typeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Investments List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Your Investments</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Investment</span>
          </button>
        </div>
        <div className="divide-y divide-gray-200">
          {investments.map((investment) => (
            <div key={investment.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`w-3 h-3 rounded-full ${getTypeColor(investment.type)}`}></div>
                    <h3 className="text-lg font-semibold text-gray-900">{investment.name}</h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(investment.risk)}`}>
                      {investment.risk} risk
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(investment.performance)}`}>
                      {investment.performance > 0 ? '+' : ''}{investment.performance.toFixed(2)}%
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{investment.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-500">Invested Amount</p>
                      <p className="text-lg font-semibold text-gray-900">{formatCurrency(investment.amount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Current Value</p>
                      <p className="text-lg font-semibold text-gray-900">{formatCurrency(investment.currentValue)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Gain/Loss</p>
                      <p className={`text-lg font-semibold ${getPerformanceColor(investment.performance)}`}>
                        {formatCurrency(investment.currentValue - investment.amount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Purchase Date</p>
                      <p className="text-lg font-semibold text-gray-900">{new Date(investment.purchaseDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="capitalize">{getTypeLabel(investment.type)}</span>
                    <span>Purchased: {new Date(investment.purchaseDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="ml-4 flex flex-col space-y-2">
                  <button
                    onClick={() => {
                      const newValue = prompt('Enter new current value:', investment.currentValue);
                      if (newValue && !isNaN(newValue)) {
                        updateInvestmentValue(investment.id, parseFloat(newValue));
                      }
                    }}
                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium hover:bg-primary-200 transition-colors"
                  >
                    Update Value
                  </button>
                  <button
                    onClick={() => deleteInvestment(investment.id)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Investment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Investment</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Investment Name</label>
                <input
                  type="text"
                  value={newInvestment.name}
                  onChange={(e) => setNewInvestment({...newInvestment, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Apple Inc. (AAPL)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Investment Type</label>
                <select
                  value={newInvestment.type}
                  onChange={(e) => setNewInvestment({...newInvestment, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {investmentTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Invested Amount</label>
                <input
                  type="number"
                  value={newInvestment.amount}
                  onChange={(e) => setNewInvestment({...newInvestment, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Value (Optional)</label>
                <input
                  type="number"
                  value={newInvestment.currentValue}
                  onChange={(e) => setNewInvestment({...newInvestment, currentValue: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <input
                  type="text"
                  value={newInvestment.description}
                  onChange={(e) => setNewInvestment({...newInvestment, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Brief description of the investment"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddInvestment}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Add Investment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Investments;