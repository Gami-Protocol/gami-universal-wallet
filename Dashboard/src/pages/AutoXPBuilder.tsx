import React, { useEffect, useState } from 'react';

export default function AutoXPBuilder() {
  const [events, setEvents] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/analytics/events')
      .then(res => res.json())
      .then(setEvents);
  }, []);

  function generateRules() {
    const newRules = events.map(e => ({
      event: e.type,
      xp: e.type === 'click' ? 10 : e.type === 'scroll' ? 15 : 50,
    }));
    setRules(newRules);
  }

  return (
    <div>
      <h1>Auto XP Builder</h1>

      <button onClick={generateRules}>Generate XP Rules</button>

      <h2>Events</h2>
      {events.map((e, i) => (
        <div key={i}>{e.type}</div>
      ))}

      <h2>Rules</h2>
      {rules.map((r, i) => (
        <div key={i}>{r.event} → {r.xp} XP</div>
      ))}
    </div>
  );
}
