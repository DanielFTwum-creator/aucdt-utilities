import React, { useEffect, useRef } from 'react';
import { Chart, DoughnutController, ArcElement, Legend, Tooltip, ChartOptions, ChartConfiguration } from 'chart.js';
import { useAppContext } from '../context/AppContext';

Chart.register(DoughnutController, ArcElement, Legend, Tooltip);

const chartData = {
    labels: ['Gemini Free Apps', 'Gemini 2.5 Pro Apps'],
    data: [76, 127],
};

const DonutChart: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<Chart | null>(null);
    const { theme } = useAppContext();

    const themeColors = {
        light: { primary: '#8B1538', accent: '#D4AF37', text: '#2C1810' },
        dark: { primary: '#b13e61', accent: '#e0c56c', text: '#f0f0f0' },
        'high-contrast': { primary: '#FFFF00', accent: '#00FFFF', text: '#FFFFFF' },
    };

    useEffect(() => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        const currentThemeColors = themeColors[theme];

        const options: ChartOptions<'doughnut'> = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: currentThemeColors.text,
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw} apps`;
                        }
                    }
                }
            }
        };

        const config: ChartConfiguration<'doughnut'> = {
            type: 'doughnut',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'AI Apps Generated',
                    data: chartData.data,
                    backgroundColor: [currentThemeColors.primary, currentThemeColors.accent],
                    borderColor: [currentThemeColors.primary, currentThemeColors.accent],
                    borderWidth: 1
                }]
            },
            options: options
        };

        if (chartRef.current) {
            chartRef.current.destroy();
        }

        chartRef.current = new Chart(ctx, config);

        return () => {
            chartRef.current?.destroy();
        };
    }, [theme]);

    return (
        <div className="relative w-full max-w-lg mx-auto h-80 md:h-96">
            <div className="sr-only">
                <table>
                    <caption>Daniel's AI App Generation (Last 3 Months)</caption>
                    <thead>
                        <tr>
                            <th>App Type</th>
                            <th>Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{chartData.labels[0]}</td>
                            <td>{chartData.data[0]}</td>
                        </tr>
                        <tr>
                            <td>{chartData.labels[1]}</td>
                            <td>{chartData.data[1]}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <canvas ref={canvasRef} role="img" aria-label="A donut chart showing 76 Gemini Free Apps and 127 Gemini 2.5 Pro Apps."></canvas>
        </div>
    );
};

export default DonutChart;