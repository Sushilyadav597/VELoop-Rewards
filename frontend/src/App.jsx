import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StreakProvider } from './context/StreakContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingState from './components/LoadingState';

import Dashboard from './pages/Dashboard';
import DailyStreakPage from './pages/DailyStreak/DailyStreakPage';
import TasksPage from './pages/TasksPage';
import LeaderboardPage from './pages/LeaderboardPage';
import BadgesPage from './pages/BadgesPage';
import Wallet from './pages/Wallet';
import StreakHistory from './pages/StreakHistory';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

/**
 * RootRoute: Enforces initial navigation to /register for unauthenticated visitors.
 * If authenticated, proceeds directly to /dashboard.
 */
const RootRoute = () => {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return <LoadingState message="Loading VELoop Rewards..." fullPage />;
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/register" replace />;
};

export const App = () => {
  return (
    <AuthProvider>
      <StreakProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Initial Landing Route: Opens Register first for new/unauthenticated visitors */}
              <Route path="/" element={<RootRoute />} />

              {/* Protected Core Application Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/daily-streak"
                element={
                  <ProtectedRoute>
                    <DailyStreakPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <TasksPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/leaderboard"
                element={
                  <ProtectedRoute>
                    <LeaderboardPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/badges"
                element={
                  <ProtectedRoute>
                    <BadgesPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/wallet"
                element={
                  <ProtectedRoute>
                    <Wallet />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/streak-history"
                element={
                  <ProtectedRoute>
                    <StreakHistory />
                  </ProtectedRoute>
                }
              />

              {/* Authentication Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Fallback Catch-All Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </StreakProvider>
    </AuthProvider>
  );
};

export default App;
