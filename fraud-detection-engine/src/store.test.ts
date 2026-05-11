import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import axios from 'axios';
import { useAppStore } from './store';

vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('appStore', () => {
  beforeEach(() => {
    // Create fresh store instance for each test
    vi.clearAllMocks();
    // Reset store state manually
    const { fetchEntities } = useAppStore.getState();
    useAppStore.setState({
      entities: [],
      selectedEntity: null,
      entityMetrics: [],
      isLoading: false,
      error: null,
    });
  });

  describe('initial state', () => {
    it('should have empty entities array', () => {
      const { entities } = useAppStore.getState();
      expect(entities).toEqual([]);
    });

    it('should have null selectedEntity', () => {
      const { selectedEntity } = useAppStore.getState();
      expect(selectedEntity).toBeNull();
    });

    it('should have empty entityMetrics array', () => {
      const { entityMetrics } = useAppStore.getState();
      expect(entityMetrics).toEqual([]);
    });

    it('should have isLoading as false', () => {
      const { isLoading } = useAppStore.getState();
      expect(isLoading).toBe(false);
    });

    it('should have error as null', () => {
      const { error } = useAppStore.getState();
      expect(error).toBeNull();
    });
  });

  describe('fetchEntities', () => {
    it('should set isLoading to true during fetch', async () => {
      mockedAxios.get.mockReturnValue(Promise.resolve({ data: [] }));
      const { fetchEntities } = useAppStore.getState();

      const promise = fetchEntities();
      const { isLoading } = useAppStore.getState();
      expect(isLoading).toBe(true);

      await promise;
    });

    it('should fetch entities from API endpoint', async () => {
      const mockEntities = [
        { id: '1', name: 'Bank A', status: 'healthy', health_score: 85 },
        { id: '2', name: 'Bank B', status: 'warning', health_score: 65 }
      ];
      mockedAxios.get.mockResolvedValue({ data: mockEntities });

      const { fetchEntities } = useAppStore.getState();
      await fetchEntities();

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/v1/entities');
    });

    it('should set entities on successful fetch', async () => {
      const mockEntities = [
        { id: '1', name: 'Bank A', status: 'healthy', health_score: 85 }
      ];
      mockedAxios.get.mockResolvedValue({ data: mockEntities });

      const { fetchEntities } = useAppStore.getState();
      await fetchEntities();

      const { entities } = useAppStore.getState();
      expect(entities).toEqual(mockEntities);
    });

    it('should set isLoading to false after successful fetch', async () => {
      mockedAxios.get.mockResolvedValue({ data: [] });
      const { fetchEntities } = useAppStore.getState();
      await fetchEntities();

      const { isLoading } = useAppStore.getState();
      expect(isLoading).toBe(false);
    });

    it('should handle non-array responses gracefully', async () => {
      mockedAxios.get.mockResolvedValue({ data: { invalid: 'response' } });

      const { fetchEntities } = useAppStore.getState();
      await fetchEntities();

      const { entities } = useAppStore.getState();
      expect(entities).toEqual([]);
    });

    it('should set error message on fetch failure', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      const { fetchEntities } = useAppStore.getState();
      await fetchEntities();

      const { error } = useAppStore.getState();
      expect(error).toBe('Failed to fetch entities');
    });

    it('should set isLoading to false on fetch failure', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      const { fetchEntities } = useAppStore.getState();
      await fetchEntities();

      const { isLoading } = useAppStore.getState();
      expect(isLoading).toBe(false);
    });

    it('should set error on fetch failure', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));
      const { fetchEntities } = useAppStore.getState();
      await fetchEntities();
      const { error } = useAppStore.getState();
      // Error is set when fetch fails
      expect(error).toBe('Failed to fetch entities');
    });
  });

  describe('fetchEntityDetails', () => {
    it('should fetch entity details for given ID', async () => {
      const mockEntity = { id: '1', name: 'Bank A', status: 'healthy', health_score: 85 };
      mockedAxios.get.mockResolvedValue({ data: mockEntity });

      const { fetchEntityDetails } = useAppStore.getState();
      await fetchEntityDetails('1');

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/v1/entities/1');
    });

    it('should set selectedEntity on successful fetch', async () => {
      const mockEntity = { id: '1', name: 'Bank A', status: 'healthy', health_score: 85 };
      mockedAxios.get.mockResolvedValue({ data: mockEntity });

      const { fetchEntityDetails } = useAppStore.getState();
      await fetchEntityDetails('1');

      const { selectedEntity } = useAppStore.getState();
      expect(selectedEntity).toEqual(mockEntity);
    });

    it('should set isLoading to true during fetch', async () => {
      mockedAxios.get.mockReturnValue(Promise.resolve({ data: {} }));
      const { fetchEntityDetails } = useAppStore.getState();

      const promise = fetchEntityDetails('1');
      const { isLoading } = useAppStore.getState();
      expect(isLoading).toBe(true);

      await promise;
    });

    it('should set isLoading to false after successful fetch', async () => {
      mockedAxios.get.mockResolvedValue({ data: {} });
      const { fetchEntityDetails } = useAppStore.getState();
      await fetchEntityDetails('1');

      const { isLoading } = useAppStore.getState();
      expect(isLoading).toBe(false);
    });

    it('should set error on fetch failure', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Not found'));

      const { fetchEntityDetails } = useAppStore.getState();
      await fetchEntityDetails('999');

      const { error } = useAppStore.getState();
      expect(error).toBe('Failed to fetch entity details');
    });

    it('should set isLoading to false on fetch failure', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Not found'));

      const { fetchEntityDetails } = useAppStore.getState();
      await fetchEntityDetails('999');

      const { isLoading } = useAppStore.getState();
      expect(isLoading).toBe(false);
    });
  });

  describe('fetchEntityMetrics', () => {
    it('should fetch metrics for given entity ID', async () => {
      const mockMetrics = [
        { id: 1, timestamp: '2026-04-27T10:00:00Z', value: 85, metric_type: 'health' }
      ];
      mockedAxios.get.mockResolvedValue({ data: mockMetrics });

      const { fetchEntityMetrics } = useAppStore.getState();
      await fetchEntityMetrics('1');

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/v1/entities/1/metrics');
    });

    it('should set entityMetrics on successful fetch', async () => {
      const mockMetrics = [
        { id: 1, timestamp: '2026-04-27T10:00:00Z', value: 85, metric_type: 'health' }
      ];
      mockedAxios.get.mockResolvedValue({ data: mockMetrics });

      const { fetchEntityMetrics } = useAppStore.getState();
      await fetchEntityMetrics('1');

      const { entityMetrics } = useAppStore.getState();
      expect(entityMetrics).toEqual(mockMetrics);
    });

    it('should not set isLoading (async operation)', async () => {
      mockedAxios.get.mockResolvedValue({ data: [] });
      const { fetchEntityMetrics } = useAppStore.getState();
      await fetchEntityMetrics('1');

      const { isLoading } = useAppStore.getState();
      expect(isLoading).toBe(false);
    });

    it('should handle fetch failure gracefully (logs to console)', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockedAxios.get.mockRejectedValue(new Error('Failed'));

      const { fetchEntityMetrics } = useAppStore.getState();
      await fetchEntityMetrics('1');

      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch metrics');
      consoleErrorSpy.mockRestore();
    });
  });

  describe('state updates', () => {
    it('should update store state on entity fetch', async () => {
      const mockData = [{ id: '1', name: 'Bank', status: 'healthy', health_score: 85 }];
      mockedAxios.get.mockResolvedValue({ data: mockData });
      const { fetchEntities } = useAppStore.getState();
      await fetchEntities();

      const state = useAppStore.getState();
      expect(state.entities).toEqual(mockData);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('complex scenarios', () => {
    it('should handle sequential entity fetches', async () => {
      const mockEntities1 = [{ id: '1', name: 'Bank A', status: 'healthy', health_score: 85 }];
      const mockEntities2 = [{ id: '2', name: 'Bank B', status: 'warning', health_score: 65 }];

      mockedAxios.get.mockResolvedValueOnce({ data: mockEntities1 });
      const { fetchEntities } = useAppStore.getState();
      await fetchEntities();
      let { entities } = useAppStore.getState();
      expect(entities).toEqual(mockEntities1);

      mockedAxios.get.mockResolvedValueOnce({ data: mockEntities2 });
      await fetchEntities();
      ({ entities } = useAppStore.getState());
      expect(entities).toEqual(mockEntities2);
    });

    it('should handle concurrent fetches (entity list + details)', async () => {
      const mockEntities = [{ id: '1', name: 'Bank A', status: 'healthy', health_score: 85 }];
      const mockDetails = { id: '1', name: 'Bank A', status: 'healthy', health_score: 85, data: 'extra info' };

      mockedAxios.get.mockResolvedValueOnce({ data: mockEntities });
      mockedAxios.get.mockResolvedValueOnce({ data: mockDetails });

      const { fetchEntities, fetchEntityDetails } = useAppStore.getState();
      await Promise.all([fetchEntities(), fetchEntityDetails('1')]);

      const { entities, selectedEntity } = useAppStore.getState();
      expect(entities).toEqual(mockEntities);
      expect(selectedEntity).toEqual(mockDetails);
    });
  });
});
