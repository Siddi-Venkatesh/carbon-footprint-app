import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { FootprintData, calculateEmissions, getCarbonScore } from '../utils/carbonCalculator';

type DashboardProps = {
  data: FootprintData | null;
};

const COLORS = ['#00e59b', '#ffa502', '#ff4757', '#3498db'];

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const navigate = useNavigate();

  if (!data || data.diet === '') {
    return (
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h2>No data found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Please calculate your footprint first.</p>
        <Button onClick={() => navigate('/calculator')}>Go to Calculator</Button>
      </div>
    );
  }

  const emissions = useMemo(() => calculateEmissions(data), [data]);
  const scoreLabel = useMemo(() => getCarbonScore(emissions.total), [emissions]);

  const chartData = [
    { name: 'Transport', value: emissions.transport },
    { name: 'Energy', value: emissions.energy },
    { name: 'Food', value: emissions.food },
    { name: 'Waste', value: emissions.waste },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <Card style={{ textAlign: 'center', border: '1px solid var(--accent-primary)' }}>
          <h4 style={{ color: 'var(--text-secondary)' }}>Total CO₂ Emissions</h4>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{emissions.total.toLocaleString()}</p>
          <small>kg CO₂e/yr</small>
        </Card>
        <Card style={{ textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-secondary)' }}>Carbon Score</h4>
          <p style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: scoreLabel === 'Low Impact' ? 'var(--success)' : scoreLabel === 'Medium Impact' ? 'var(--warning)' : 'var(--danger)',
            marginTop: '0.5rem'
          }}>
            {scoreLabel}
          </p>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <Card>
          <p>🚗 Transport: <strong>{emissions.transport.toLocaleString()}</strong> kg</p>
        </Card>
        <Card>
          <p>⚡ Energy: <strong>{emissions.energy.toLocaleString()}</strong> kg</p>
        </Card>
        <Card>
          <p>🍔 Food: <strong>{emissions.food.toLocaleString()}</strong> kg</p>
        </Card>
        <Card>
          <p>🗑️ Waste: <strong>{emissions.waste.toLocaleString()}</strong> kg</p>
        </Card>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', marginTop: '1rem' }}>
        <Card>
          <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Emissions Breakdown (Pie)</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-tertiary)', border: 'none' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Category Comparison (Bar)</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip cursor={{fill: 'var(--bg-tertiary)'}} contentStyle={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--bg-tertiary)' }} />
                <Bar dataKey="value" fill="var(--accent-primary)">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
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
