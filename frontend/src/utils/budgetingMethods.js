// Budgeting Methods Logic and Calculations

export const BUDGETING_METHODS = {
  '50/30/20': {
    name: '50/30/20 Rule',
    description: 'Allocate 50% for needs, 30% for wants, 20% for savings and debt repayment',
    icon: '📊',
    color: 'blue',
    categories: [
      { name: 'Needs', percentage: 50, color: 'bg-blue-500', examples: ['Rent/Mortgage', 'Utilities', 'Groceries', 'Transportation'] },
      { name: 'Wants', percentage: 30, color: 'bg-green-500', examples: ['Entertainment', 'Dining Out', 'Hobbies', 'Shopping'] },
      { name: 'Savings & Debt', percentage: 20, color: 'bg-purple-500', examples: ['Emergency Fund', 'Retirement', 'Debt Payments', 'Investments'] }
    ]
  },
  'zero-based': {
    name: 'Zero-Based Budget',
    description: 'Every pound must be assigned to a specific category until income minus expenses equals zero',
    icon: '🎯',
    color: 'red',
    categories: [
      { name: 'Fixed Expenses', color: 'bg-red-500', examples: ['Rent', 'Insurance', 'Subscriptions'] },
      { name: 'Variable Expenses', color: 'bg-orange-500', examples: ['Groceries', 'Gas', 'Utilities'] },
      { name: 'Savings Goals', color: 'bg-green-500', examples: ['Emergency Fund', 'Vacation', 'New Car'] },
      { name: 'Debt Payments', color: 'bg-purple-500', examples: ['Credit Cards', 'Student Loans', 'Personal Loans'] },
      { name: 'Fun Money', color: 'bg-yellow-500', examples: ['Entertainment', 'Hobbies', 'Personal Spending'] }
    ]
  },
  '70/20/10': {
    name: '70/20/10 Rule',
    description: 'Live on 70%, save 20%, invest or pay debt 10%',
    icon: '💰',
    color: 'green',
    categories: [
      { name: 'Living Expenses', percentage: 70, color: 'bg-green-500', examples: ['All monthly expenses', 'Bills', 'Food', 'Transportation'] },
      { name: 'Savings', percentage: 20, color: 'bg-blue-500', examples: ['Emergency Fund', 'Short-term goals', 'High-yield savings'] },
      { name: 'Investments/Debt', percentage: 10, color: 'bg-purple-500', examples: ['Stocks', 'Bonds', 'Debt repayment', 'Retirement'] }
    ]
  },
  '60-percent': {
    name: '60% Solution',
    description: 'Live on 60%, save 10% each for retirement, long-term, short-term, and fun money',
    icon: '🏠',
    color: 'purple',
    categories: [
      { name: 'Basic Expenses', percentage: 60, color: 'bg-purple-500', examples: ['Housing', 'Food', 'Transportation', 'Basic needs'] },
      { name: 'Retirement', percentage: 10, color: 'bg-blue-500', examples: ['401k', 'IRA', 'Pension contributions'] },
      { name: 'Long-term Savings', percentage: 10, color: 'bg-green-500', examples: ['House down payment', 'Education fund'] },
      { name: 'Short-term Savings', percentage: 10, color: 'bg-yellow-500', examples: ['Emergency fund', 'Car repairs', 'Vacation'] },
      { name: 'Fun Money', percentage: 10, color: 'bg-pink-500', examples: ['Entertainment', 'Hobbies', 'Splurges'] }
    ]
  },
  'envelope': {
    name: 'Envelope Method',
    description: 'Allocate cash to different spending categories in separate envelopes',
    icon: '✉️',
    color: 'yellow',
    categories: [
      { name: 'Housing', color: 'bg-red-500', examples: ['Rent/Mortgage', 'Property tax', 'Home insurance'] },
      { name: 'Food', color: 'bg-green-500', examples: ['Groceries', 'Restaurants', 'Work lunches'] },
      { name: 'Transportation', color: 'bg-blue-500', examples: ['Gas', 'Car payment', 'Public transport'] },
      { name: 'Utilities', color: 'bg-yellow-500', examples: ['Electric', 'Gas', 'Water', 'Internet'] },
      { name: 'Personal', color: 'bg-purple-500', examples: ['Clothing', 'Healthcare', 'Personal care'] },
      { name: 'Entertainment', color: 'bg-pink-500', examples: ['Movies', 'Games', 'Subscriptions'] },
      { name: 'Savings', color: 'bg-indigo-500', examples: ['Emergency fund', 'Goals', 'Investments'] }
    ]
  }
};

export const calculateBudgetAllocation = (method, monthlyIncome) => {
  const methodConfig = BUDGETING_METHODS[method];
  
  if (!methodConfig) {
    throw new Error(`Unknown budgeting method: ${method}`);
  }

  const allocation = {};
  
  methodConfig.categories.forEach(category => {
    if (category.percentage) {
      allocation[category.name] = {
        budgeted: Math.round(monthlyIncome * (category.percentage / 100)),
        percentage: category.percentage,
        color: category.color,
        examples: category.examples
      };
    } else {
      // For methods without fixed percentages (like envelope), suggest equal distribution
      const remainingCategories = methodConfig.categories.filter(c => !c.percentage).length;
      allocation[category.name] = {
        budgeted: Math.round(monthlyIncome / remainingCategories),
        percentage: Math.round(100 / remainingCategories),
        color: category.color,
        examples: category.examples
      };
    }
  });

  return allocation;
};

export const validateBudgetMethod = (method, allocations, monthlyIncome) => {
  const methodConfig = BUDGETING_METHODS[method];
  const totalAllocated = Object.values(allocations).reduce((sum, allocation) => sum + allocation.budgeted, 0);
  
  const validation = {
    isValid: true,
    warnings: [],
    recommendations: []
  };

  switch (method) {
    case 'zero-based':
      if (totalAllocated !== monthlyIncome) {
        validation.isValid = false;
        validation.warnings.push(`Zero-based budget requires all income to be allocated. You have £${monthlyIncome - totalAllocated} unallocated.`);
      }
      break;
      
    case '50/30/20':
      const needsPercentage = (allocations['Needs']?.budgeted || 0) / monthlyIncome * 100;
      const wantsPercentage = (allocations['Wants']?.budgeted || 0) / monthlyIncome * 100;
      const savingsPercentage = (allocations['Savings & Debt']?.budgeted || 0) / monthlyIncome * 100;
      
      if (needsPercentage > 55) {
        validation.warnings.push('Your needs allocation is higher than the recommended 50%. Consider reducing expenses.');
      }
      if (savingsPercentage < 15) {
        validation.warnings.push('Your savings rate is below the recommended 20%. Try to increase if possible.');
      }
      break;
      
    case '70/20/10':
      const livingPercentage = (allocations['Living Expenses']?.budgeted || 0) / monthlyIncome * 100;
      const savingsPerc = (allocations['Savings']?.budgeted || 0) / monthlyIncome * 100;
      
      if (livingPercentage > 75) {
        validation.warnings.push('Living expenses exceed 70%. Consider cutting back to increase savings.');
      }
      if (savingsPerc < 18) {
        validation.warnings.push('Savings below recommended 20%. Adjust your allocations.');
      }
      break;
  }

  // General recommendations
  if (totalAllocated > monthlyIncome) {
    validation.isValid = false;
    validation.warnings.push(`You're over budget by £${totalAllocated - monthlyIncome}. Reduce allocations.`);
  }

  if (totalAllocated < monthlyIncome * 0.9) {
    validation.recommendations.push(`You have £${monthlyIncome - totalAllocated} unallocated. Consider increasing savings or debt payments.`);
  }

  return validation;
};

export const getBudgetMethodTheme = (method) => {
  const methodConfig = BUDGETING_METHODS[method];
  
  return {
    primaryColor: methodConfig.color,
    icon: methodConfig.icon,
    name: methodConfig.name,
    description: methodConfig.description,
    gradientClass: `from-${methodConfig.color}-500 to-${methodConfig.color}-600`,
    borderClass: `border-${methodConfig.color}-500`,
    textClass: `text-${methodConfig.color}-600`,
    bgClass: `bg-${methodConfig.color}-50`
  };
};