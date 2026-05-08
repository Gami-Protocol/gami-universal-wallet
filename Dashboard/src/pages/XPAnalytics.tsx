import React, { useEffect, useState } from 'react';

export default function XPAnalytics() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/analytics/events')
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>XP Analytics</h1>
      <p>Total Events: {data.length}</p>

      {data.map((e, i) => (
        <div key={i} style={{ marginTop: 10 }}>
          {e.type} - {e.userId}
        </div>
      ))}
    </div>
  );
}
