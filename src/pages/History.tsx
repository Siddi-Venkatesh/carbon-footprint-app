import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { FootprintData, calculateEmissions, getCarbonScore } from '../utils/carbonCalculator';

type HistoryProps = {
  history: FootprintData[];
  onSelect: (id: string) => void;
  onDelete?: (id: string) => void;
};

export const History: React.FC<HistoryProps> = ({ history, onSelect, onDelete }) => {
  const navigate = useNavigate();

  if (history.length === 0) {
    return (
      <div className="animate-fade-in" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h2>No History Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>You haven't calculated your footprint yet.</p>
        <Button onClick={() => navigate('/calculator')}>Calculate Now</Button>
      </div>
    );
  }

  // Sort history newest first
  const sortedHistory = [...history].sort((a, b) => {
    return new Date(b.date || '').getTime() - new Date(a.date || '').getTime();
  });

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Footprint Timeline</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Track your progress and historical calculations over time.</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {sortedHistory.map((item, index) => {
          const emissions = calculateEmissions(item);
          const score = getCarbonScore(emissions.total);
          const isLatest = index === 0;
          
          return (
            <Card 
              key={item.id} 
              style={{ 
                position: 'relative',
                border: isLatest ? '2px solid var(--accent-primary)' : '1px solid var(--bg-tertiary)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              {isLatest && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '20px',
                  background: 'var(--accent-primary)',
                  color: 'var(--bg-primary)',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  Latest Entry
                </div>
              )}
              
              <div style={{ borderBottom: '1px solid var(--bg-tertiary)', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem', color: 'var(--text-primary)' }}>
                    {new Date(item.date || '').toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {new Date(item.date || '').toLocaleTimeString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => navigate('/calculator', { state: { editData: item } })}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', opacity: 0.7 }}
                    title="Edit"
                    aria-label="Edit Calculation"
                  >
                    ✏️
                  </button>
                  {onDelete && (
                    <button 
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this footprint record?")) {
                          onDelete(item.id!);
                        }
                      }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', opacity: 0.7 }}
                      title="Delete"
                      aria-label="Delete Calculation"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>

              <div style={{ margin: '1rem 0' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>Total Emissions</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: '1' }}>
                    {emissions.total.toLocaleString()}
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>kg CO₂e</span>
                </div>
                <div style={{ 
                  marginTop: '0.5rem', 
                  display: 'inline-block',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  backgroundColor: score === 'Low Impact' ? 'rgba(46, 213, 115, 0.2)' : score === 'Medium Impact' ? 'rgba(255, 165, 2, 0.2)' : 'rgba(255, 71, 87, 0.2)',
                  color: score === 'Low Impact' ? 'var(--success)' : score === 'Medium Impact' ? 'var(--warning)' : 'var(--danger)'
                }}>
                  {score}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                <div>🚗 {emissions.transport} kg</div>
                <div>⚡ {emissions.energy} kg</div>
                <div>🍔 {emissions.food} kg</div>
                <div>🗑️ {emissions.waste} kg</div>
              </div>

              <Button 
                variant={isLatest ? 'primary' : 'secondary'} 
                onClick={() => {
                  onSelect(item.id!);
                  navigate('/dashboard');
                }}
                style={{ width: '100%', marginTop: 'auto' }}
              >
                Open Dashboard
              </Button>
            </Card>
          );
        })}
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <Button variant="secondary" onClick={() => navigate('/calculator')}>Run New Calculation</Button>
      </div>
    </div>
  );
};
