import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { StreakProvider } from './context/StreakContext';
import ProtectedRoute from './components/ProtectedRoute';

import DailyStreakPage from './pages/DailyStreak/DailyStreakPage';
import StreakHistory from './pages/StreakHistory';
import Wallet from './pages/Wallet';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';

export const App = () => {
  return (
    <AuthProvider>
      <StreakProvider>
        <BrowserRouter>
          <Routes>
            {/* Primary Daily Streak Experience (matching reference design Page 62 & 63) */}
            <Route path="/" element={<DailyStreakPage />} />
            <Route path="/daily-streak" element={<DailyStreakPage />} />
            <Route path="/dashboard" element={<DailyStreakPage />} />

            {/* Authenticated Account Pages with standard navigation */}
            <Route
              path="/streak-history"
              element={
                <ProtectedRoute>
                  <div>
                    <Navbar />
                    <StreakHistory />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/wallet"
              element={
                <ProtectedRoute>
                  <div>
                    <Navbar />
                    <Wallet />
                  </div>
                </ProtectedRoute>
              }
            />

            {/* Authentication Pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Fallback to primary daily streak experience */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </StreakProvider>
    </AuthProvider>
  );
};

export default App;
