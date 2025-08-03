import React, { useState, useEffect } from 'react';
import { CloudArrowUpIcon, CloudArrowDownIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import dataService from '../../services/dataService';

const SyncStatus = ({ className = '' }) => {
  const [syncInfo, setSyncInfo] = useState({
    status: 'synced',
    isOnline: true,
    lastSync: null,
    pendingChanges: 0
  });

  useEffect(() => {
    // Get initial sync info
    setSyncInfo(dataService.getSyncInfo());

    // Listen for sync status changes
    const unsubscribe = dataService.addListener((event, data) => {
      if (event === 'syncStatusChanged') {
        setSyncInfo(dataService.getSyncInfo());
      }
    });

    return unsubscribe;
  }, []);

  const getStatusIcon = () => {
    switch (syncInfo.status) {
      case 'syncing':
        return <CloudArrowDownIcon className="w-4 h-4 animate-pulse" />;
      case 'error':
        return <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />;
      case 'offline':
        return <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" />;
      case 'synced':
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      default:
        return <CloudArrowUpIcon className="w-4 h-4" />;
    }
  };

  const getStatusText = () => {
    switch (syncInfo.status) {
      case 'syncing':
        return 'Syncing...';
      case 'error':
        return 'Sync failed';
      case 'offline':
        return 'Offline';
      case 'synced':
        return syncInfo.pendingChanges > 0 ? `${syncInfo.pendingChanges} pending` : 'All saved';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = () => {
    switch (syncInfo.status) {
      case 'syncing':
        return 'text-blue-600';
      case 'error':
        return 'text-red-600';
      case 'offline':
        return 'text-yellow-600';
      case 'synced':
        return syncInfo.pendingChanges > 0 ? 'text-orange-600' : 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleForceSync = async () => {
    try {
      await dataService.forceSyncNow();
    } catch (error) {
      console.error('Force sync failed:', error);
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-center space-x-1">
        {getStatusIcon()}
        <span className={`text-xs font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>
      
      {syncInfo.status === 'error' && (
        <button
          onClick={handleForceSync}
          className="text-xs text-blue-600 hover:text-blue-800 underline"
        >
          Retry
        </button>
      )}
      
      {syncInfo.lastSync && (
        <span className="text-xs text-gray-500">
          {new Date(syncInfo.lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      )}
    </div>
  );
};

export default SyncStatus;