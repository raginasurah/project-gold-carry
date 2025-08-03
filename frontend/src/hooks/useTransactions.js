// frontend/src/hooks/useTransactions.js
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { api } from '../config/api';
import { toast } from 'react-toastify';

// Query keys
const QUERY_KEYS = {
  transactions: 'transactions',
  summary: 'transaction-summary',
  categories: 'transaction-categories',
};

// Fetch transactions hook
export const useTransactions = (filters = {}) => {
  return useQuery(
    [QUERY_KEYS.transactions, filters],
    () => api.transactions.list(filters),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      onError: (error) => {
        console.error('Failed to fetch transactions:', error);
        toast.error('Failed to load transactions');
      },
    }
  );
};

// Create transaction hook
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (newTransaction) => api.transactions.create(newTransaction),
    {
      onSuccess: (data) => {
        // Invalidate and refetch
        queryClient.invalidateQueries(QUERY_KEYS.transactions);
        queryClient.invalidateQueries(QUERY_KEYS.summary);
        toast.success('Transaction created successfully');
      },
      onError: (error) => {
        console.error('Failed to create transaction:', error);
        toast.error(error.message || 'Failed to create transaction');
      },
    }
  );
};

// Update transaction hook
export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ id, data }) => api.transactions.update(id, data),
    {
      onSuccess: (data, variables) => {
        // Update cache optimistically
        queryClient.setQueryData(
          [QUERY_KEYS.transactions, variables.id],
          data
        );
        queryClient.invalidateQueries(QUERY_KEYS.transactions);
        queryClient.invalidateQueries(QUERY_KEYS.summary);
        toast.success('Transaction updated successfully');
      },
      onError: (error) => {
        console.error('Failed to update transaction:', error);
        toast.error(error.message || 'Failed to update transaction');
      },
    }
  );
};

// Delete transaction hook
export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (id) => api.transactions.delete(id),
    {
      onSuccess: (_, id) => {
        queryClient.invalidateQueries(QUERY_KEYS.transactions);
        queryClient.invalidateQueries(QUERY_KEYS.summary);
        toast.success('Transaction deleted successfully');
      },
      onError: (error) => {
        console.error('Failed to delete transaction:', error);
        toast.error(error.message || 'Failed to delete transaction');
      },
    }
  );
};

// Transaction summary hook
export const useTransactionSummary = (startDate, endDate) => {
  return useQuery(
    [QUERY_KEYS.summary, { startDate, endDate }],
    () => api.transactions.summary({ start_date: startDate, end_date: endDate }),
    {
      enabled: !!startDate && !!endDate,
      staleTime: 10 * 60 * 1000, // 10 minutes
      onError: (error) => {
        console.error('Failed to fetch summary:', error);
        toast.error('Failed to load transaction summary');
      },
    }
  );
};

// Bulk operations hook
export const useBulkCreateTransactions = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (transactions) => api.transactions.createBulk(transactions),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEYS.transactions);
        queryClient.invalidateQueries(QUERY_KEYS.summary);
        toast.success('Transactions imported successfully');
      },
      onError: (error) => {
        console.error('Failed to import transactions:', error);
        toast.error(error.message || 'Failed to import transactions');
      },
    }
  );
};

// Export transactions hook
export const useExportTransactions = () => {
  return useMutation(
    ({ startDate, endDate, format = 'csv' }) => 
      api.transactions.export({ start_date: startDate, end_date: endDate, format }),
    {
      onSuccess: (data, variables) => {
        // Download file
        const blob = new Blob([data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast.success('Transactions exported successfully');
      },
      onError: (error) => {
        console.error('Failed to export transactions:', error);
        toast.error('Failed to export transactions');
      },
    }
  );
}; 