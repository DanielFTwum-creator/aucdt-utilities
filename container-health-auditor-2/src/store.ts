import { create } from 'zustand';
import axios from 'axios';

interface Container {
  id: string;
  app_name: string;
  container_name: string;
  pod_name: string;
  namespace: string;
  node_name?: string;
  status: string;
  health_score: number;
  prediction?: {
    probability: number;
    time_to_failure: number | null;
  };
}

interface Metric {
  id: number;
  timestamp: string;
  cpu_usage_percent: number;
  memory_usage_bytes: number;
  memory_usage_percent: number;
  restart_count: number;
}

interface AppState {
  containers: Container[];
  selectedContainer: Container | null;
  containerMetrics: Metric[];
  isLoading: boolean;
  error: string | null;
  fetchContainers: () => Promise<void>;
  fetchContainerDetails: (id: string) => Promise<void>;
  fetchContainerMetrics: (id: string) => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  containers: [],
  selectedContainer: null,
  containerMetrics: [],
  isLoading: false,
  error: null,
  fetchContainers: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get('/api/v1/containers');
      set({ containers: response.data, isLoading: false });
    } catch (err) {
      set({ error: 'Failed to fetch containers', isLoading: false });
    }
  },
  fetchContainerDetails: async (id: string) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`/api/v1/containers/${id}`);
      set({ selectedContainer: response.data, isLoading: false });
    } catch (err) {
      set({ error: 'Failed to fetch container details', isLoading: false });
    }
  },
  fetchContainerMetrics: async (id: string) => {
    try {
      const response = await axios.get(`/api/v1/containers/${id}/metrics`);
      set({ containerMetrics: response.data });
    } catch (err) {
      console.error('Failed to fetch metrics');
    }
  },
}));
