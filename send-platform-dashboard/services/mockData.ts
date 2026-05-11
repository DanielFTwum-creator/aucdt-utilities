import { ReportJob, JobStatus, OutputFormat, ExecutionStatus, ExecutionInstance, DeliveryChannel, GatewayRoute, HttpMethod, AuthType } from '../types';

export const mockJobs: ReportJob[] = [
  {
    id: 1,
    uuid: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Monthly Enrollment Summary',
    description: 'Aggregates student enrollment data by department for the current semester.',
    owner_id: 101,
    json_definition: JSON.stringify({
      reportName: "Monthly Enrollment Summary",
      dataSource: { query: "SELECT * FROM enrollment..." },
      template: "enrollment-v2"
    }, null, 2),
    output_format: OutputFormat.PDF,
    status: JobStatus.ACTIVE,
    priority: 1,
    max_retries: 3,
    timeout_seconds: 300,
    created_at: '2026-01-15T08:00:00Z',
    updated_at: '2026-02-10T14:30:00Z',
    schedule: {
      id: 1,
      job_id: 1,
      cron_expression: '0 8 1 * *',
      timezone: 'Africa/Accra',
      is_active: true,
      next_run_at: '2026-03-01T08:00:00Z'
    }
  },
  {
    id: 2,
    uuid: '661f9511-f30c-52e5-b827-557766551111',
    name: 'Financial Audit 2025',
    description: 'Yearly financial transaction log for external auditing.',
    owner_id: 102,
    json_definition: JSON.stringify({
      reportName: "Financial Audit",
      dataSource: { table: "transactions_2025" },
      template: "finance-audit-std"
    }, null, 2),
    output_format: OutputFormat.XLSX,
    status: JobStatus.PAUSED,
    priority: 5,
    max_retries: 5,
    timeout_seconds: 600,
    created_at: '2026-02-01T09:00:00Z',
    updated_at: '2026-02-12T11:00:00Z',
    schedule: {
      id: 2,
      job_id: 2,
      cron_expression: '0 0 1 1 *',
      timezone: 'UTC',
      is_active: false,
      next_run_at: '2027-01-01T00:00:00Z'
    }
  },
  {
    id: 3,
    uuid: '772g0622-g41d-63f6-c938-668877662222',
    name: 'Daily System Health Check',
    description: 'Internal report on server status and error rates.',
    owner_id: 101,
    json_definition: JSON.stringify({
      reportName: "System Health",
      dataSource: { api: "/health/metrics" },
      template: "health-check-html"
    }, null, 2),
    output_format: OutputFormat.HTML,
    status: JobStatus.ACTIVE,
    priority: 1,
    max_retries: 1,
    timeout_seconds: 60,
    created_at: '2026-02-14T10:00:00Z',
    updated_at: '2026-02-14T10:00:00Z',
    schedule: {
      id: 3,
      job_id: 3,
      cron_expression: '0 6 * * *',
      timezone: 'UTC',
      is_active: true,
      next_run_at: '2026-02-15T06:00:00Z'
    }
  }
];

export const mockExecutions: ExecutionInstance[] = [
  {
    id: 1001,
    job_id: 1,
    status: ExecutionStatus.COMPLETED,
    started_at: '2026-02-01T08:00:00Z',
    completed_at: '2026-02-01T08:02:15Z',
    duration_ms: 135000,
    output_path: '/reports/2026/feb/enrollment.pdf',
    output_size_bytes: 4500000,
    row_count: 1250
  },
  {
    id: 1002,
    job_id: 3,
    status: ExecutionStatus.COMPLETED,
    started_at: '2026-02-14T06:00:00Z',
    completed_at: '2026-02-14T06:00:05Z',
    duration_ms: 5000,
    output_path: '/reports/system/health_20260214.html',
    output_size_bytes: 15000,
    row_count: 50
  },
  {
    id: 1003,
    job_id: 2,
    status: ExecutionStatus.FAILED,
    started_at: '2026-01-01T00:00:00Z',
    completed_at: '2026-01-01T00:00:10Z',
    duration_ms: 10000,
    error_message: 'Database Connection Timeout: Could not connect to FinanceDB',
    row_count: 0
  }
];

export const mockDeliveryTargets = [
  {
    id: 1,
    job_id: 1,
    channel: DeliveryChannel.EMAIL,
    config: { to: ['dean@techbridge.edu.gh'], subject: 'Monthly Report' },
    is_active: true
  },
  {
    id: 2,
    job_id: 1,
    channel: DeliveryChannel.SHAREPOINT,
    config: { siteId: 'finance-site', library: 'Reports' },
    is_active: true
  }
];

export const mockPerformanceData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  cpu: 20 + Math.random() * 30,
  memory: 40 + Math.random() * 20,
  activeJobs: Math.floor(Math.random() * 10)
}));

export const mockGatewayRoutes: GatewayRoute[] = [
  // User Management Endpoints
  {
    id: 'rt-user-001',
    path: '/api/v1/users',
    method: HttpMethod.GET,
    upstream_service: 'user-service:8080',
    auth_type: AuthType.OAUTH2,
    rate_limit_per_min: 1000,
    is_active: true,
    description: 'List all platform users'
  },
  {
    id: 'rt-user-002',
    path: '/api/v1/users',
    method: HttpMethod.POST,
    upstream_service: 'user-service:8080',
    auth_type: AuthType.JWT,
    rate_limit_per_min: 100,
    is_active: true,
    description: 'Create a new user'
  },
  {
    id: 'rt-user-003',
    path: '/api/v1/users/:id',
    method: HttpMethod.DELETE,
    upstream_service: 'user-service:8080',
    auth_type: AuthType.JWT,
    rate_limit_per_min: 50,
    is_active: true,
    description: 'Deactivate a user account'
  },
  
  // Data Retrieval Endpoints
  {
    id: 'rt-data-001',
    path: '/api/v1/data/reports',
    method: HttpMethod.GET,
    upstream_service: 'report-engine:8081',
    auth_type: AuthType.API_KEY,
    rate_limit_per_min: 500,
    is_active: true,
    description: 'Retrieve generated report metadata'
  },
  {
    id: 'rt-data-002',
    path: '/api/v1/data/metrics',
    method: HttpMethod.GET,
    upstream_service: 'monitoring-service:9090',
    auth_type: AuthType.API_KEY,
    rate_limit_per_min: 2000,
    is_active: true,
    description: 'Fetch system performance metrics'
  },
  {
    id: 'rt-data-003',
    path: '/api/v1/jobs/:id/execution-log',
    method: HttpMethod.GET,
    upstream_service: 'scheduler-service:8082',
    auth_type: AuthType.OAUTH2,
    rate_limit_per_min: 300,
    is_active: true,
    description: 'Get execution history for a specific job'
  }
];