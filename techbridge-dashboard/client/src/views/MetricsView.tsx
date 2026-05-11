export default function MetricsView() {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">System Metrics</h2>
      <div className="space-y-3">
        {[['CPU Usage', '42%'], ['Memory', '68%'], ['Disk I/O', '23%'], ['Network', '11%']].map(([k, v]) => (
          <div key={k} className="flex items-center gap-3">
            <span className="w-28 text-sm text-gray-500">{k}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-3">
              <div className="bg-sky-500 h-3 rounded-full" style={{ width: v }} />
            </div>
            <span className="text-sm font-medium text-gray-700 w-10 text-right">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
