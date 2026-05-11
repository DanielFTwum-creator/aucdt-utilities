import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock dbService before importing auditLogService
vi.mock('../../services/dbService', () => ({
  dbService: {
    getAllLogs: vi.fn(),
    addLog: vi.fn(),
    clearLogs: vi.fn(),
  },
}));

import { getLogs, addLog, clearLogs } from '../../services/auditLogService';
import { dbService } from '../../services/dbService';

const mockDb = dbService as any;

describe('auditLogService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getLogs', () => {
    it('returns logs sorted newest first', async () => {
      mockDb.getAllLogs.mockResolvedValue([
        { timestamp: '2026-01-01T10:00:00Z', action: 'Old' },
        { timestamp: '2026-01-01T12:00:00Z', action: 'New' },
      ]);
      const logs = await getLogs();
      expect(logs[0].action).toBe('New');
      expect(logs[1].action).toBe('Old');
    });

    it('returns empty array if dbService throws', async () => {
      mockDb.getAllLogs.mockRejectedValue(new Error('DB error'));
      const logs = await getLogs();
      expect(logs).toEqual([]);
    });
  });

  describe('addLog', () => {
    it('calls dbService.addLog with a timestamped entry', async () => {
      mockDb.addLog.mockResolvedValue(undefined);
      await addLog('Test action');
      expect(mockDb.addLog).toHaveBeenCalledOnce();
      const call = mockDb.addLog.mock.calls[0][0];
      expect(call.action).toBe('Test action');
      expect(typeof call.timestamp).toBe('string');
    });

    it('does not throw if dbService.addLog fails', async () => {
      mockDb.addLog.mockRejectedValue(new Error('DB error'));
      await expect(addLog('Test')).resolves.toBeUndefined();
    });
  });

  describe('clearLogs', () => {
    it('calls dbService.clearLogs', async () => {
      mockDb.clearLogs.mockResolvedValue(undefined);
      await clearLogs();
      expect(mockDb.clearLogs).toHaveBeenCalledOnce();
    });

    it('does not throw if dbService.clearLogs fails', async () => {
      mockDb.clearLogs.mockRejectedValue(new Error('DB error'));
      await expect(clearLogs()).resolves.toBeUndefined();
    });
  });
});
