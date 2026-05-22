import type { Metadata } from 'next'
import CypressTestDashboard from '@/app/components/cypress-test-dashboard'

export const metadata: Metadata = {
  title: 'Dashboard | Cypress Test Monitor',
  description: 'Real-time monitoring dashboard for Cypress E2E tests',
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen">
      <CypressTestDashboard />
    </main>
  )
}
