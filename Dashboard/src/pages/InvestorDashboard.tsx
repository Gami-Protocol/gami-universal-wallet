import React, { useEffect, useState } from 'react';

export default function InvestorDashboard() {
  const [metrics, setMetrics] = useState<any>({});

  useEffect(() => {
    fetch('/api/analytics/summary')
      .then(res => res.json())
      .then(setMetrics);
  }, []);

  return (
    <div style={{ padding: 32 }}>
      <h1>Gami Protocol Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        <div>
          <h3>Users</h3>
          <p>{metrics.users || 0}</p>
        </div>
        <div>
          <h3>XP Issued</h3>
          <p>{metrics.xp || 0}</p>
        </div>
        <div>
          <h3>Rewards Distributed</h3>
          <p>{metrics.rewards || 0}</p>
        </div>
      </div>

      <h2 style={{ marginTop: 40 }}>Growth</h2>
      <p>Graph placeholder (connect to real chart lib)</p>

      <h2 style={{ marginTop: 40 }}>Top Quests</h2>
      {metrics.topQuests?.map((q: any, i: number) => (
        <div key={i}>{q.name} - {q.completions}</div>
      ))}
    </div>
  );
}
