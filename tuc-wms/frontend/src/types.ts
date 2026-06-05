// Shared TUC-WMS domain types — mirror the backend DTOs documented in
// docs/PROJECTS_TASKS_API.md (SRS TUC-ICT-SRS-2026-004 §3.2–3.4).

export type Visibility = 'PUBLIC' | 'DEPARTMENT' | 'MEMBERS' | 'PRIVATE';
export type ProjectRole = 'VIEWER' | 'COMMENTER' | 'EDITOR' | 'OWNER';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export const VISIBILITIES: Visibility[] = ['PUBLIC', 'DEPARTMENT', 'MEMBERS', 'PRIVATE'];
export const PROJECT_ROLES: ProjectRole[] = ['VIEWER', 'COMMENTER', 'EDITOR', 'OWNER'];
export const PRIORITIES: Priority[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

/** Global roles that may create a project (FR-PROJ-001). */
export const CAN_CREATE_PROJECT = ['LECTURER', 'ADMIN_STAFF', 'HOD', 'SYSTEM_ADMIN'];

export const DEFAULT_STAGES = ['To Do', 'In Progress', 'Review', 'Done'];

export interface ProjectSummary {
  id: number;
  name: string;
  ownerId: number;
  dueDate: string | null;
  memberCount: number;
  visibility: Visibility;
  archived: boolean;
  percentComplete?: number; // FR-PROJ-007 (may be absent until tasks exist)
}

export interface ProjectDetail {
  id: number;
  name: string;
  description: string | null;
  department: string | null;
  startDate: string | null;
  dueDate: string | null;
  visibility: Visibility;
  archived: boolean;
  ownerId: number;
  stages: string[];
  memberCount?: number;
}

export interface ProjectMember {
  userId: number;
  email: string;
  name?: string;
  projectRole: ProjectRole;
}

export interface CreateProjectBody {
  name: string;
  description?: string;
  department?: string;
  startDate?: string;
  endDate?: string;
  visibility?: Visibility;
  stages?: string[];
}

export interface TaskDto {
  id: number;
  projectId: number;
  title: string;
  description: string | null; // rich HTML (Tiptap)
  assigneeIds: number[];
  startDate: string | null;
  dueDate: string | null;
  priority: Priority;
  status: string; // one of the project's stages
  tags: string[];
  parentTaskId: number | null;
  blockedByTaskIds: number[];
  milestone: boolean;
  subtaskCount?: number;
}
