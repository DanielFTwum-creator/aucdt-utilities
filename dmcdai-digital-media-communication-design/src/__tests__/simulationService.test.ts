import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../../services/dbService', () => ({
  dbService: {
    getSetting: vi.fn(),
    setSetting: vi.fn(),
  },
}));

import {
  isSimulatorEnabled,
  setSimulatorEnabled,
  getSimulatorResponse,
  setSimulatorResponse,
} from '../../services/simulationService';
import { dbService } from '../../services/dbService';

const mockDb = dbService as any;

describe('simulationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('isSimulatorEnabled returns false when not set', async () => {
    mockDb.getSetting.mockResolvedValue(null);
    expect(await isSimulatorEnabled()).toBe(false);
  });

  it('isSimulatorEnabled returns true when set', async () => {
    mockDb.getSetting.mockResolvedValue(true);
    expect(await isSimulatorEnabled()).toBe(true);
  });

  it('setSimulatorEnabled calls dbService.setSetting', async () => {
    mockDb.setSetting.mockResolvedValue(undefined);
    await setSimulatorEnabled(true);
    expect(mockDb.setSetting).toHaveBeenCalledWith('simulator_enabled', true);
  });

  it('getSimulatorResponse defaults to SUCCESS when not set', async () => {
    mockDb.getSetting.mockResolvedValue(null);
    expect(await getSimulatorResponse()).toBe('SUCCESS');
  });

  it('getSimulatorResponse returns stored value', async () => {
    mockDb.getSetting.mockResolvedValue('QUOTA_EXCEEDED');
    expect(await getSimulatorResponse()).toBe('QUOTA_EXCEEDED');
  });

  it('setSimulatorResponse calls dbService.setSetting with response type', async () => {
    mockDb.setSetting.mockResolvedValue(undefined);
    await setSimulatorResponse('SAFETY_BLOCK');
    expect(mockDb.setSetting).toHaveBeenCalledWith('simulator_response', 'SAFETY_BLOCK');
  });
});
