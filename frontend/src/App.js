import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import HomeScreen from './screens/HomeScreen';
import RewardsScreen from './screens/RewardsScreen';
import PointsScreen from './screens/PointsScreen';
import WheelsScreen from './screens/WheelsScreen';
import CheckInScreen from './screens/CheckInScreen';
import BottomNav from './components/BottomNav';
import LoadingScreen from './components/LoadingScreen';
import './App.css';

function AppContent() {
  const { darkMode, loading } = useApp();
  const [activeTab, setActiveTab] = useState('home');
  const [showCheckIn, setShowCheckIn] = useState(false);

  if (loading) return <LoadingScreen />;

  const renderScreen = () => {
    if (showCheckIn) return <CheckInScreen onBack={() => setShowCheckIn(false)} />;
    switch (activeTab) {
      case 'home': return <HomeScreen onCheckIn={() => setShowCheckIn(true)} />;
      case 'rewards': return <RewardsScreen />;
      case 'points': return <PointsScreen />;
      case 'wheels': return <WheelsScreen />;
      default: return <HomeScreen onCheckIn={() => setShowCheckIn(true)} />;
    }
  };

  return (
    <div className={`app-shell ${darkMode ? '' : 'light-mode'} noise-bg`}>
      <div className="app-container">
        {renderScreen()}
        <BottomNav activeTab={activeTab} setActiveTab={(t) => { setActiveTab(t); setShowCheckIn(false); }} />
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
