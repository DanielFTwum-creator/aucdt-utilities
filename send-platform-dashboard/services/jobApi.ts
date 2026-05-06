import { api } from './apiClient';
import { ReportJob, ExecutionInstance, Schedule } from '../types';

// ─── Raw shapes returned by the Java API (camelCase) ─────────────────────────

interface ApiSchedule {
  id: number;
  cronExpression: string;
  timezone: string;
  active: boolean;
  nextRunAt?: string;
  lastRunAt?: string;
}

interface ApiExecution {
  id: number;
  status: string;
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  outputPath?: string;
  outputSizeBytes?: number;
  rowCount?: number;
  errorMessage?: string;
  retryCount?: number;
}

interface ApiJob {
  id: number;
  uuid: string;
  name: string;
  description: string;
  owner?: { id: number; username: string; name: string };
  jsonDefinition?: string;
  outputFormat: string;
  status: string;
  priority: number;
  maxRetries: number;
  timeoutSeconds: number;
  createdAt: string;
  updatedAt: string;
  schedule?: ApiSchedule;
  executions?: ApiExecution[];
}

interface PageResponse<T> {
  content: T[];
  page: { totalElements: number; totalPages: number; number: number; size: number };
}

// ─── Mappers ─────────────────────────────────────────────────────────────────

function mapSchedule(s: ApiSchedule): Schedule {
  return {
    id: s.id,
    job_id: 0, // not returned by API (back-reference)
    cron_expression: s.cronExpression,
    timezone: s.timezone,
    is_active: s.active,
    next_run_at: s.nextRunAt ?? '',
  };
}

function mapExecution(e: ApiExecution, jobId: number): ExecutionInstance {
  return {
    id: e.id,
    job_id: jobId,
    status: e.status as ExecutionInstance['status'],
    started_at: e.startedAt,
    completed_at: e.completedAt,
    duration_ms: e.durationMs,
    output_path: e.outputPath,
    output_size_bytes: e.outputSizeBytes,
    row_count: e.rowCount,
    error_message: e.errorMessage,
  };
}

function mapJob(j: ApiJob): ReportJob {
  return {
    id: j.id,
    uuid: j.uuid,
    name: j.name,
    description: j.description,
    owner_id: j.owner?.id ?? 0,
    json_definition: j.jsonDefinition ?? '',
    output_format: j.outputFormat as ReportJob['output_format'],
    status: j.status as ReportJob['status'],
    priority: j.priority,
    max_retries: j.maxRetries,
    timeout_seconds: j.timeoutSeconds,
    created_at: j.createdAt,
    updated_at: j.updatedAt,
    schedule: j.schedule ? mapSchedule(j.schedule) : undefined,
    last_execution: j.executions?.[0] ? mapExecution(j.executions[0], j.id) : undefined,
  };
}

// ─── API functions ────────────────────────────────────────────────────────────

export async function listJobs(page = 0, size = 20): Promise<{ jobs: ReportJob[]; total: number }> {
  const res = await api.get<PageResponse<ApiJob>>(`/jobs?page=${page}&size=${size}`);
  return { jobs: res.content.map(mapJob), total: res.page.totalElements };
}

export async function getJob(id: number): Promise<ReportJob> {
  const j = await api.get<ApiJob>(`/jobs/${id}`);
  return mapJob(j);
}

export interface CreateJobPayload {
  name: string;
  description?: string;
  outputFormat: string;
  priority: number;
  maxRetries?: number;
  timeoutSeconds?: number;
  jsonDefinition?: string;
  schedule?: { cronExpression: string; timezone: string };
}

export async function createJob(payload: CreateJobPayload): Promise<ReportJob> {
  const j = await api.post<ApiJob>('/jobs', payload);
  return mapJob(j);
}

export async function updateJob(id: number, payload: Partial<CreateJobPayload>): Promise<ReportJob> {
  const j = await api.put<ApiJob>(`/jobs/${id}`, payload);
  return mapJob(j);
}

export async function patchJobStatus(id: number, status: string): Promise<ReportJob> {
  const j = await api.patch<ApiJob>(`/jobs/${id}/status`, { status });
  return mapJob(j);
}

export async function runJob(id: number): Promise<ExecutionInstance> {
  const e = await api.post<ApiExecution>(`/jobs/${id}/run`);
  return mapExecution(e, id);
}

export async function getJobExecutions(id: number): Promise<ExecutionInstance[]> {
  const res = await api.get<PageResponse<ApiExecution>>(`/jobs/${id}/executions?size=50`);
  return res.content.map(e => mapExecution(e, id));
}

export async function listExecutions(page = 0, size = 20): Promise<{ executions: ExecutionInstance[]; total: number }> {
  const res = await api.get<PageResponse<ApiExecution>>(`/executions?page=${page}&size=${size}`);
  // executions endpoint doesn't return job_id directly — we set 0 as placeholder
  return { executions: res.content.map(e => mapExecution(e, 0)), total: res.page.totalElements };
}

export interface AdminMetrics {
  totalJobs: number;
  totalUsers: number;
  executions: {
    total: number;
    completed: number;
    failed: number;
    running: number;
  };
}

export async function getAdminMetrics(): Promise<AdminMetrics> {
  return api.get<AdminMetrics>('/admin/metrics');
}
