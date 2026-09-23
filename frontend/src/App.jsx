import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { StreakProvider } from './context/StreakContext';
import DailyStreakPage from './pages/DailyStreak/DailyStreakPage';

function App() {
  return (
    <AuthProvider>
      <StreakProvider>
        <DailyStreakPage />
      </StreakProvider>
    </AuthProvider>
  );
}

export default App;
