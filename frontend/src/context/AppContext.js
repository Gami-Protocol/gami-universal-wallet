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
  const [tokens, setTokens] = useState([]);
  const [nfts, setNfts] = useState([]);
  const [pools, setPools] = useState([]);
  const [staking, setStaking] = useState([]);
  const [networks, setNetworks] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try { const r = await fetch(`${API}/api/user`); setUser(await r.json()); } catch (e) { console.error(e); }
  }, []);
  const fetchRewards = useCallback(async (category, search) => {
    try {
      let url = `${API}/api/rewards`;
      const p = new URLSearchParams();
      if (category && category !== 'all') p.set('category', category);
      if (search) p.set('search', search);
      if (p.toString()) url += '?' + p.toString();
      const r = await fetch(url); setRewards(await r.json());
    } catch (e) { console.error(e); }
  }, []);
  const fetchMissions = useCallback(async () => {
    try { const r = await fetch(`${API}/api/missions`); setMissions(await r.json()); } catch (e) { console.error(e); }
  }, []);
  const fetchCheckins = useCallback(async () => {
    try { const r = await fetch(`${API}/api/checkins`); setCheckins(await r.json()); } catch (e) { console.error(e); }
  }, []);
  const fetchTransactions = useCallback(async () => {
    try { const r = await fetch(`${API}/api/transactions`); setTransactions(await r.json()); } catch (e) { console.error(e); }
  }, []);
  const fetchTokens = useCallback(async () => {
    try { const r = await fetch(`${API}/api/tokens`); setTokens(await r.json()); } catch (e) { console.error(e); }
  }, []);
  const fetchNfts = useCallback(async () => {
    try { const r = await fetch(`${API}/api/nfts`); setNfts(await r.json()); } catch (e) { console.error(e); }
  }, []);
  const fetchPools = useCallback(async () => {
    try { const r = await fetch(`${API}/api/pools`); setPools(await r.json()); } catch (e) { console.error(e); }
  }, []);
  const fetchStaking = useCallback(async () => {
    try { const r = await fetch(`${API}/api/staking`); setStaking(await r.json()); } catch (e) { console.error(e); }
  }, []);
  const fetchNetworks = useCallback(async () => {
    try { const r = await fetch(`${API}/api/networks`); setNetworks(await r.json()); } catch (e) { console.error(e); }
  }, []);

  const doCheckin = useCallback(async () => {
    try {
      const r = await fetch(`${API}/api/user/checkin`, { method: 'PUT' });
      const d = await r.json();
      if (d.success) { await fetchUser(); await fetchCheckins(); }
      return d;
    } catch (e) { return { success: false }; }
  }, [fetchUser, fetchCheckins]);

  const redeemReward = useCallback(async (title) => {
    try {
      const r = await fetch(`${API}/api/rewards/redeem`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title }) });
      const d = await r.json();
      if (d.success) { await fetchUser(); await fetchRewards(); }
      return d;
    } catch (e) { return { success: false }; }
  }, [fetchUser, fetchRewards]);

  const completeMission = useCallback(async (title) => {
    try {
      const r = await fetch(`${API}/api/missions/complete`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title }) });
      const d = await r.json();
      if (d.success) { await fetchUser(); await fetchMissions(); }
      return d;
    } catch (e) { return { success: false }; }
  }, [fetchUser, fetchMissions]);

  const spinWheel = useCallback(async () => {
    try {
      const r = await fetch(`${API}/api/spin`, { method: 'POST' });
      const d = await r.json();
      if (d.success) { await fetchUser(); }
      return d;
    } catch (e) { return { success: false }; }
  }, [fetchUser]);

  const toggleDarkMode = useCallback(() => setDarkMode(p => !p), []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([fetchUser(), fetchRewards(), fetchMissions(), fetchCheckins(), fetchTransactions(), fetchTokens(), fetchNfts(), fetchPools(), fetchStaking(), fetchNetworks()]);
      setLoading(false);
    })();
  }, [fetchUser, fetchRewards, fetchMissions, fetchCheckins, fetchTransactions, fetchTokens, fetchNfts, fetchPools, fetchStaking, fetchNetworks]);

  return (
    <AppContext.Provider value={{
      user, rewards, missions, checkins, transactions, tokens, nfts, pools, staking, networks, darkMode, loading,
      fetchUser, fetchRewards, fetchMissions, fetchCheckins, fetchTransactions, fetchTokens, fetchNfts, fetchPools, fetchStaking, fetchNetworks,
      doCheckin, redeemReward, completeMission, spinWheel, toggleDarkMode,
    }}>
      {children}
    </AppContext.Provider>
  );
}
