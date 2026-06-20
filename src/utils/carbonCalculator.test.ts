import { describe, it, expect } from 'vitest';
import { calculateEmissions, getCarbonScore, generateRecommendations } from './carbonCalculator';

describe('Carbon Calculator Logic', () => {
  it('calculates baseline footprint correctly', () => {
    const data = {
      carKmPerWeek: 100, // 100 * 52 * 0.192 = 998.4
      bikeKmPerWeek: 50, // 0
      transitKmPerWeek: 0, // 0
      flightsPerYear: 1, // 250
      monthlyElectricityKWh: 200, // 200 * 12 * 0.4 = 960
      diet: 'vegetarian' as const, // 1700
      wasteLevel: 'medium' as const, // 500
      recyclingHabit: 'sometimes' as const, // 500 * 0.85 = 425
    };
    
    // Transport: 998.4 + 250 = 1248.4 -> 1248
    // Energy: 960
    // Food: 1700
    // Waste: 425
    // Total: 1248 + 960 + 1700 + 425 = 4333
    const result = calculateEmissions(data);
    expect(result.transport).toBe(1248);
    expect(result.energy).toBe(960);
    expect(result.food).toBe(1700);
    expect(result.waste).toBe(425);
    expect(result.total).toBe(4333);
  });

  it('calculates score correctly', () => {
    expect(getCarbonScore(2000)).toBe('Low Impact');
    expect(getCarbonScore(5000)).toBe('Medium Impact');
    expect(getCarbonScore(8000)).toBe('High Impact');
  });

  it('generates high impact transport recommendation', () => {
    const data = {
      carKmPerWeek: 200,
      bikeKmPerWeek: 0,
      transitKmPerWeek: 0,
      flightsPerYear: 0,
      monthlyElectricityKWh: 100,
      diet: 'vegan' as const,
      wasteLevel: 'low' as const,
      recyclingHabit: 'always' as const,
    };
    const emissions = calculateEmissions(data);
    const recs = generateRecommendations(data, emissions);
    expect(recs.some(r => r.problem.includes('transport'))).toBe(true);
  });
});
