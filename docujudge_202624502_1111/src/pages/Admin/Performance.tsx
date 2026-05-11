import { BarChart2, Cpu, Zap } from 'lucide-react';

export default function Performance() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <BarChart2 className="text-blue-600" size={32} />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Performance Metrics</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="text-yellow-500" size={24} />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Response Time</h3>
          </div>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">124ms</p>
          <p className="text-sm text-green-500 mt-2">↓ 12% from last hour</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Cpu className="text-blue-500" size={24} />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">CPU Usage</h3>
          </div>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">45%</p>
          <p className="text-sm text-gray-500 mt-2">Stable load</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="text-green-500" size={24} />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Throughput</h3>
          </div>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">850</p>
          <p className="text-sm text-gray-500 mt-2">Req/min</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Core Web Vitals</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">LCP (Largest Contentful Paint)</span>
              <span className="font-bold text-green-500">1.2s</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '20%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">FID (First Input Delay)</span>
              <span className="font-bold text-green-500">12ms</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '5%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">CLS (Cumulative Layout Shift)</span>
              <span className="font-bold text-green-500">0.01</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '1%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Activity({ className, size }: { className?: string; size?: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
