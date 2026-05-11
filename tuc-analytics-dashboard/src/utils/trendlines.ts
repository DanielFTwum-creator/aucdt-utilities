import { regression, regressionLinear, regressionPolynomial } from 'regression';
import { mean, standardDeviation } from 'simple-statistics';

export interface TrendlineData {
  x: number;
  y: number;
  predicted?: number;
}

export interface TrendlineStats {
  slope: number;
  intercept: number;
  rSquared: number;
  direction: 'increasing' | 'decreasing' | 'stable';
  strength: 'weak' | 'moderate' | 'strong';
  equation: string;
}

export interface TrendlineOptions {
  type: 'linear' | 'polynomial' | 'movingAverage';
  degree?: number; // for polynomial
  period?: number; // for moving average
}

/**
 * Calculate linear regression trendline
 */
export function calculateLinearTrend(data: TrendlineData[]): {
  points: TrendlineData[];
  stats: TrendlineStats;
} {
  const coords: [number, number][] = data.map(d => [d.x, d.y]);
  
  try {
    const result = regressionLinear(coords);
    const { equation, r2, points } = result;
    
    const trendPoints: TrendlineData[] = points.map(([x, y]) => ({
      x,
      y: data.find(d => d.x === x)?.y || 0,
      predicted: y
    }));
    
    const slope = equation[0];
    const intercept = equation[1];
    
    const direction = slope > 0.1 ? 'increasing' : slope < -0.1 ? 'decreasing' : 'stable';
    const strength = r2 > 0.7 ? 'strong' : r2 > 0.4 ? 'moderate' : 'weak';
    
    const stats: TrendlineStats = {
      slope,
      intercept,
      rSquared: r2,
      direction,
      strength,
      equation: `y = ${slope.toFixed(3)}x + ${intercept.toFixed(3)}`
    };
    
    return { points: trendPoints, stats };
  } catch (error) {
    console.error('Error calculating linear trend:', error);
    return {
      points: data,
      stats: {
        slope: 0,
        intercept: 0,
        rSquared: 0,
        direction: 'stable',
        strength: 'weak',
        equation: 'Error calculating trend'
      }
    };
  }
}

/**
 * Calculate polynomial regression trendline
 */
export function calculatePolynomialTrend(
  data: TrendlineData[], 
  degree: number = 2
): {
  points: TrendlineData[];
  stats: TrendlineStats;
} {
  const coords: [number, number][] = data.map(d => [d.x, d.y]);
  
  try {
    const result = regressionPolynomial(coords, { order: degree });
    const { equation, r2, points } = result;
    
    const trendPoints: TrendlineData[] = points.map(([x, y]) => ({
      x,
      y: data.find(d => d.x === x)?.y || 0,
      predicted: y
    }));
    
    // For polynomial, we'll use the first derivative at the midpoint to determine direction
    const midX = (data[0].x + data[data.length - 1].x) / 2;
    const firstDerivative = equation.reduce((sum, coef, index) => 
      index > 0 ? sum + index * coef * Math.pow(midX, index - 1) : sum, 0
    );
    
    const direction = firstDerivative > 0.1 ? 'increasing' : firstDerivative < -0.1 ? 'decreasing' : 'stable';
    const strength = r2 > 0.7 ? 'strong' : r2 > 0.4 ? 'moderate' : 'weak';
    
    const equationStr = equation
      .map((coef, index) => {
        if (index === 0) return coef.toFixed(3);
        if (index === 1) return `${coef >= 0 ? '+' : ''}${coef.toFixed(3)}x`;
        return `${coef >= 0 ? '+' : ''}${coef.toFixed(3)}x^${index}`;
      })
      .reverse()
      .join('');
    
    const stats: TrendlineStats = {
      slope: firstDerivative,
      intercept: equation[0],
      rSquared: r2,
      direction,
      strength,
      equation: `y = ${equationStr}`
    };
    
    return { points: trendPoints, stats };
  } catch (error) {
    console.error('Error calculating polynomial trend:', error);
    return calculateLinearTrend(data); // Fallback to linear
  }
}

/**
 * Calculate moving average trendline
 */
export function calculateMovingAverage(
  data: TrendlineData[], 
  period: number = 3
): {
  points: TrendlineData[];
  stats: TrendlineStats;
} {
  const trendPoints: TrendlineData[] = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      trendPoints.push({
        x: data[i].x,
        y: data[i].y,
        predicted: data[i].y
      });
    } else {
      const windowData = data.slice(i - period + 1, i + 1);
      const avgY = mean(windowData.map(d => d.y));
      
      trendPoints.push({
        x: data[i].x,
        y: data[i].y,
        predicted: avgY
      });
    }
  }
  
  // Calculate trend direction from moving average
  const validPredictions = trendPoints.filter(p => p.predicted !== undefined);
  const firstMA = validPredictions[0]?.predicted || 0;
  const lastMA = validPredictions[validPredictions.length - 1]?.predicted || 0;
  const slope = (lastMA - firstMA) / (validPredictions.length - 1);
  
  const direction = slope > 0.1 ? 'increasing' : slope < -0.1 ? 'decreasing' : 'stable';
  
  // Calculate R-squared for moving average
  const actualValues = validPredictions.map(p => p.y);
  const predictedValues = validPredictions.map(p => p.predicted || 0);
  const meanActual = mean(actualValues);
  
  const ssTotal = actualValues.reduce((sum, val) => sum + Math.pow(val - meanActual, 2), 0);
  const ssRes = actualValues.reduce((sum, val, idx) => 
    sum + Math.pow(val - predictedValues[idx], 2), 0
  );
  
  const r2 = Math.max(0, 1 - (ssRes / ssTotal));
  const strength = r2 > 0.7 ? 'strong' : r2 > 0.4 ? 'moderate' : 'weak';
  
  const stats: TrendlineStats = {
    slope,
    intercept: firstMA,
    rSquared: r2,
    direction,
    strength,
    equation: `${period}-period Moving Average`
  };
  
  return { points: trendPoints, stats };
}

/**
 * Calculate trendline based on options
 */
export function calculateTrendline(
  data: TrendlineData[], 
  options: TrendlineOptions
): {
  points: TrendlineData[];
  stats: TrendlineStats;
} {
  switch (options.type) {
    case 'linear':
      return calculateLinearTrend(data);
    case 'polynomial':
      return calculatePolynomialTrend(data, options.degree || 2);
    case 'movingAverage':
      return calculateMovingAverage(data, options.period || 3);
    default:
      return calculateLinearTrend(data);
  }
}

/**
 * Generate forecast points for future predictions
 */
export function generateForecast(
  data: TrendlineData[],
  trendStats: TrendlineStats,
  futureMonths: number = 6
): TrendlineData[] {
  const lastX = data[data.length - 1].x;
  const forecastPoints: TrendlineData[] = [];
  
  for (let i = 1; i <= futureMonths; i++) {
    const x = lastX + i;
    const y = trendStats.slope * x + trendStats.intercept;
    
    forecastPoints.push({
      x,
      y: Math.max(0, y), // Ensure non-negative predictions
      predicted: Math.max(0, y)
    });
  }
  
  return forecastPoints;
}

/**
 * Get trend color based on direction and strength
 */
export function getTrendColor(direction: string, strength: string): string {
  const colors = {
    increasing: {
      weak: '#10B981',    // green-500
      moderate: '#059669', // green-600  
      strong: '#047857'    // green-700
    },
    decreasing: {
      weak: '#EF4444',     // red-500
      moderate: '#DC2626', // red-600
      strong: '#B91C1C'    // red-700
    },
    stable: {
      weak: '#6B7280',     // gray-500
      moderate: '#4B5563', // gray-600
      strong: '#374151'    // gray-700
    }
  };
  
  return colors[direction as keyof typeof colors]?.[strength as keyof typeof colors.increasing] || '#6B7280';
}
