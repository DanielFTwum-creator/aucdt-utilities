/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface Lesson {
  id: number;
  title: string;
  description: string;
  keys: string;
  icon: string;
  /** Beginner drill pool (the default). */
  practices: string[];
  /** Intermediate drill pool — longer lines, new vocabulary. Falls back to `practices` when absent. */
  practicesIntermediate?: string[];
  /** Advanced drill pool — long, dense lines at full difficulty. Falls back to `practices` when absent. */
  practicesAdvanced?: string[];
  /** "numpad" renders the dedicated numeric-keypad guide instead of the QWERTY hand/keyboard view. Defaults to "qwerty". */
  inputMode?: "qwerty" | "numpad";
  /**
   * Physical-key substitutions applied to typed input while this lesson is active,
   * e.g. { "3": "\u025b" } lets a QWERTY typist produce Ghanaian-language characters.
   * Characters typed natively (from a Ghana keyboard layout) pass through unchanged.
   */
  inputMap?: Record<string, string>;
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
