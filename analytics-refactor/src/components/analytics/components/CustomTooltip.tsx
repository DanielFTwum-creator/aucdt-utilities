import React from 'react';

/**
 * Custom Tooltip Component for Recharts
 * 
 * Provides styled tooltips with proper formatting for all chart types
 * 
 * @component
 * @param {Object} props - Tooltip props from Recharts
 * @param {boolean} props.active - Whether tooltip is active
 * @param {Array} props.payload - Data payload
 * @param {string} props.label - Tooltip label
 */
export const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div 
        className="bg-white p-4 shadow-xl rounded-lg border-2 border-indigo-200"
        role="tooltip"
      >
        <p className="font-bold text-gray-800 mb-2">{label}</p>
        {payload.map((item, idx) => (
          <p key={idx} className="text-sm" style={{ color: item.color }}>
            <span className="font-semibold">{item.name}:</span>{' '}
            {typeof item.value === 'number' 
              ? item.value.toFixed(1) 
              : item.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/**
 * Chart Insight Box Component
 * 
 * Displays contextual insights below charts
 * 
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Insight content
 * @param {string} props.variant - Style variant (info, warning, success)
 */
export const ChartInsight = ({ children, variant = 'info' }) => {
  const variantClasses = {
    info: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    warning: 'bg-amber-50 text-amber-900 border-amber-300 border-l-4',
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200'
  };

  return (
    <div 
      className={`mt-4 p-4 rounded-lg ${variantClasses[variant]}`}
      role="note"
      aria-label="Chart insight"
    >
      <p className="text-sm">{children}</p>
    </div>
  );
};

export default CustomTooltip;
