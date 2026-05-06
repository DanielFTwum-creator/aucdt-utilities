import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  LineController,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { calculateTrendline, getTrendColor, TrendlineOptions } from '@/utils/trendlines';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  LineController
);

interface TimeSeriesData {
  month: string;
  signups: number;
  applicants: number;
  accepted: number;
  registered: number;
}

interface TimeSeriesChartProps {
  data: TimeSeriesData[];
  showTrendlines: boolean;
  trendlineOptions: TrendlineOptions;
  activeTrendlines: {
    signups: boolean;
    applicants: boolean;
    accepted: boolean;
    registered: boolean;
  };
}

export function TimeSeriesChart({
  data,
  showTrendlines,
  trendlineOptions,
  activeTrendlines
}: TimeSeriesChartProps) {
  const chartData = useMemo(() => {
    const labels = data.map(d => d.month);
    
    // Base datasets for the actual data
    const datasets: any[] = [
      {
        label: 'Signups',
        data: data.map(d => d.signups),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Applicants',
        data: data.map(d => d.applicants),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.1,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Accepted',
        data: data.map(d => d.accepted),
        borderColor: '#14B8A6',
        backgroundColor: 'rgba(20, 184, 166, 0.1)',
        tension: 0.1,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Registered',
        data: data.map(d => d.registered),
        borderColor: '#059669',
        backgroundColor: 'rgba(5, 150, 105, 0.1)',
        tension: 0.1,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ];

    // Add trendline datasets if enabled
    if (showTrendlines) {
      const series = [
        { key: 'signups', color: '#3B82F6', active: activeTrendlines.signups },
        { key: 'applicants', color: '#10B981', active: activeTrendlines.applicants },
        { key: 'accepted', color: '#14B8A6', active: activeTrendlines.accepted },
        { key: 'registered', color: '#059669', active: activeTrendlines.registered }
      ];

      series.forEach(({ key, color, active }, index) => {
        if (!active) return;

        const seriesData = data.map((d, i) => ({
          x: i,
          y: d[key as keyof TimeSeriesData] as number
        }));

        try {
          const { points, stats } = calculateTrendline(seriesData, trendlineOptions);
          const trendColor = getTrendColor(stats.direction, stats.strength);

          datasets.push({
            label: `${datasets[index].label} Trend`,
            data: points.map(p => p.predicted),
            borderColor: trendColor,
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: 0,
            pointHoverRadius: 0,
            tension: 0,
            metadata: {
              isTrendline: true,
              stats,
              originalSeries: datasets[index].label
            }
          });
        } catch (error) {
          console.error(`Error calculating trendline for ${key}:`, error);
        }
      });
    }

    return {
      labels,
      datasets
    };
  }, [data, showTrendlines, trendlineOptions, activeTrendlines]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          filter: function(legendItem: any, chartData: any) {
            // Show legend items for main data series and active trendlines
            return true;
          }
        }
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
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
        display: true,
        title: {
          display: true,
          text: 'Number of Students'
        },
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    },
    elements: {
      line: {
        tension: 0.1
      }
    }
  };

  return (
    <div className="h-96 w-full">
      <Line data={chartData} options={options} />
    </div>
  );
}
