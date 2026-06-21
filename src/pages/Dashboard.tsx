import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { FootprintData, calculateEmissions, getCarbonScore } from '../utils/carbonCalculator';

type DashboardProps = {
  data: FootprintData | null;
};


export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const navigate = useNavigate();

  const emissions = useMemo(() => data ? calculateEmissions(data) : null, [data]);
  const scoreLabel = useMemo(() => emissions ? getCarbonScore(emissions.total) : 'Unknown', [emissions]);

  if (!data || data.diet === '') {
    return (
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h2>No data found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Please calculate your footprint first.</p>
        <Button onClick={() => navigate('/calculator')}>Go to Calculator</Button>
      </div>
    );
  }

  const chartData = [
    { name: 'Transport', value: emissions!.transport },
    { name: 'Energy', value: emissions!.energy },
    { name: 'Food', value: emissions!.food },
    { name: 'Waste', value: emissions!.waste },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* SVG Definitions for Neon Glow */}
      <svg style={{ height: 0, width: 0, position: 'absolute' }}>
        <defs>
          <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <linearGradient id="neonGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00c853" />
            <stop offset="100%" stopColor="#69f0ae" />
          </linearGradient>
        </defs>
      </svg>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <Card style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)' }}>
          <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Emissions</h4>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
            {emissions!.total.toLocaleString()} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>kgCO₂e</span>
          </p>
        </Card>
        <Card style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)' }}>
          <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Carbon Score</h4>
          <p style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: scoreLabel === 'Low Impact' ? '#00e676' : scoreLabel === 'Medium Impact' ? '#ffa502' : '#ff4757',
            filter: scoreLabel === 'Low Impact' ? 'drop-shadow(0 0 10px rgba(0, 230, 118, 0.5))' : 'none'
          }}>
            {scoreLabel}
          </p>
        </Card>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        
        {/* Doughnut Chart */}
        <Card style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--text-primary)' }}>Emissions Breakdown by Source</h3>
          <div style={{ height: '300px', position: 'relative' }}>
            {/* Center Text */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total:</p>
              <p style={{ color: 'var(--text-primary)', fontSize: '1.8rem', fontWeight: 'bold' }}>{emissions!.total.toLocaleString()}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>kgCO₂e</p>
            </div>
            
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={chartData} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={70}
                  outerRadius={100}
                  stroke="var(--bg-secondary)"
                  strokeWidth={4}
                >
                  {chartData.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === 0 ? '#00e676' : index === 1 ? '#00c853' : index === 2 ? '#69f0ae' : '#88f0ae'} 
                      style={{ filter: index === 0 ? 'url(#neonGlow)' : 'none' }} // Glow on largest segment
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-tertiary)', border: 'none', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
            {chartData.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                <span style={{ 
                  display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', 
                  backgroundColor: idx === 0 ? '#00e676' : idx === 1 ? '#00c853' : idx === 2 ? '#69f0ae' : '#88f0ae'
                }} />
                <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{Math.round((item.value / emissions!.total) * 100)}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Sources by Category (Horizontal Bars) */}
        <Card style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)' }}>
          <h3 style={{ marginBottom: '2rem', fontSize: '1.1rem', color: 'var(--text-primary)' }}>Top Sources by Category</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {chartData.sort((a,b) => b.value - a.value).map((item, idx) => {
              const percentage = Math.max((item.value / emissions!.total) * 100, 5); // Ensure at least 5% width for visibility
              
              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '80px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{item.name}</div>
                  <div style={{ flex: 1, backgroundColor: 'var(--bg-tertiary)', height: '12px', borderRadius: '6px', overflow: 'visible' }}>
                    <div style={{ 
                      width: `${percentage}%`, 
                      height: '100%', 
                      background: 'url(#neonGradient) left center, linear-gradient(90deg, #00c853, #69f0ae)',
                      borderRadius: '6px',
                      filter: idx === 0 ? 'drop-shadow(0 0 8px rgba(0, 230, 118, 0.8))' : 'drop-shadow(0 0 3px rgba(0, 230, 118, 0.4))',
                      transition: 'width 1s ease-out'
                    }} />
                  </div>
                  <div style={{ width: '80px', textAlign: 'right', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>{item.value.toLocaleString()}</strong> <small>kg</small>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
        <Button onClick={() => navigate('/calculator')} variant="secondary">Recalculate</Button>
        <Button onClick={() => navigate('/recommendations')}>View Recommendations</Button>
      </div>
    </div>
  );
};
