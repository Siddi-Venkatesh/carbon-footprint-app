import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Button } from '../components/Button';
import { FootprintData } from '../utils/carbonCalculator';

type CalculatorProps = {
  onComplete: (data: FootprintData) => void;
};

export const Calculator: React.FC<CalculatorProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.editData as FootprintData | undefined;
  
  const [data, setData] = useState<FootprintData>(editData || {
    carKmPerWeek: 0,
    bikeKmPerWeek: 0,
    transitKmPerWeek: 0,
    flightsPerYear: 0,
    monthlyElectricityKWh: 0,
    diet: '',
    wasteLevel: '',
    recyclingHabit: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(data);
    navigate('/dashboard');
  };

  const handleNumChange = (field: keyof FootprintData, value: string) => {
    setData({ ...data, [field]: value === '' ? 0 : Number(value) });
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Card>
        <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>Carbon Footprint Calculator</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', textAlign: 'center' }}>
          Please fill out the details below accurately. Fields marked with <span style={{ color: 'var(--danger)' }}>*</span> are required.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Transportation */}
          <fieldset style={{ border: '1px solid var(--bg-tertiary)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
            <legend style={{ padding: '0 0.5rem', color: 'var(--accent-primary)', fontWeight: 'bold' }}>Transportation</legend>
            <Input
              label="Car kilometers per week"
              type="number"
              min="0"
              required
              value={data.carKmPerWeek || ''}
              onChange={(e) => handleNumChange('carKmPerWeek', e.target.value)}
              placeholder="e.g. 150"
            />
            <Input
              label="Bike kilometers per week"
              type="number"
              min="0"
              required
              value={data.bikeKmPerWeek || ''}
              onChange={(e) => handleNumChange('bikeKmPerWeek', e.target.value)}
              placeholder="e.g. 20"
            />
            <Input
              label="Bus/Train kilometers per week"
              type="number"
              min="0"
              required
              value={data.transitKmPerWeek || ''}
              onChange={(e) => handleNumChange('transitKmPerWeek', e.target.value)}
              placeholder="e.g. 50"
            />
            <Input
              label="Flights per year"
              type="number"
              min="0"
              required
              value={data.flightsPerYear || ''}
              onChange={(e) => handleNumChange('flightsPerYear', e.target.value)}
              placeholder="e.g. 2"
            />
          </fieldset>

          {/* Energy */}
          <fieldset style={{ border: '1px solid var(--bg-tertiary)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
            <legend style={{ padding: '0 0.5rem', color: 'var(--accent-primary)', fontWeight: 'bold' }}>Energy</legend>
            <Input
              label="Monthly electricity consumption (kWh)"
              type="number"
              min="0"
              required
              value={data.monthlyElectricityKWh || ''}
              onChange={(e) => handleNumChange('monthlyElectricityKWh', e.target.value)}
              placeholder="e.g. 300"
            />
          </fieldset>

          {/* Food */}
          <fieldset style={{ border: '1px solid var(--bg-tertiary)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
            <legend style={{ padding: '0 0.5rem', color: 'var(--accent-primary)', fontWeight: 'bold' }}>Food</legend>
            <Select
              label="Dietary Preference"
              required
              value={data.diet}
              onChange={(e) => setData({ ...data, diet: e.target.value as any })}
              options={[
                { value: 'vegan', label: 'Vegan' },
                { value: 'vegetarian', label: 'Vegetarian' },
                { value: 'non-vegetarian', label: 'Non-Vegetarian' },
              ]}
            />
          </fieldset>

          {/* Waste */}
          <fieldset style={{ border: '1px solid var(--bg-tertiary)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
            <legend style={{ padding: '0 0.5rem', color: 'var(--accent-primary)', fontWeight: 'bold' }}>Waste</legend>
            <Select
              label="Waste generation level"
              required
              value={data.wasteLevel}
              onChange={(e) => setData({ ...data, wasteLevel: e.target.value as any })}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
              ]}
            />
            <Select
              label="Recycling habit"
              required
              value={data.recyclingHabit}
              onChange={(e) => setData({ ...data, recyclingHabit: e.target.value as any })}
              options={[
                { value: 'never', label: 'Never' },
                { value: 'sometimes', label: 'Sometimes' },
                { value: 'always', label: 'Always' },
              ]}
            />
          </fieldset>

          <Button type="submit" style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}>
            Calculate Footprint
          </Button>
        </form>
      </Card>
    </div>
  );
};
