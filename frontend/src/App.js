import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Budget from './pages/Budget';
import Transactions from './pages/Transactions';
import AIAssistant from './pages/AIAssistant';
import Goals from './pages/Goals';
import Subscriptions from './pages/Subscriptions';
import Investments from './pages/Investments';
import FamilyHub from './pages/FamilyHub';
import Settings from './pages/Settings';
import notificationService from './services/notificationService';
import './index.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

// Main Layout Component
const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  // Initialize notification service
  useEffect(() => {
    notificationService.startPeriodicNotifications();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/budget" element={
              <ProtectedRoute>
                <MainLayout>
                  <Budget />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/transactions" element={
              <ProtectedRoute>
                <MainLayout>
                  <Transactions />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/ai-assistant" element={
              <ProtectedRoute>
                <MainLayout>
                  <AIAssistant />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/goals" element={
              <ProtectedRoute>
                <MainLayout>
                  <Goals />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/subscriptions" element={
              <ProtectedRoute>
                <MainLayout>
                  <Subscriptions />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/investments" element={
              <ProtectedRoute>
                <MainLayout>
                  <Investments />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/family" element={
              <ProtectedRoute>
                <MainLayout>
                  <FamilyHub />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <MainLayout>
                  <Settings />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;