import type React from 'react';

export type ModuleId =
  | 'tracks'
  | 'releases'
  | 'rights-audit'
  | 'stage-pipeline'
  | 'authorship-registry'
  | 'distribution';

export interface Module {
  id: ModuleId;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export type RightsStatus = 'COMMERCIAL' | 'NON_COMMERCIAL' | 'PENDING' | 'DISPUTED';
export type StageId = 'S1' | 'S2' | 'S3' | 'S4' | 'S5';
export type SourcePlatform = 'suno' | 'udio' | 'original' | 'licensed' | 'sample';
export type SourceAccountTier = 'free' | 'pro' | 'enterprise';

export interface Track {
  id: string;
  title: string;
  artist: string;
  sourcePlatform: SourcePlatform;
  sourceAccountTier: SourceAccountTier;
  rightsStatus: RightsStatus;
  currentStage: StageId;
  humanAuthorshipElements: number;
  createdAt: string;
  updatedAt: string;
  auditHash: string;
}

export interface Release {
  id: string;
  title: string;
  trackIds: string[];
  distributor: string;
  status: 'draft' | 'ready' | 'submitted' | 'live';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  entityType?: 'track' | 'release' | 'system';
  entityId?: string;
  result?: 'allowed' | 'denied' | 'info';
}
