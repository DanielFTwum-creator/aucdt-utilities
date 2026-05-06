export default function WidgetsView() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {['Active Users', 'Sessions Today', 'Avg Load', 'Uptime'].map((label, i) => (
        <div key={label} className="bg-white rounded-xl shadow p-6 text-center">
          <div className="text-3xl font-bold text-sky-700">{[1247, 382, '1.2s', '99.8%'][i]}</div>
          <div className="text-sm text-gray-500 mt-1">{label}</div>
        </div>
      ))}
    </div>
  );
}
