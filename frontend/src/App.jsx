import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { StreakProvider } from './context/StreakContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';

import Dashboard from './pages/Dashboard';
import DailyStreakPage from './pages/DailyStreak/DailyStreakPage';
import LuckySpinPage from './pages/LuckySpinPage';
import TasksPage from './pages/TasksPage';
import LeaderboardPage from './pages/LeaderboardPage';
import BadgesPage from './pages/BadgesPage';
import Wallet from './pages/Wallet';
import StreakHistory from './pages/StreakHistory';
import Login from './pages/Login';
import Register from './pages/Register';

export const App = () => {
  return (
    <AuthProvider>
      <StreakProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Flagship Dashboard Page */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Complete Daily Streak & Rotating Drops Experience */}
              <Route path="/daily-streak" element={<DailyStreakPage />} />

              {/* Interactive Lucky Spin Feature */}
              <Route path="/lucky-spin" element={<LuckySpinPage />} />

              {/* Activities & Tasks Experience */}
              <Route path="/tasks" element={<TasksPage />} />

              {/* Global Leaderboard Standings */}
              <Route path="/leaderboard" element={<LeaderboardPage />} />

              {/* Achievements & Badges Gallery */}
              <Route path="/badges" element={<BadgesPage />} />

              {/* Cryptographic Rewards Wallet & Ledger */}
              <Route path="/wallet" element={<Wallet />} />

              {/* Check-In History */}
              <Route path="/streak-history" element={<StreakHistory />} />

              {/* Authentication */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Fallback to Dashboard */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </StreakProvider>
    </AuthProvider>
  );
};

export default App;
