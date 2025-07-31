// Advanced Data Persistence Service with Sync Status
import { v4 as uuidv4 } from 'uuid';

class DataService {
  constructor() {
    this.syncStatus = 'offline'; // 'offline', 'syncing', 'synced', 'error'
    this.lastSyncTime = null;
    this.pendingChanges = [];
    this.isOnline = navigator.onLine;
    this.listeners = new Set();
    this.autoSaveInterval = null;
    
    // Initialize
    this.init();
  }

  init() {
    // Set up online/offline detection
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.updateSyncStatus('syncing');
      this.syncPendingChanges();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.updateSyncStatus('offline');
    });

    // Auto-save every 30 seconds
    this.autoSaveInterval = setInterval(() => {
      this.autoSave();
    }, 30000);

    // Load initial sync status
    this.loadSyncStatus();
  }

  // Storage keys
  getStorageKeys() {
    return {
      SETTINGS: 'financeAppSettings',
      FAMILY_MEMBERS: 'familyMembers',
      SHARED_BUDGETS: 'sharedBudgets',
      TRANSACTIONS: 'userTransactions',
      BUDGETS: 'userBudgets',
      GOALS: 'userGoals',
      SUBSCRIPTIONS: 'userSubscriptions',
      INVESTMENTS: 'userInvestments',
      SYNC_STATUS: 'syncStatus',
      LAST_SYNC: 'lastSyncTime',
      PENDING_CHANGES: 'pendingChanges',
      DATA_VERSION: 'dataVersion'
    };
  }

  // Generate unique change ID
  generateChangeId() {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Save data with versioning and sync tracking
  async saveData(key, data, options = {}) {
    try {
      const { syncImmediately = false, silent = false } = options;
      const storageKey = this.getStorageKeys()[key] || key;
      
      // Add metadata
      const dataWithMeta = {
        data,
        version: Date.now(),
        lastModified: new Date().toISOString(),
        changeId: this.generateChangeId()
      };

      // Save to localStorage with error handling
      try {
        localStorage.setItem(storageKey, JSON.stringify(dataWithMeta));
      } catch (storageError) {
        if (storageError.name === 'QuotaExceededError') {
          this.clearOldData();
          localStorage.setItem(storageKey, JSON.stringify(dataWithMeta));
        } else {
          throw storageError;
        }
      }

      // Track change for sync
      const change = {
        id: dataWithMeta.changeId,
        key: storageKey,
        action: 'update',
        data: dataWithMeta,
        timestamp: Date.now(),
        synced: false
      };

      this.pendingChanges.push(change);
      this.savePendingChanges();

      // Update sync status
      if (this.isOnline && syncImmediately) {
        await this.syncPendingChanges();
      } else if (!this.isOnline) {
        this.updateSyncStatus('offline');
      }

      // Notify listeners
      if (!silent) {
        this.notifyListeners('dataChanged', { key, data, change });
      }

      return { success: true, changeId: dataWithMeta.changeId };

    } catch (error) {
      console.error('Error saving data:', error);
      this.updateSyncStatus('error');
      return { success: false, error: error.message };
    }
  }

  // Load data with fallback and validation
  loadData(key, defaultValue = null) {
    try {
      const storageKey = this.getStorageKeys()[key] || key;
      const stored = localStorage.getItem(storageKey);
      
      if (!stored) {
        return defaultValue;
      }

      const parsed = JSON.parse(stored);
      
      // Handle both new format (with metadata) and legacy format
      if (parsed && typeof parsed === 'object' && parsed.data !== undefined) {
        // New format with metadata
        return parsed.data;
      } else {
        // Legacy format - migrate to new format
        this.saveData(key, parsed, { silent: true });
        return parsed;
      }

    } catch (error) {
      console.error(`Error loading data for key ${key}:`, error);
      return defaultValue;
    }
  }

  // Get data metadata
  getDataMeta(key) {
    try {
      const storageKey = this.getStorageKeys()[key] || key;
      const stored = localStorage.getItem(storageKey);
      
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      
      if (parsed && typeof parsed === 'object' && parsed.version !== undefined) {
        return {
          version: parsed.version,
          lastModified: parsed.lastModified,
          changeId: parsed.changeId
        };
      }

      return null;
    } catch (error) {
      console.error(`Error getting metadata for key ${key}:`, error);
      return null;
    }
  }

  // Sync pending changes (simulated - replace with real API calls)
  async syncPendingChanges() {
    if (!this.isOnline || this.pendingChanges.length === 0) {
      return;
    }

    this.updateSyncStatus('syncing');

    try {
      // Simulate API sync delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      // In a real app, this would make API calls to sync data
      // For demo, we'll just mark changes as synced
      const unsyncedChanges = this.pendingChanges.filter(change => !change.synced);
      
      for (const change of unsyncedChanges) {
        // Simulate successful sync
        change.synced = true;
        change.syncedAt = Date.now();
      }

      // Remove synced changes older than 24 hours
      const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
      this.pendingChanges = this.pendingChanges.filter(
        change => !change.synced || change.timestamp > oneDayAgo
      );

      this.savePendingChanges();
      this.lastSyncTime = new Date().toISOString();
      this.saveLastSyncTime();
      this.updateSyncStatus('synced');

      // Notify listeners
      this.notifyListeners('syncCompleted', { 
        syncedCount: unsyncedChanges.length,
        timestamp: this.lastSyncTime 
      });

    } catch (error) {
      console.error('Sync failed:', error);
      this.updateSyncStatus('error');
      
      // Notify listeners
      this.notifyListeners('syncFailed', { error: error.message });
    }
  }

  // Auto-save dirty data
  autoSave() {
    // Check for any components that have indicated they have unsaved changes
    const dirtyComponents = this.loadData('DIRTY_COMPONENTS', []);
    
    if (dirtyComponents.length > 0) {
      console.log('Auto-saving dirty components:', dirtyComponents);
      // Trigger save for dirty components
      this.notifyListeners('autoSave', { dirtyComponents });
      
      // Clear dirty components list
      this.saveData('DIRTY_COMPONENTS', [], { silent: true });
    }
  }

  // Mark component as having unsaved changes
  markDirty(componentName) {
    const dirtyComponents = this.loadData('DIRTY_COMPONENTS', []);
    if (!dirtyComponents.includes(componentName)) {
      dirtyComponents.push(componentName);
      this.saveData('DIRTY_COMPONENTS', dirtyComponents, { silent: true });
    }
  }

  // Clear dirty status for component
  markClean(componentName) {
    const dirtyComponents = this.loadData('DIRTY_COMPONENTS', []);
    const filtered = dirtyComponents.filter(name => name !== componentName);
    this.saveData('DIRTY_COMPONENTS', filtered, { silent: true });
  }

  // Update sync status
  updateSyncStatus(status) {
    if (this.syncStatus !== status) {
      this.syncStatus = status;
      localStorage.setItem(this.getStorageKeys().SYNC_STATUS, status);
      
      // Notify listeners
      this.notifyListeners('syncStatusChanged', { 
        status, 
        isOnline: this.isOnline,
        lastSync: this.lastSyncTime,
        pendingChanges: this.pendingChanges.filter(c => !c.synced).length
      });
    }
  }

  // Load sync status
  loadSyncStatus() {
    const savedStatus = localStorage.getItem(this.getStorageKeys().SYNC_STATUS);
    const savedLastSync = localStorage.getItem(this.getStorageKeys().LAST_SYNC);
    const savedPendingChanges = localStorage.getItem(this.getStorageKeys().PENDING_CHANGES);

    this.syncStatus = savedStatus || (this.isOnline ? 'synced' : 'offline');
    this.lastSyncTime = savedLastSync;
    
    if (savedPendingChanges) {
      try {
        this.pendingChanges = JSON.parse(savedPendingChanges);
      } catch (error) {
        console.error('Error loading pending changes:', error);
        this.pendingChanges = [];
      }
    }
  }

  // Save pending changes
  savePendingChanges() {
    localStorage.setItem(
      this.getStorageKeys().PENDING_CHANGES, 
      JSON.stringify(this.pendingChanges)
    );
  }

  // Save last sync time
  saveLastSyncTime() {
    localStorage.setItem(this.getStorageKeys().LAST_SYNC, this.lastSyncTime);
  }

  // Clear old data when storage is full
  clearOldData() {
    const keys = Object.values(this.getStorageKeys());
    let clearedAny = false;

    // Remove old pending changes first
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    this.pendingChanges = this.pendingChanges.filter(
      change => change.timestamp > oneWeekAgo
    );
    this.savePendingChanges();
    clearedAny = true;

    // If still need space, could implement more aggressive cleanup here
    if (clearedAny) {
      console.log('Cleared old data to free storage space');
    }
  }

  // Export all data for backup
  exportAllData() {
    const keys = this.getStorageKeys();
    const exportData = {
      exportTime: new Date().toISOString(),
      version: '1.0',
      data: {}
    };

    Object.entries(keys).forEach(([name, storageKey]) => {
      const data = this.loadData(name);
      const meta = this.getDataMeta(name);
      
      if (data !== null) {
        exportData.data[name] = { data, meta };
      }
    });

    exportData.syncStatus = {
      status: this.syncStatus,
      lastSync: this.lastSyncTime,
      pendingChanges: this.pendingChanges.length,
      isOnline: this.isOnline
    };

    return exportData;
  }

  // Import data from backup
  async importData(importedData) {
    try {
      if (!importedData.data) {
        throw new Error('Invalid import data format');
      }

      let importedCount = 0;

      Object.entries(importedData.data).forEach(([key, { data }]) => {
        if (data !== null) {
          this.saveData(key, data, { silent: true });
          importedCount++;
        }
      });

      // Trigger sync after import
      if (this.isOnline) {
        await this.syncPendingChanges();
      }

      return { success: true, importedCount };

    } catch (error) {
      console.error('Import failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Add listener for data changes
  addListener(callback) {
    this.listeners.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  // Notify all listeners
  notifyListeners(event, data) {
    this.listeners.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('Error in data service listener:', error);
      }
    });
  }

  // Get current sync information
  getSyncInfo() {
    return {
      status: this.syncStatus,
      isOnline: this.isOnline,
      lastSync: this.lastSyncTime,
      pendingChanges: this.pendingChanges.filter(c => !c.synced).length,
      totalChanges: this.pendingChanges.length
    };
  }

  // Force sync now
  async forceSyncNow() {
    if (!this.isOnline) {
      throw new Error('Cannot sync while offline');
    }

    await this.syncPendingChanges();
  }

  // Cleanup on destroy
  destroy() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
    
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
    
    this.listeners.clear();
  }
}

// Create singleton instance
const dataService = new DataService();

// Add UUID dependency check (in a real app, you'd install uuid package)
if (typeof uuidv4 === 'undefined') {
  console.warn('UUID library not available, using fallback ID generator');
  // Simple fallback ID generator
  dataService.generateChangeId = function() {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };
}

export default dataService;