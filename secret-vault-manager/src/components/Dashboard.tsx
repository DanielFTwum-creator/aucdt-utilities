import { BarChart3, Activity, TrendingUp } from 'lucide-react'

interface DashboardProps {
  appId: number
  domain: string
}

export default function Dashboard({ appId, domain }: DashboardProps) {
  return (
    <div className="space-y-6 mt-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">12,345</p>
            </div>
            <Activity className="w-8 h-8 text-primary-500" />
          </div>
          <p className="text-xs text-green-600 mt-2">↑ 12% from last hour</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900">145ms</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-xs text-green-600 mt-2">↓ 8% faster</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">99.8%</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Last 24 hours</p>
        </div>
      </div>

      

      {/* Domain-specific content */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-3">{domain} Features</h3>
        <p className="text-gray-600">
          Domain-specific functionality for {domain} applications will be implemented here
          based on the SRS requirements for App {appId}.
        </p>
      </div>
    </div>
  )
}
