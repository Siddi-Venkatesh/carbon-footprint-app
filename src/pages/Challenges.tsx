import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';

const CHALLENGES = [
  { id: '1', title: 'No-Car Day', description: 'Commit to zero driving today. Walk, bike, or use public transit.', impact: 'High' },
  { id: '2', title: 'Plant-Based Meal', description: 'Eat at least one fully plant-based (vegan) meal today.', impact: 'Medium' },
  { id: '3', title: 'Unplug Devices', description: 'Unplug all electronics not currently in use.', impact: 'Low' },
  { id: '4', title: 'Zero Waste Day', description: 'Avoid single-use plastics and packaging completely for 24 hours.', impact: 'High' },
  { id: '5', title: 'Recycle Right', description: 'Properly wash and sort all recyclables today.', impact: 'Medium' },
];

export const Challenges: React.FC = () => {
  const [completed, setCompleted] = useState<string[]>([]);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('ecoAssist_challenges');
    if (saved) {
      setCompleted(JSON.parse(saved));
    }
  }, []);

  const toggleChallenge = (id: string) => {
    const isCompleted = completed.includes(id);
    const updated = isCompleted ? completed.filter(c => c !== id) : [...completed, id];
    setCompleted(updated);
    localStorage.setItem('ecoAssist_challenges', JSON.stringify(updated));
  };

  const progress = Math.round((completed.length / CHALLENGES.length) * 100);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Carbon Reduction Challenges</h2>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Complete these simple daily interactive challenges to actively reduce your footprint.
      </p>

      <Card style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h3>Your Progress</h3>
        <div style={{ width: '100%', height: '20px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', margin: '1rem 0', overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', backgroundColor: 'var(--success)', transition: 'width 0.3s ease' }} />
        </div>
        <p>{progress}% Completed ({completed.length}/{CHALLENGES.length})</p>
      </Card>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {CHALLENGES.map((challenge) => {
          const isDone = completed.includes(challenge.id);
          return (
            <div 
              key={challenge.id}
              onClick={() => toggleChallenge(challenge.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1.5rem',
                backgroundColor: isDone ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                border: `1px solid ${isDone ? 'var(--success)' : 'var(--bg-tertiary)'}`,
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                opacity: isDone ? 0.8 : 1
              }}
            >
              <div style={{ 
                width: '24px', 
                height: '24px', 
                borderRadius: '50%', 
                border: `2px solid ${isDone ? 'var(--success)' : 'var(--text-secondary)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '1.5rem',
                backgroundColor: isDone ? 'var(--success)' : 'transparent'
              }}>
                {isDone && <span style={{ color: 'var(--bg-primary)', fontSize: '0.8rem', fontWeight: 'bold' }}>✓</span>}
              </div>
              
              <div style={{ flex: 1 }}>
                <h4 style={{ textDecoration: isDone ? 'line-through' : 'none', color: isDone ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                  {challenge.title}
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  {challenge.description}
                </p>
              </div>
              
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)' }}>
                {challenge.impact} Impact
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
