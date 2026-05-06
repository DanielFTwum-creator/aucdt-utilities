// Enums based on SRS Section 4.1
export enum OutputFormat {
  PDF = 'PDF',
  XLSX = 'XLSX',
  CSV = 'CSV',
  DOCX = 'DOCX',
  HTML = 'HTML',
  JSON = 'JSON'
}

export enum JobStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED'
}

export enum ExecutionStatus {
  QUEUED = 'QUEUED',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  TIMEOUT = 'TIMEOUT',
  CANCELLED = 'CANCELLED'
}

export enum DeliveryChannel {
  EMAIL = 'EMAIL',
  SHAREPOINT = 'SHAREPOINT',
  GDRIVE = 'GDRIVE',
  SFTP = 'SFTP',
  REST_API = 'REST_API'
}

// Entity Interfaces
export interface ReportJob {
  id: number;
  uuid: string;
  name: string;
  description: string;
  owner_id: number;
  json_definition: string; // Stored as stringified JSON for editing
  output_format: OutputFormat;
  status: JobStatus;
  priority: number; // 1-10 scale (1 = High, 10 = Low)
  max_retries: number;
  timeout_seconds: number;
  created_at: string;
  updated_at: string;
  last_execution?: ExecutionInstance; // Joined for display
  schedule?: Schedule; // Joined for display
}

export interface Schedule {
  id: number;
  job_id: number;
  cron_expression: string;
  timezone: string;
  is_active: boolean;
  next_run_at: string;
}

export interface ExecutionInstance {
  id: number;
  job_id: number;
  status: ExecutionStatus;
  started_at: string;
  completed_at?: string;
  duration_ms?: number;
  output_path?: string;
  output_size_bytes?: number;
  row_count?: number;
  error_message?: string;
}

export interface DeliveryTarget {
  id: number;
  job_id: number;
  channel: DeliveryChannel;
  config: Record<string, any>;
  is_active: boolean;
}

export interface User {
  id: number;
  username: string;
  role: 'ADMIN' | 'USER';
  name: string;
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  status: 'SUCCESS' | 'FAILURE';
  details?: string;
}

// Admin Metrics Types
export interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  history: { time: string; value: number }[];
}

// API Gateway Types
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH'
}

export enum AuthType {
  NONE = 'NONE',
  API_KEY = 'API_KEY',
  OAUTH2 = 'OAUTH2',
  JWT = 'JWT'
}

export interface GatewayRoute {
  id: string;
  path: string;
  method: HttpMethod;
  upstream_service: string;
  auth_type: AuthType;
  rate_limit_per_min: number;
  is_active: boolean;
  description: string;
}

// Testing Framework Types
export interface TestStep {
  id: number;
  action: string;
  selector?: string;
  expected?: string;
  description: string;
}

export interface PuppeteerScenario {
  id: string;
  name: string;
  description: string;
  criticality: 'HIGH' | 'MEDIUM' | 'LOW';
  code: string; // The Puppeteer script content
  steps: TestStep[];
}

export interface TestRunResult {
  scenarioId: string;
  timestamp: string;
  success: boolean;
  logs: string[];
  durationMs: number;
  screenshotUrl?: string; // Mock URL
}