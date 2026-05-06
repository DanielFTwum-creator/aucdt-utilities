import { create } from 'zustand';
import axios from 'axios';

interface Entity {
  id: string;
  name: string;
  status: string;
  health_score: number;
  data?: string;
}

interface Metric {
  id: number;
  timestamp: string;
  value: number;
  metric_type: string;
}

interface AppState {
  entities: Entity[];
  selectedEntity: Entity | null;
  entityMetrics: Metric[];
  isLoading: boolean;
  error: string | null;
  fetchEntities: () => Promise<void>;
  fetchEntityDetails: (id: string) => Promise<void>;
  fetchEntityMetrics: (id: string) => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  entities: [],
  selectedEntity: null,
  entityMetrics: [],
  isLoading: false,
  error: null,
  fetchEntities: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get('/api/v1/entities');
      set({ entities: Array.isArray(response.data) ? response.data : [], isLoading: false });
    } catch (err) {
      set({ error: 'Failed to fetch entities', isLoading: false });
    }
  },
  fetchEntityDetails: async (id: string) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`/api/v1/entities/${id}`);
      set({ selectedEntity: response.data, isLoading: false });
    } catch (err) {
      set({ error: 'Failed to fetch entity details', isLoading: false });
    }
  },
  fetchEntityMetrics: async (id: string) => {
    try {
      const response = await axios.get(`/api/v1/entities/${id}/metrics`);
      set({ entityMetrics: response.data });
    } catch (err) {
      console.error('Failed to fetch metrics');
    }
  },
}));
