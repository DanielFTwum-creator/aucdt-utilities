
import React, { useEffect, useRef } from 'react';

// Chart.js is loaded from the CDN and available on the window object.
declare const Chart: any;

interface ChartJsProps {
  config: any; // Chart.js config can be complex, 'any' is pragmatic here
}

/**
 * Validates a Chart.js configuration object to ensure it has the minimum required properties.
 * This prevents rendering errors from malformed data from the AI.
 * @param config The Chart.js configuration object.
 * @returns {boolean} True if the config is valid, false otherwise.
 */
export const validateChartConfig = (config: any): boolean => {
  if (!config || typeof config !== 'object') return false;
  if (!config.type || !['bar', 'line', 'pie', 'scatter', 'doughnut'].includes(config.type)) return false;
  if (!config.data || typeof config.data !== 'object' || config.data === null) return false;
  // data.labels is optional for some chart types like scatter, so that specific check is removed.
  if (!config.data.datasets || !Array.isArray(config.data.datasets)) return false;
  // Ensure every dataset has a data array
  if (config.data.datasets.some((ds: any) => !ds || !Array.isArray(ds.data))) return false;
  
  return true;
};


const ChartJs = ({ config }: ChartJsProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null); // To hold the chart instance

  const isConfigValid = validateChartConfig(config);

  useEffect(() => {
    // Always destroy the previous chart instance if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    
    // If the config is invalid or dependencies are missing, do not proceed.
    if (!isConfigValid || !canvasRef.current || typeof Chart === 'undefined') {
      return;
    }

    try {
      // Create a new chart instance
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        chartRef.current = new Chart(ctx, config);
      }
    } catch (error) {
        console.error("Error rendering Chart.js diagram:", error, config);
        // This catch is a fallback in case validation passes but Chart.js still fails.
    }
    
    // Cleanup function to destroy the chart when the component unmounts
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [config, isConfigValid]); // Rerender chart if config or its validity changes

  if (!isConfigValid) {
    return (
       <div className="chart-container relative w-full h-full my-4 flex justify-center items-center bg-black/20 p-4 rounded-lg border border-red-500/50">
        <p className="text-red-300 text-center text-sm">
          A visual for this question could not be displayed due to invalid data.
        </p>
      </div>
    )
  }

  return (
    <div className="chart-container relative w-full h-full my-4 flex justify-center items-center">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default ChartJs;
