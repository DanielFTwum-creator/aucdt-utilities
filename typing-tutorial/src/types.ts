/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Lesson {
  id: number;
  title: string;
  description: string;
  keys: string;
  icon: string;
  practices: string[];
}

export interface UserProgress {
  level: number;
  points: number;
  accuracy: number;
  wpm: number;
  bestAccuracy: number;
  bestSpeed: number;
  bestCombo: number;
  lessonsCompleted: number;
  unlockedCards: string[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  category: "authentication" | "lesson" | "speedtest" | "game" | "settings" | "system";
  user: string;
  status: "success" | "warning" | "error";
  details: string;
}

export interface ServiceHealth {
  name: string;
  status: "healthy" | "degraded" | "down";
  latency: string;
  port: number;
  details: string;
}

export interface PlaywrightTest {
  id: string;
  name: string;
  category: "admin" | "auth" | "typing" | "workflow";
  status: "idle" | "running" | "passed" | "failed";
  duration?: string;
  error?: string;
  log?: string[];
}

export type ThemeMode = "light" | "dark" | "high-contrast";
