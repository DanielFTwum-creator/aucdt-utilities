// ── Domain types matching SRS §8.2 and DB schema ─────────────────────────────

export type ComputeMode = 'cpu_draft' | 'gpu_fast' | 'gpu_full' | 'gpu_long'
export type JobStatus   = 'PENDING' | 'PROCESSING' | 'STREAMING' | 'COMPLETE' | 'FAILED'
export type UserRole    = 'GUEST' | 'FREE' | 'PRO' | 'ADMIN'
export type Theme       = 'light' | 'dark' | 'high-contrast'
export type AudioFormat = 'MP3' | 'WAV' | 'OGG'

// ── SSE Events (SRS §8.2) ─────────────────────────────────────────────────────
export interface ProgressEvent {
  pct:     number      // 0–100
  etaMs:   number
  mode:    ComputeMode
}

export interface BlendUpdateEvent {
  activeModel: string  // e.g. "musicgen_medium"
  weight:      number  // 0–1
}

export interface AudioChunkEvent {
  seq:   number        // sequential chunk index
  data:  string        // base64 PCM bytes
  src:   string        // "blended" | model_id
  total: number        // total expected chunks
}

export interface ErrorEvent {
  code:     string
  model:    string
  fallback: boolean
  message?: string
}

export interface DoneEvent {
  trackUuid:   string
  blendRecipe: Record<string, number>
  duration:    number
}

export type SSEEvent =
  | { type: 'progress';     data: ProgressEvent }
  | { type: 'blend_update'; data: BlendUpdateEvent }
  | { type: 'audio_chunk';  data: AudioChunkEvent }
  | { type: 'error';        data: ErrorEvent }
  | { type: 'done';         data: DoneEvent }

// ── Generation ────────────────────────────────────────────────────────────────
export interface GenerationParams {
  prompt:      string
  genre:       string
  mood:        string[]
  tempoBpm:    number
  key:         string
  durationSec: number
  seed?:       number
  qualityMode: ComputeMode | 'auto'
  blendOverride?: Record<string, number>
}

export interface GenerationResponse {
  jobId:            string
  computeMode:      ComputeMode
  estimatedTtfbSec: number
  blendRecipe:      Record<string, number>
  quotaRemaining:   number
}

export interface BlendRecipePreview {
  recipe:           Record<string, number>
  computeMode:      ComputeMode
  estimatedTtfbSec: number
  modelsUsed:       string[]
}

// ── Track Library ────────────────────────────────────────────────────────────
export interface Track {
  uuid:          string
  title:         string
  prompt:        string
  genre:         string
  mood:          string[]
  tempoBpm:      number
  durationSeconds: number
  fileFormat:    AudioFormat
  blendRecipe:   Record<string, number>
  qualityMode:   ComputeMode
  isPublic:      boolean
  createdAt:     string
}

export interface LicenceCertificate {
  licenceUuid:       string
  trackUuid:         string
  spdxIdentifier:    string
  licenceType:       string
  modelLicences:     ModelLicence[]
  generatedBy:       string
  generationTimestamp: string
  sha256Hash:        string
  certificateHash:   string
}

export interface ModelLicence {
  modelId:       string
  spdxIdentifier: string
  attribution?:  string
}

// ── Auth ─────────────────────────────────────────────────────────────────────
export interface AuthUser {
  uuid:           string
  email:          string
  displayName:    string
  role:           UserRole
  quotaRemaining: number
  dailyQuota:     number
}

export interface LoginResponse {
  accessToken:    string
  role:           UserRole
  quotaRemaining: number
}

// ── Admin ─────────────────────────────────────────────────────────────────────
export interface ModelInfo {
  modelId:     string
  displayName: string
  status:      'UNLOADED' | 'LOADING' | 'LOADED' | 'ERROR'
  cpuViable:   boolean
  vramGb?:     number
  licence:     string
}

export interface AimHealth {
  status:       string
  computeMode:  ComputeMode
  gpuAvailable: boolean
  modelsLoaded: string[]
  activeJobs:   number
}
