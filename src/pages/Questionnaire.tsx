import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Button } from '../components/Button';
import { FootprintData } from '../utils/carbonCalculator';

type QuestionnaireProps = {
  onComplete: (data: FootprintData) => void;
};

export const Questionnaire: React.FC<QuestionnaireProps> = ({ onComplete }) => {
  const [data, setData] = useState<FootprintData>({
    transportMode: 'car',
    dailyMiles: 15,
    dietType: 'omnivore',
    energySource: 'mixed',
    homeSizeSqFt: 1500,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(data);
  };

  return (
    <Card className="animate-fade-in">
      <h2>Calculate Your Baseline Footprint</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Tell us a bit about your lifestyle to get personalized insights.
      </p>
      
      <form onSubmit={handleSubmit}>
        <Select
          label="Primary Transport Mode"
          value={data.transportMode}
          onChange={(e) => setData({ ...data, transportMode: e.target.value as any })}
          options={[
            { value: 'car', label: 'Gasoline Car' },
            { value: 'ev', label: 'Electric Vehicle' },
            { value: 'bus', label: 'Bus' },
            { value: 'train', label: 'Train' },
            { value: 'bike', label: 'Bicycle' },
            { value: 'walk', label: 'Walking' },
          ]}
        />
        
        <Input
          label="Daily Miles Traveled"
          type="number"
          min="0"
          value={data.dailyMiles}
          onChange={(e) => setData({ ...data, dailyMiles: Number(e.target.value) })}
          required
        />
        
        <Select
          label="Dietary Preference"
          value={data.dietType}
          onChange={(e) => setData({ ...data, dietType: e.target.value as any })}
          options={[
            { value: 'vegan', label: 'Vegan' },
            { value: 'vegetarian', label: 'Vegetarian' },
            { value: 'omnivore', label: 'Average Omnivore' },
            { value: 'heavy-meat', label: 'Meat-heavy' },
          ]}
        />
        
        <Select
          label="Home Energy Source"
          value={data.energySource}
          onChange={(e) => setData({ ...data, energySource: e.target.value as any })}
          options={[
            { value: 'mixed', label: 'Standard Grid (Mixed)' },
            { value: 'renewable', label: '100% Renewable' },
            { value: 'coal', label: 'Coal Heavy' },
          ]}
        />
        
        <Input
          label="Home Size (sq ft)"
          type="number"
          min="100"
          value={data.homeSizeSqFt}
          onChange={(e) => setData({ ...data, homeSizeSqFt: Number(e.target.value) })}
          required
        />
        
        <Button type="submit" style={{ width: '100%', marginTop: '1rem' }}>
          Calculate My Footprint
        </Button>
      </form>
    </Card>
  );
};
