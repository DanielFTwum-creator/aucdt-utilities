import { dbService } from './dbService';

export type SimulationResponseType = 'SUCCESS' | 'QUOTA_EXCEEDED' | 'SAFETY_BLOCK' | 'INVALID_KEY';

const SETTINGS_KEYS = {
  SIMULATOR_ENABLED: 'simulator_enabled',
  SIMULATOR_RESPONSE: 'simulator_response'
};

export const isSimulatorEnabled = async (): Promise<boolean> => {
  return (await dbService.getSetting<boolean>(SETTINGS_KEYS.SIMULATOR_ENABLED)) || false;
};

export const setSimulatorEnabled = async (enabled: boolean): Promise<void> => {
  await dbService.setSetting(SETTINGS_KEYS.SIMULATOR_ENABLED, enabled);
};

export const getSimulatorResponse = async (): Promise<SimulationResponseType> => {
  return (await dbService.getSetting<SimulationResponseType>(SETTINGS_KEYS.SIMULATOR_RESPONSE)) || 'SUCCESS';
};

export const setSimulatorResponse = async (response: SimulationResponseType): Promise<void> => {
  await dbService.setSetting(SETTINGS_KEYS.SIMULATOR_RESPONSE, response);
};
