import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API = process.env.REACT_APP_BACKEND_URL;

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [missions, setMissions] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/user`);
      const data = await res.json();
      setUser(data);
    } catch (e) { console.error('fetchUser', e); }
  }, []);

  const fetchRewards = useCallback(async (category, search) => {
    try {
      let url = `${API}/api/rewards`;
      const params = new URLSearchParams();
      if (category && category !== 'all') params.set('category', category);
      if (search) params.set('search', search);
      if (params.toString()) url += '?' + params.toString();
      const res = await fetch(url);
      const data = await res.json();
      setRewards(data);
    } catch (e) { console.error('fetchRewards', e); }
  }, []);

  const fetchMissions = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/missions`);
      const data = await res.json();
      setMissions(data);
    } catch (e) { console.error('fetchMissions', e); }
  }, []);

  const fetchCheckins = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/checkins`);
      const data = await res.json();
      setCheckins(data);
    } catch (e) { console.error('fetchCheckins', e); }
  }, []);

  const fetchTransactions = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/transactions`);
      const data = await res.json();
      setTransactions(data);
    } catch (e) { console.error('fetchTransactions', e); }
  }, []);

  const doCheckin = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/user/checkin`, { method: 'PUT' });
      const data = await res.json();
      if (data.success) {
        await fetchUser();
        await fetchCheckins();
      }
      return data;
    } catch (e) { console.error('doCheckin', e); return { success: false }; }
  }, [fetchUser, fetchCheckins]);

  const redeemReward = useCallback(async (title) => {
    try {
      const res = await fetch(`${API}/api/rewards/redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchUser();
        await fetchRewards();
      }
      return data;
    } catch (e) { console.error('redeemReward', e); return { success: false }; }
  }, [fetchUser, fetchRewards]);

  const completeMission = useCallback(async (title) => {
    try {
      const res = await fetch(`${API}/api/missions/complete`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchUser();
        await fetchMissions();
      }
      return data;
    } catch (e) { console.error('completeMission', e); return { success: false }; }
  }, [fetchUser, fetchMissions]);

  const spinWheel = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/spin`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await fetchUser();
      }
      return data;
    } catch (e) { console.error('spinWheel', e); return { success: false }; }
  }, [fetchUser]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  useEffect(() => {
    async function init() {
      setLoading(true);
      await Promise.all([fetchUser(), fetchRewards(), fetchMissions(), fetchCheckins(), fetchTransactions()]);
      setLoading(false);
    }
    init();
  }, [fetchUser, fetchRewards, fetchMissions, fetchCheckins, fetchTransactions]);

  return (
    <AppContext.Provider value={{
      user, rewards, missions, checkins, transactions, darkMode, loading,
      fetchUser, fetchRewards, fetchMissions, fetchCheckins, fetchTransactions,
      doCheckin, redeemReward, completeMission, spinWheel, toggleDarkMode,
    }}>
      {children}
    </AppContext.Provider>
  );
}
