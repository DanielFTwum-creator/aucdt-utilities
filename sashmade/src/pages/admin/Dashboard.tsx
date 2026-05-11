import React, { useEffect, useRef, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';

const data = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 2000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

export function Dashboard() {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const node = chartRef.current;
    if (!node) return;

    const updateSize = () => {
      const nextWidth = node.clientWidth;
      const nextHeight = node.clientHeight;
      setChartSize((prev) =>
        prev.width === nextWidth && prev.height === nextHeight
          ? prev
          : { width: nextWidth, height: nextHeight }
      );
    };

    updateSize();

    const observer = new ResizeObserver(() => updateSize());
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-serif font-bold text-stone-900 dark:text-white">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Revenue', value: 'GHS 24,500', icon: DollarSign, change: '+12%' },
          { title: 'Active Orders', value: '45', icon: ShoppingBag, change: '+5%' },
          { title: 'New Customers', value: '128', icon: Users, change: '+18%' },
          { title: 'AI Generations', value: '1,204', icon: TrendingUp, change: '+24%' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white dark:bg-stone-800 p-6 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <kpi.icon className="w-6 h-6 text-[#4A5340] dark:text-[#D97706]" />
              </div>
              <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">{kpi.change}</span>
            </div>
            <h3 className="text-stone-500 dark:text-stone-400 text-sm font-medium">{kpi.title}</h3>
            <p className="text-2xl font-bold text-stone-900 dark:text-white mt-1">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-stone-800 p-8 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700 min-w-0">
        <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-6">Weekly Sales Overview</h2>
        <div ref={chartRef} className="h-[300px] min-w-0">
          {chartSize.width > 0 && chartSize.height > 0 ? (
            <BarChart width={chartSize.width} height={chartSize.height} data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="sales" fill="#4A5340" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : null}
        </div>
      </div>
    </div>
  );
}
