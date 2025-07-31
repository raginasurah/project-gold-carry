import React, { useState, useEffect } from 'react';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  ArrowPathIcon,
  WifiIcon,
  NoSymbolIcon,
  CloudIcon
} from '@heroicons/react/24/outline';
import dataService from '../../services/dataService';

const SyncStatus = ({ className = '', showDetails = false }) => {
  const [syncInfo, setSyncInfo] = useState(dataService.getSyncInfo());
  const [showTooltip, setShowTooltip] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Listen for sync status changes
    const unsubscribe = dataService.addListener((event, data) => {
      if (event === 'syncStatusChanged' || event === 'syncCompleted' || event === 'syncFailed') {
        setSyncInfo(dataService.getSyncInfo());
        
        if (event === 'syncCompleted' || event === 'syncFailed') {
          setIsAnimating(true);
          setTimeout(() => setIsAnimating(false), 1000);
        }
      }
    });

    // Update sync info every 30 seconds
    const interval = setInterval(() => {
      setSyncInfo(dataService.getSyncInfo());
    }, 30000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const getStatusIcon = () => {
    switch (syncInfo.status) {
      case 'synced':
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'syncing':
        return (
          <ArrowPathIcon 
            className={`w-4 h-4 text-blue-500 ${isAnimating || syncInfo.status === 'syncing' ? 'animate-spin' : ''}`} 
          />
        );
      case 'offline':
        return <NoSymbolIcon className="w-4 h-4 text-gray-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />;
      default:
        return <CloudIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (syncInfo.status) {
      case 'synced': return 'text-green-600';
      case 'syncing': return 'text-blue-600';
      case 'offline': return 'text-gray-500';
      case 'error': return 'text-red-600';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = () => {
    switch (syncInfo.status) {
      case 'synced':
        return syncInfo.pendingChanges > 0 
          ? `${syncInfo.pendingChanges} changes pending`
          : 'All data synced';
      case 'syncing':
        return 'Syncing data...';
      case 'offline':
        return `Offline${syncInfo.pendingChanges > 0 ? ` • ${syncInfo.pendingChanges} pending` : ''}`;
      case 'error':
        return 'Sync error';
      default:
        return 'Unknown status';
    }
  };

  const getLastSyncText = () => {
    if (!syncInfo.lastSync) return 'Never synced';
    
    const lastSync = new Date(syncInfo.lastSync);
    const now = new Date();
    const diffMs = now - lastSync;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const handleForceSync = async () => {
    if (syncInfo.status === 'syncing' || !syncInfo.isOnline) return;
    
    try {
      setIsAnimating(true);
      await dataService.forceSyncNow();
    } catch (error) {
      console.error('Force sync failed:', error);
    } finally {
      setTimeout(() => setIsAnimating(false), 1000);
    }
  };

  if (!showDetails) {
    // Compact version - just icon and status
    return (
      <div 
        className={`flex items-center space-x-2 ${className}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="relative">
          {getStatusIcon()}
          {!syncInfo.isOnline && (
            <WifiIcon className="w-3 h-3 text-gray-400 absolute -bottom-1 -right-1" />
          )}
        </div>
        
        {showTooltip && (
          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
              {getStatusText()}
              {syncInfo.lastSync && (
                <div className="text-gray-400">Last sync: {getLastSyncText()}</div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Detailed version
  return (
    <div className={`bg-white border rounded-lg p-3 shadow-sm ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <div>
            <p className={`text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </p>
            <p className="text-xs text-gray-500">
              Last sync: {getLastSyncText()}
            </p>
          </div>
        </div>

        {/* Online/Offline indicator */}
        <div className="flex items-center space-x-2">
          {syncInfo.isOnline ? (
            <div className="flex items-center space-x-1 text-green-600">
              <WifiIcon className="w-4 h-4" />
              <span className="text-xs">Online</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 text-gray-500">
              <NoSymbolIcon className="w-4 h-4" />
              <span className="text-xs">Offline</span>
            </div>
          )}

          {/* Sync button */}
          {syncInfo.isOnline && syncInfo.status !== 'syncing' && (
            <button
              onClick={handleForceSync}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
              title="Force sync now"
            >
              <ArrowPathIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Progress info */}
      {(syncInfo.pendingChanges > 0 || syncInfo.status === 'syncing') && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="flex justify-between text-xs text-gray-500">
            <span>
              {syncInfo.pendingChanges} change{syncInfo.pendingChanges !== 1 ? 's' : ''} pending
            </span>
            {syncInfo.status === 'syncing' && (
              <span className="text-blue-500">Syncing...</span>
            )}
          </div>
          
          {syncInfo.status === 'syncing' && (
            <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
              <div className="bg-blue-500 h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          )}
        </div>
      )}

      {/* Error details */}
      {syncInfo.status === 'error' && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <p className="text-xs text-red-600">
            Sync failed. Changes are saved locally and will sync when online.
          </p>
        </div>
      )}
    </div>
  );
};

export default SyncStatus;