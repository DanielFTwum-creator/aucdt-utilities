
import { ScheduledPost, AuditLogEntry, Theme, FeatureFlag, GeminiModel, User } from '../types';

// =====================
// GLOBAL TYPES & SETUP
// =====================

declare global {
  interface Window {
    storage: {
      get: (key: string) => Promise<{ value: string } | null>;
      set: (key: string, value: string) => Promise<void>;
    };
  }
}

// =====================
// STORAGE POLYFILL
// =====================
if (!window.storage) {
  console.warn("Polyfilling `window.storage` with a localStorage-based fallback for compatibility.");
  window.storage = {
    get: async (key: string): Promise<{ value: string } | null> => {
      const value = localStorage.getItem(key);
      return value !== null ? { value } : null;
    },
    set: async (key: string, value: string): Promise<void> => {
      localStorage.setItem(key, value);
    },
  };
}

// =====================
// STORAGE SERVICE
// =====================

class StorageService {
  private async get<T>(key: string, fallback: T): Promise<T> {
    try {
      const result = await window.storage.get(key);
      return result ? JSON.parse(result.value) : fallback;
    } catch (error) { console.error(`Failed to get ${key}:`, error); return fallback; }
  }
  private async set(key: string, value: any): Promise<void> {
    try { await window.storage.set(key, JSON.stringify(value)); }
    catch (error) { console.error(`Failed to set ${key}:`, error); }
  }
  async getScheduledPosts(): Promise<ScheduledPost[]> { return this.get('scheduled-posts', []); }
  async setScheduledPosts(posts: ScheduledPost[]): Promise<void> { await this.set('scheduled-posts', posts); }
  async getAuditLogs(): Promise<AuditLogEntry[]> { return this.get('audit-logs', []); }
  async setAuditLogs(logs: AuditLogEntry[]): Promise<void> { await this.set('audit-logs', logs); }
  async getTheme(): Promise<Theme> {
    const savedTheme = await this.get<Theme | null>('theme', null);
    if (savedTheme && Object.values(Theme).includes(savedTheme)) return savedTheme;
    return new Date().getHours() >= 18 ? Theme.Dark : Theme.Light;
  }
  async setTheme(theme: Theme): Promise<void> { await this.set('theme', theme); }
  async getFeatureFlags(): Promise<Record<FeatureFlag, boolean>> {
    return this.get('feature-flags', {
      [FeatureFlag.AI_CONTENT_GENERATION]: true, [FeatureFlag.CAMPAIGN_SCHEDULING]: true,
      [FeatureFlag.IMAGE_EDITING]: true, [FeatureFlag.LIVE_AUDIO]: true,
    });
  }
  async setFeatureFlags(flags: Record<FeatureFlag, boolean>): Promise<void> { await this.set('feature-flags', flags); }
  async getGeminiModel(): Promise<GeminiModel> { return this.get('gemini-model', GeminiModel.FLASH); }
  async setGeminiModel(model: GeminiModel): Promise<void> { await this.set('gemini-model', model); }
  async getCurrentUser(): Promise<User | null> { return this.get('current-user', null); }
  async setCurrentUser(user: User | null): Promise<void> { await this.set('current-user', user); }
}
export const storageService = new StorageService();
