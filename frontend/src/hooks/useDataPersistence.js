import { useState, useEffect, useCallback, useRef } from 'react';
import dataService from '../services/dataService';

// Custom hook for data persistence with sync status
export const useDataPersistence = (key, defaultValue = null, options = {}) => {
  const {
    autoSave = true,
    syncImmediately = false,
    debounceMs = 1000,
    componentName = 'unknown'
  } = options;

  const [data, setData] = useState(() => dataService.loadData(key, defaultValue));
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const saveTimeoutRef = useRef(null);
  const mountedRef = useRef(true);

  // Save function
  const saveData = useCallback(async (newData, saveOptions = {}) => {
    if (!mountedRef.current) return;

    const mergedOptions = { syncImmediately, ...saveOptions };
    
    setIsSaving(true);
    
    try {
      const result = await dataService.saveData(key, newData, mergedOptions);
      
      if (mountedRef.current) {
        if (result.success) {
          setLastSaved(new Date());
          setHasUnsavedChanges(false);
          dataService.markClean(componentName);
        }
        setIsSaving(false);
      }
      
      return result;
    } catch (error) {
      if (mountedRef.current) {
        setIsSaving(false);
      }
      console.error('Save failed:', error);
      return { success: false, error: error.message };
    }
  }, [key, syncImmediately, componentName]);

  // Debounced save function
  const debouncedSave = useCallback((newData) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setHasUnsavedChanges(true);
    dataService.markDirty(componentName);

    if (autoSave) {
      saveTimeoutRef.current = setTimeout(() => {
        saveData(newData);
      }, debounceMs);
    }
  }, [saveData, autoSave, debounceMs, componentName]);

  // Update data with automatic saving
  const updateData = useCallback((newData, saveOptions = {}) => {
    setData(newData);
    
    if (saveOptions.immediate) {
      return saveData(newData, saveOptions);
    } else {
      debouncedSave(newData);
      return Promise.resolve({ success: true });
    }
  }, [saveData, debouncedSave]);

  // Force save immediately
  const forceSave = useCallback(async (saveOptions = {}) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
    
    return await saveData(data, { syncImmediately: true, ...saveOptions });
  }, [data, saveData]);

  // Reload data from storage
  const reloadData = useCallback(() => {
    setIsLoading(true);
    try {
      const loadedData = dataService.loadData(key, defaultValue);
      setData(loadedData);
      setHasUnsavedChanges(false);
      dataService.markClean(componentName);
    } catch (error) {
      console.error('Reload failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [key, defaultValue, componentName]);

  // Listen for external data changes
  useEffect(() => {
    const unsubscribe = dataService.addListener((event, eventData) => {
      if (!mountedRef.current) return;

      switch (event) {
        case 'dataChanged':
          if (eventData.key === key) {
            // Don't update if we have unsaved changes
            if (!hasUnsavedChanges) {
              setData(eventData.data);
            }
          }
          break;

        case 'autoSave':
          if (eventData.dirtyComponents.includes(componentName) && hasUnsavedChanges) {
            forceSave({ silent: true });
          }
          break;

        case 'syncCompleted':
          setLastSaved(new Date(eventData.timestamp));
          break;

        default:
          break;
      }
    });

    return unsubscribe;
  }, [key, hasUnsavedChanges, componentName, forceSave]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Save any pending changes before unmounting
      if (hasUnsavedChanges && data !== null) {
        dataService.saveData(key, data, { silent: true });
      }
      
      dataService.markClean(componentName);
    };
  }, [key, data, hasUnsavedChanges, componentName]);

  // Auto-save on window beforeunload
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (hasUnsavedChanges) {
        // Save immediately before page unload
        dataService.saveData(key, data, { silent: true });
        
        // Show warning for unsaved changes
        event.preventDefault();
        event.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges, key, data]);

  // Get data metadata
  const getDataMeta = useCallback(() => {
    return dataService.getDataMeta(key);
  }, [key]);

  return {
    data,
    setData: updateData,
    saveData: forceSave,
    reloadData,
    isLoading,
    isSaving,
    hasUnsavedChanges,
    lastSaved,
    getDataMeta
  };
};

// Hook for managing multiple data keys
export const useMultiDataPersistence = (keys, defaultValues = {}, options = {}) => {
  const [dataMap, setDataMap] = useState(() => {
    const initial = {};
    keys.forEach(key => {
      initial[key] = dataService.loadData(key, defaultValues[key] || null);
    });
    return initial;
  });

  const [statusMap, setStatusMap] = useState(() => {
    const initial = {};
    keys.forEach(key => {
      initial[key] = {
        isLoading: false,
        isSaving: false,
        hasUnsavedChanges: false,
        lastSaved: null
      };
    });
    return initial;
  });

  // Save specific key
  const saveKey = useCallback(async (key, data, saveOptions = {}) => {
    setStatusMap(prev => ({
      ...prev,
      [key]: { ...prev[key], isSaving: true }
    }));

    try {
      const result = await dataService.saveData(key, data, saveOptions);
      
      setStatusMap(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          isSaving: false,
          hasUnsavedChanges: !result.success,
          lastSaved: result.success ? new Date() : prev[key].lastSaved
        }
      }));

      return result;
    } catch (error) {
      setStatusMap(prev => ({
        ...prev,
        [key]: { ...prev[key], isSaving: false }
      }));
      throw error;
    }
  }, []);

  // Update specific key
  const updateKey = useCallback((key, data, saveOptions = {}) => {
    setDataMap(prev => ({ ...prev, [key]: data }));
    
    if (saveOptions.immediate) {
      return saveKey(key, data, saveOptions);
    } else {
      setStatusMap(prev => ({
        ...prev,
        [key]: { ...prev[key], hasUnsavedChanges: true }
      }));
      return Promise.resolve({ success: true });
    }
  }, [saveKey]);

  // Save all pending changes
  const saveAll = useCallback(async () => {
    const results = {};
    
    for (const key of keys) {
      if (statusMap[key]?.hasUnsavedChanges) {
        results[key] = await saveKey(key, dataMap[key]);
      }
    }
    
    return results;
  }, [keys, dataMap, statusMap, saveKey]);

  return {
    data: dataMap,
    status: statusMap,
    updateKey,
    saveKey,
    saveAll
  };
};

export default useDataPersistence;