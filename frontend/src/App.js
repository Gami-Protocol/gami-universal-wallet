import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import HomeScreen from './screens/HomeScreen';
import WalletScreen from './screens/WalletScreen';
import RewardsScreen from './screens/RewardsScreen';
import MissionsScreen from './screens/MissionsScreen';
import EarnScreen from './screens/EarnScreen';
import CheckInScreen from './screens/CheckInScreen';
import WheelsScreen from './screens/WheelsScreen';
import ProfileScreen from './screens/ProfileScreen';
import BottomNav from './components/BottomNav';
import LoadingScreen from './components/LoadingScreen';
import './App.css';

function AppContent() {
  const { darkMode, loading } = useApp();
  const [activeTab, setActiveTab] = useState('home');
  const [overlay, setOverlay] = useState(null); // 'checkin' | 'wheels' | 'profile'

  if (loading) return <LoadingScreen />;

  const renderScreen = () => {
    if (overlay === 'checkin') return <CheckInScreen onBack={() => setOverlay(null)} />;
    if (overlay === 'wheels') return <WheelsScreen onBack={() => setOverlay(null)} />;
    if (overlay === 'profile') return <ProfileScreen onBack={() => setOverlay(null)} />;
    switch (activeTab) {
      case 'home': return <HomeScreen onOpenOverlay={setOverlay} />;
      case 'wallet': return <WalletScreen />;
      case 'rewards': return <RewardsScreen />;
      case 'missions': return <MissionsScreen onOpenOverlay={setOverlay} />;
      case 'earn': return <EarnScreen />;
      default: return <HomeScreen onOpenOverlay={setOverlay} />;
    }
  };

  return (
    <div className={`app-shell ${darkMode ? '' : 'light-mode'} noise-bg`}>
      <div className="app-container">
        {renderScreen()}
        <BottomNav activeTab={activeTab} setActiveTab={(t) => { setActiveTab(t); setOverlay(null); }} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
