import type { Track, SourcePlatform, SourceAccountTier } from '../types';

const TRACKS_KEY = 'plcrp-tracks';

const resolveRightsStatus = (platform: SourcePlatform, tier: SourceAccountTier) => {
  if (platform === 'suno' && tier === 'free') return 'NON_COMMERCIAL' as const;
  if (platform === 'udio' && tier === 'free') return 'NON_COMMERCIAL' as const;
  if (platform === 'original') return 'COMMERCIAL' as const;
  if (platform === 'licensed') return 'COMMERCIAL' as const;
  if (tier === 'pro' || tier === 'enterprise') return 'COMMERCIAL' as const;
  return 'PENDING' as const;
};

const generateAuditHash = (track: Partial<Track>): string => {
  const payload = JSON.stringify({ id: track.id, title: track.title, rights: track.rightsStatus, stage: track.currentStage, ts: track.updatedAt });
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
};

export const seedTracks = (): Track[] => [
  {
    id: 'track-001',
    title: 'Neon Frequencies',
    artist: 'Kwame Asante',
    sourcePlatform: 'original',
    sourceAccountTier: 'pro',
    rightsStatus: 'COMMERCIAL',
    currentStage: 'S3',
    humanAuthorshipElements: 4,
    createdAt: '2026-04-01T10:00:00Z',
    updatedAt: '2026-04-20T14:30:00Z',
    auditHash: 'a1b2c3d4',
  },
  {
    id: 'track-002',
    title: 'Fixture-NonCommercial-Track-001',
    artist: 'AI Studio',
    sourcePlatform: 'suno',
    sourceAccountTier: 'free',
    rightsStatus: 'NON_COMMERCIAL',
    currentStage: 'S2',
    humanAuthorshipElements: 0,
    createdAt: '2026-04-05T09:00:00Z',
    updatedAt: '2026-04-22T11:00:00Z',
    auditHash: 'e5f6a7b8',
  },
  {
    id: 'track-003',
    title: 'Accra Midnight',
    artist: 'Ama Osei',
    sourcePlatform: 'licensed',
    sourceAccountTier: 'enterprise',
    rightsStatus: 'COMMERCIAL',
    currentStage: 'S4',
    humanAuthorshipElements: 2,
    createdAt: '2026-03-15T08:00:00Z',
    updatedAt: '2026-04-18T16:45:00Z',
    auditHash: 'c9d0e1f2',
  },
  {
    id: 'track-004',
    title: 'Gold Coast Drift',
    artist: 'Kofi Mensah',
    sourcePlatform: 'udio',
    sourceAccountTier: 'pro',
    rightsStatus: 'COMMERCIAL',
    currentStage: 'S5',
    humanAuthorshipElements: 3,
    createdAt: '2026-02-28T12:00:00Z',
    updatedAt: '2026-04-15T10:00:00Z',
    auditHash: '3a4b5c6d',
  },
  {
    id: 'track-005',
    title: 'Synthetic Horizon',
    artist: 'AI Composer',
    sourcePlatform: 'udio',
    sourceAccountTier: 'free',
    rightsStatus: 'NON_COMMERCIAL',
    currentStage: 'S1',
    humanAuthorshipElements: 0,
    createdAt: '2026-04-24T15:00:00Z',
    updatedAt: '2026-04-24T15:00:00Z',
    auditHash: '7e8f9a0b',
  },
];

export const getTracks = (): Track[] => {
  try {
    const stored = localStorage.getItem(TRACKS_KEY);
    if (stored) return JSON.parse(stored);
    const seed = seedTracks().map(t => ({ ...t, auditHash: generateAuditHash(t) }));
    localStorage.setItem(TRACKS_KEY, JSON.stringify(seed));
    return seed;
  } catch {
    return seedTracks();
  }
};

export const saveTrack = (track: Track): Track => {
  const updated = { ...track, updatedAt: new Date().toISOString() };
  updated.auditHash = generateAuditHash(updated);
  const tracks = getTracks().map(t => t.id === track.id ? updated : t);
  localStorage.setItem(TRACKS_KEY, JSON.stringify(tracks));
  return updated;
};

export const addTrack = (data: { title: string; artist: string; sourcePlatform: SourcePlatform; sourceAccountTier: SourceAccountTier }): Track => {
  const rights = resolveRightsStatus(data.sourcePlatform, data.sourceAccountTier);
  const now = new Date().toISOString();
  const partial: Partial<Track> = {
    id: `track-${Date.now()}`,
    title: data.title,
    artist: data.artist,
    sourcePlatform: data.sourcePlatform,
    sourceAccountTier: data.sourceAccountTier,
    rightsStatus: rights,
    currentStage: 'S1',
    humanAuthorshipElements: 0,
    createdAt: now,
    updatedAt: now,
  };
  const track: Track = { ...partial as Track, auditHash: generateAuditHash(partial) };
  const tracks = getTracks();
  tracks.unshift(track);
  localStorage.setItem(TRACKS_KEY, JSON.stringify(tracks));
  return track;
};

export const canPromote = (track: Track): { allowed: boolean; reason: string } => {
  if (track.rightsStatus === 'NON_COMMERCIAL' && track.currentStage === 'S2') {
    return { allowed: false, reason: 'Free-tier source — non-commercial. Cannot promote past S2.' };
  }
  if (track.currentStage === 'S4' && track.humanAuthorshipElements < 2) {
    return { allowed: false, reason: `Insufficient human authorship elements (${track.humanAuthorshipElements}/2 required).` };
  }
  if (track.currentStage === 'S5') {
    return { allowed: false, reason: 'Track is already at the final stage.' };
  }
  if (track.rightsStatus !== 'COMMERCIAL') {
    return { allowed: false, reason: 'Rights status must be COMMERCIAL to promote.' };
  }
  return { allowed: true, reason: '' };
};
