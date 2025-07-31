// Notification Service for AI Finance App
class NotificationService {
  constructor() {
    this.permission = Notification.permission;
    this.settings = this.loadSettings();
  }

  loadSettings() {
    const savedSettings = localStorage.getItem('financeAppSettings');
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
    return {
      notifications: {
        pushNotifications: false,
        budgetAlerts: true,
        transactionAlerts: true,
        weeklyReports: true
      }
    };
  }

  async requestPermission() {
    if ('Notification' in window) {
      this.permission = await Notification.requestPermission();
      return this.permission;
    }
    return 'not-supported';
  }

  sendNotification(title, options = {}) {
    if (this.permission === 'granted' && this.settings.notifications.pushNotifications) {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });

      // Auto-close after 5 seconds
      setTimeout(() => notification.close(), 5000);

      return notification;
    }
  }

  // Budget-related notifications
  sendBudgetAlert(budgetName, percentage, amount) {
    if (!this.settings.notifications.budgetAlerts) return;

    const title = `Budget Alert: ${budgetName}`;
    const body = `You've used ${percentage}% of your ${budgetName} budget (£${amount.toFixed(2)})`;
    
    this.sendNotification(title, {
      body,
      tag: 'budget-alert',
      requireInteraction: percentage >= 90 // Keep notification for critical alerts
    });
  }

  // Transaction notifications
  sendTransactionAlert(transaction) {
    if (!this.settings.notifications.transactionAlerts) return;

    const title = 'New Transaction Added';
    const body = `${transaction.description}: £${Math.abs(transaction.amount).toFixed(2)}`;
    
    this.sendNotification(title, {
      body,
      tag: 'transaction-alert'
    });
  }

  // Weekly report notification
  sendWeeklyReport(totalSpent, budgetRemaining) {
    if (!this.settings.notifications.weeklyReports) return;

    const title = 'Weekly Financial Summary';
    const body = `This week: £${totalSpent.toFixed(2)} spent, £${budgetRemaining.toFixed(2)} remaining`;
    
    this.sendNotification(title, {
      body,
      tag: 'weekly-report',
      requireInteraction: true
    });
  }

  // Goal achievement notification
  sendGoalAchievement(goalName, amount) {
    const title = '🎉 Goal Achieved!';
    const body = `Congratulations! You've reached your ${goalName} goal of £${amount.toFixed(2)}`;
    
    this.sendNotification(title, {
      body,
      tag: 'goal-achievement',
      requireInteraction: true
    });
  }

  // Savings milestone notification
  sendSavingsMilestone(amount) {
    const title = '💰 Savings Milestone!';
    const body = `Great job! You've saved £${amount.toFixed(2)} this month`;
    
    this.sendNotification(title, {
      body,
      tag: 'savings-milestone'
    });
  }

  // Bill reminder notification
  sendBillReminder(billName, amount, daysUntilDue) {
    const title = 'Bill Reminder';
    const body = `${billName} (£${amount.toFixed(2)}) is due in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}`;
    
    this.sendNotification(title, {
      body,
      tag: 'bill-reminder',
      requireInteraction: daysUntilDue <= 1
    });
  }

  // Schedule periodic notifications
  startPeriodicNotifications() {
    // Send daily budget check at 6 PM
    this.scheduleDailyNotification(18, 0, () => {
      this.checkDailyBudget();
    });

    // Send weekly report on Sunday at 10 AM
    this.scheduleWeeklyNotification(0, 10, 0, () => {
      this.sendWeeklyReport(0, 0); // Would be calculated from actual data
    });
  }

  scheduleDailyNotification(hour, minute, callback) {
    const now = new Date();
    const scheduled = new Date();
    scheduled.setHours(hour, minute, 0, 0);

    // If time has passed today, schedule for tomorrow
    if (scheduled <= now) {
      scheduled.setDate(scheduled.getDate() + 1);
    }

    const timeout = scheduled.getTime() - now.getTime();
    
    setTimeout(() => {
      callback();
      // Schedule next day
      setInterval(callback, 24 * 60 * 60 * 1000); // 24 hours
    }, timeout);
  }

  scheduleWeeklyNotification(dayOfWeek, hour, minute, callback) {
    const now = new Date();
    const scheduled = new Date();
    
    scheduled.setDate(now.getDate() + (dayOfWeek - now.getDay() + 7) % 7);
    scheduled.setHours(hour, minute, 0, 0);

    // If time has passed this week, schedule for next week
    if (scheduled <= now) {
      scheduled.setDate(scheduled.getDate() + 7);
    }

    const timeout = scheduled.getTime() - now.getTime();
    
    setTimeout(() => {
      callback();
      // Schedule next week
      setInterval(callback, 7 * 24 * 60 * 60 * 1000); // 7 days
    }, timeout);
  }

  checkDailyBudget() {
    // This would integrate with actual budget data
    const mockBudgetCheck = {
      name: 'Daily Spending',
      used: 75,
      amount: 50
    };

    if (mockBudgetCheck.used >= 80) {
      this.sendBudgetAlert(mockBudgetCheck.name, mockBudgetCheck.used, mockBudgetCheck.amount);
    }
  }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService;