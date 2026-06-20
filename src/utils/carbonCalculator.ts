// utils/carbonCalculator.ts

export type FootprintData = {
  id?: string;
  date?: string;

  // Transport
  carKmPerWeek: number;
  bikeKmPerWeek: number;
  transitKmPerWeek: number;
  flightsPerYear: number;
  
  // Energy
  monthlyElectricityKWh: number;
  
  // Food
  diet: 'vegan' | 'vegetarian' | 'non-vegetarian' | '';
  
  // Waste
  wasteLevel: 'low' | 'medium' | 'high' | '';
  recyclingHabit: 'never' | 'sometimes' | 'always' | '';
};

export type CategoryEmissions = {
  transport: number;
  energy: number;
  food: number;
  waste: number;
  total: number;
};

// Factors are estimated annual kg CO2e
export const calculateEmissions = (data: FootprintData): CategoryEmissions => {
  // Transport
  // Avg car = 0.192 kg CO2e per km
  // Avg transit (bus/train mixed) = 0.04 kg CO2e per km
  // Flight = approx 250 kg per short/medium haul flight
  const carAnnual = (data.carKmPerWeek * 52) * 0.192;
  const transitAnnual = (data.transitKmPerWeek * 52) * 0.04;
  const flightAnnual = data.flightsPerYear * 250;
  const transport = carAnnual + transitAnnual + flightAnnual;

  // Energy
  // Avg global grid = 0.4 kg CO2e per kWh
  const energy = (data.monthlyElectricityKWh * 12) * 0.4;

  // Food (Annual)
  let food = 0;
  if (data.diet === 'vegan') food = 1500;
  else if (data.diet === 'vegetarian') food = 1700;
  else if (data.diet === 'non-vegetarian') food = 2500;

  // Waste (Annual)
  // Base generation: Low(300), Medium(500), High(800)
  let baseWaste = 500;
  if (data.wasteLevel === 'low') baseWaste = 300;
  else if (data.wasteLevel === 'high') baseWaste = 800;
  
  // Recycling multiplier: Always(0.6), Sometimes(0.85), Never(1.0)
  let wasteMultiplier = 1.0;
  if (data.recyclingHabit === 'always') wasteMultiplier = 0.6;
  else if (data.recyclingHabit === 'sometimes') wasteMultiplier = 0.85;
  
  const waste = baseWaste * wasteMultiplier;

  return {
    transport: Math.round(transport),
    energy: Math.round(energy),
    food: Math.round(food),
    waste: Math.round(waste),
    total: Math.round(transport + energy + food + waste),
  };
};

export const getCarbonScore = (total: number) => {
  // Score interpretation based on global averages
  // 0 - 3000 -> Low Impact
  // 3001 - 7000 -> Medium Impact
  // 7001+ -> High Impact
  if (total <= 3000) return 'Low Impact';
  if (total <= 7000) return 'Medium Impact';
  return 'High Impact';
};

export type Recommendation = {
  problem: string;
  suggestion: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  savings: string;
};

export const generateRecommendations = (data: FootprintData, emissions: CategoryEmissions): Recommendation[] => {
  const recommendations: Recommendation[] = [];

  if (emissions.transport > 2000 || data.carKmPerWeek > 100) {
    recommendations.push({
      problem: 'High transport emissions from driving',
      suggestion: 'Use public transport, carpool, or switch to an EV.',
      difficulty: 'Medium',
      savings: '~1,000 kg CO2e/year',
    });
  }

  if (data.flightsPerYear > 2) {
    recommendations.push({
      problem: 'Frequent flights contribute heavily to emissions',
      suggestion: 'Reduce air travel by combining trips or using trains for regional travel.',
      difficulty: 'Hard',
      savings: '~500 kg CO2e/flight',
    });
  }

  if (data.monthlyElectricityKWh > 300) {
    recommendations.push({
      problem: 'High electricity usage',
      suggestion: 'Use LED bulbs, unplug idle devices, and consider solar power.',
      difficulty: 'Easy',
      savings: '~400 kg CO2e/year',
    });
  }

  if (data.diet === 'non-vegetarian') {
    recommendations.push({
      problem: 'High food emissions from meat production',
      suggestion: 'Reduce meat consumption by having plant-based meals 2-3 times a week.',
      difficulty: 'Medium',
      savings: '~500 kg CO2e/year',
    });
  }

  if (data.wasteLevel === 'high' || data.recyclingHabit === 'never') {
    recommendations.push({
      problem: 'High waste generation without recycling',
      suggestion: 'Start a basic recycling bin for paper/plastics and avoid single-use items.',
      difficulty: 'Easy',
      savings: '~200 kg CO2e/year',
    });
  }

  // Fallback tip
  if (recommendations.length === 0) {
    recommendations.push({
      problem: 'Optimizing an already low footprint',
      suggestion: 'Support local environmental policies or offset remaining emissions.',
      difficulty: 'Medium',
      savings: 'Variable',
    });
  }

  return recommendations;
};
