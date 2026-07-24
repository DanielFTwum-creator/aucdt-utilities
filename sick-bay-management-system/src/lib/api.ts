// SickBay REST client. Talks to the Express API under the sub-path base
// (/sickbay/api/... in production, /api in dev) and carries the in-memory WMS
// access token so the server's auth gate accepts the request. Every function
// returns the frontend types verbatim — the server does the snake/camel mapping.
import { getAccessToken } from './wmsAuth';
import type {
  Patient, Visit, Medication, Referral, FacilityLog, DailyHealthCheck, AuditLog,
} from '../types';

const BASE = import.meta.env.BASE_URL || '/';
const API = `${BASE.replace(/\/$/, '')}/api`;

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAccessToken();
  const res = await fetch(`${API}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try { const b = await res.json(); msg = b.error || msg; } catch { /* keep default */ }
    throw new Error(msg);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

const get = <T>(p: string) => req<T>(p);
const post = <T>(p: string, body: unknown) => req<T>(p, { method: 'POST', body: JSON.stringify(body) });
const put = <T>(p: string, body: unknown) => req<T>(p, { method: 'PUT', body: JSON.stringify(body) });
const del = <T>(p: string) => req<T>(p, { method: 'DELETE' });

/* Reads */
export const getPatients      = () => get<Patient[]>('/patients');
export const getVisits        = () => get<Visit[]>('/visits');
export const getMedications   = () => get<Medication[]>('/medications');
export const getReferrals     = () => get<Referral[]>('/referrals');
export const getFacilityLogs  = () => get<FacilityLog[]>('/facility-logs');
export const getDailyChecks   = () => get<DailyHealthCheck[]>('/daily-checks');
export const getAuditLogs     = () => get<AuditLog[]>('/audit-logs');

/* Writes */
export const addPatient       = (p: Patient) => post<Patient>('/patients', p);

export type VisitPayload = Omit<Visit, 'id' | 'dateTime'> & { referralHospital?: string; referralReason?: string };
export const addVisit         = (v: VisitPayload) => post<{ id: string }>('/visits', v);
export const dischargeVisit   = (id: string, notes: string) => put<{ success: boolean }>(`/visits/${id}/discharge`, { notes });

export const addMedication    = (m: Medication) => post<Medication>('/medications', m);
export const updateMedication = (m: Medication) => put<{ success: boolean }>(`/medications/${m.id}`, m);
export const deleteMedication = (id: string) => del<{ success: boolean }>(`/medications/${id}`);

export const addReferral      = (r: Referral) => post<{ id: string }>('/referrals', r);
export const updateReferral   = (id: string, status: Referral['status'], outcomeNotes?: string) =>
  put<{ success: boolean }>(`/referrals/${id}`, { status, outcomeNotes });

export const addFacilityLog     = (f: FacilityLog) => post<{ id: string }>('/facility-logs', f);
export const resolveFacilityLog = (id: string, resolutionDays: number) =>
  put<{ success: boolean }>(`/facility-logs/${id}/resolve`, { resolutionDays });

export const addDailyCheck    = (c: Omit<DailyHealthCheck, 'id' | 'dateTime'>) => post<{ id: string }>('/daily-checks', c);

export const addAuditLog      = (a: Omit<AuditLog, 'id' | 'dateTime'>) => post<{ id: string }>('/audit-logs', a);
