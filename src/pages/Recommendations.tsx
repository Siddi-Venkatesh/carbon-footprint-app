import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { FootprintData, calculateEmissions, generateRecommendations } from '../utils/carbonCalculator';

type RecommendationsProps = {
  data: FootprintData | null;
};

export const Recommendations: React.FC<RecommendationsProps> = ({ data }) => {
  const navigate = useNavigate();

  if (!data || data.diet === '') {
    return (
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h2>No data found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Please calculate your footprint to get personalized recommendations.</p>
        <Button onClick={() => navigate('/calculator')}>Go to Calculator</Button>
      </div>
    );
  }

  const recommendations = useMemo(() => {
    const emissions = calculateEmissions(data);
    return generateRecommendations(data, emissions);
  }, [data]);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Personalized Recommendations</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {recommendations.map((rec, index) => (
          <Card key={index} style={{ borderLeft: `4px solid ${rec.difficulty === 'Easy' ? 'var(--success)' : rec.difficulty === 'Medium' ? 'var(--warning)' : 'var(--danger)'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <h3 style={{ color: 'var(--accent-primary)' }}>{rec.problem}</h3>
              <span style={{ 
                fontSize: '0.8rem', 
                padding: '0.2rem 0.5rem', 
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-primary)'
              }}>
                Difficulty: {rec.difficulty}
              </span>
            </div>
            <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>💡 {rec.suggestion}</p>
            <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', display: 'inline-block' }}>
              <small style={{ color: 'var(--text-secondary)' }}>Potential Savings: </small>
              <strong style={{ color: 'var(--success)' }}>{rec.savings}</strong>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Ready to take action?</p>
        <Button onClick={() => navigate('/challenges')}>View Challenges</Button>
      </div>
    </div>
  );
};
