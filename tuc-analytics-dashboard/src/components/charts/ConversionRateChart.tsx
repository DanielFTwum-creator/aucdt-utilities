import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  LineController,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { calculateTrendline, getTrendColor, TrendlineOptions } from '@/utils/trendlines';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  LineController
);

interface TimeSeriesData {
  month: string;
  signups: number;
  applicants: number;
  accepted: number;
  registered: number;
}

interface ConversionRateChartProps {
  data: TimeSeriesData[];
  showTrendlines: boolean;
  trendlineOptions: TrendlineOptions;
}

export function ConversionRateChart({
  data,
  showTrendlines,
  trendlineOptions
}: ConversionRateChartProps) {
  const chartData = useMemo(() => {
    const labels = data.map(d => d.month);
    
    // Calculate conversion rates for each month
    const conversionRates = data.map(d => {
      return d.signups > 0 ? (d.applicants / d.signups) * 100 : 0;
    });

    const datasets: any[] = [
      {
        type: 'bar',
        label: 'Conversion Rate (%)',
        data: conversionRates,
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: '#3B82F6',
        borderWidth: 1,
        yAxisID: 'y',
      }
    ];

    // Add trendline if enabled
    if (showTrendlines && conversionRates.length > 0) {
      const trendData = conversionRates.map((rate, index) => ({
        x: index,
        y: rate
      }));

      try {
        const { points, stats } = calculateTrendline(trendData, trendlineOptions);
        const trendColor = getTrendColor(stats.direction, stats.strength);

        datasets.push({
          type: 'line',
          label: 'Conversion Rate Trend',
          data: points.map(p => p.predicted),
          borderColor: trendColor,
          backgroundColor: 'transparent',
          borderWidth: 3,
          borderDash: [8, 4],
          pointRadius: 0,
          pointHoverRadius: 6,
          tension: 0.1,
          yAxisID: 'y',
          metadata: {
            isTrendline: true,
            stats
          }
        });
      } catch (error) {
        console.error('Error calculating conversion rate trendline:', error);
      }
    }

    return {
      labels,
      datasets
    };
  }, [data, showTrendlines, trendlineOptions]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: function(context: any) {
            const datasetLabel = context.dataset.label || '';
            const value = context.parsed.y;
            
            if (context.dataset.metadata?.isTrendline) {
              return `${datasetLabel}: ${value.toFixed(2)}%`;
            }
            
            return `${datasetLabel}: ${value.toFixed(1)}%`;
          },
          afterBody: function(context: any) {
            const datasetIndex = context[0]?.datasetIndex;
            if (datasetIndex !== undefined) {
              const dataset = chartData.datasets[datasetIndex];
              if (dataset?.metadata?.isTrendline) {
                const stats = dataset.metadata.stats;
                return [
                  `Trend: ${stats.direction} (${stats.strength})`,
                  `R²: ${stats.rSquared.toFixed(3)}`,
                  `Equation: ${stats.equation}`
                ];
              }
            }
            return [];
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Month'
        },
        ticks: {
          maxTicksLimit: 12,
          callback: function(value: any, index: number) {
            const label = chartData.labels[index];
            if (typeof label === 'string') {
              // Show every 6th month for better readability
              return index % 6 === 0 ? label : '';
            }
            return label;
          }
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Conversion Rate (%)'
        },
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value: any) {
            return value + '%';
          }
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    }
  };

  return (
    <div className="h-80 w-full">
      <Chart type="bar" data={chartData} options={options} />
    </div>
  );
}
