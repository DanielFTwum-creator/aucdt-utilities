import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Venture, Brief, VentureSector, VentureStage } from '../types';
import { VENTURES } from '../data/ventures';

interface FilterState {
  sectors: VentureSector[];
  stages: VentureStage[];
  gRange: [number, number];
  mRange: [number, number];
  roiRange: [number, number];
  searchTerm: string;
}

type SortKey = 'name' | 'gScore' | 'mScore' | 'roiProjection' | 'founded';

interface VentureState {
  ventures: Venture[];
  filters: FilterState;
  sortKey: SortKey;
  sortDir: 'asc' | 'desc';
  selectedForCompare: string[];
  briefCache: Record<string, Brief>;
  briefLoading: Record<string, boolean>;
  briefError: Record<string, string | null>;
}

type VentureAction =
  | { type: 'SET_FILTERS'; payload: Partial<FilterState> }
  | { type: 'SET_SORT'; payload: { key: SortKey; dir?: 'asc' | 'desc' } }
  | { type: 'TOGGLE_COMPARE'; payload: string }
  | { type: 'CLEAR_COMPARE' }
  | { type: 'SET_BRIEF_LOADING'; payload: { id: string; loading: boolean } }
  | { type: 'SET_BRIEF_SUCCESS'; payload: { id: string; brief: Brief } }
  | { type: 'SET_BRIEF_ERROR'; payload: { id: string; error: string | null } }
  | { type: 'CLEAR_CACHE' };

const initialState: VentureState = {
  ventures: VENTURES,
  filters: {
    sectors: [],
    stages: [],
    gRange: [0, 100],
    mRange: [0, 100],
    roiRange: [0, 10],
    searchTerm: '',
  },
  sortKey: 'gScore',
  sortDir: 'desc',
  selectedForCompare: [],
  briefCache: {},
  briefLoading: {},
  briefError: {},
};

const ventureReducer = (state: VentureState, action: VentureAction): VentureState => {
  switch (action.type) {
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'SET_SORT':
      return { 
        ...state, 
        sortKey: action.payload.key, 
        sortDir: action.payload.dir || (state.sortKey === action.payload.key ? (state.sortDir === 'asc' ? 'desc' : 'asc') : 'desc') 
      };
    case 'TOGGLE_COMPARE':
      const isSelected = state.selectedForCompare.includes(action.payload);
      if (isSelected) {
        return { ...state, selectedForCompare: state.selectedForCompare.filter(id => id !== action.payload) };
      }
      if (state.selectedForCompare.length < 2) {
        return { ...state, selectedForCompare: [...state.selectedForCompare, action.payload] };
      }
      return state;
    case 'CLEAR_COMPARE':
      return { ...state, selectedForCompare: [] };
    case 'SET_BRIEF_LOADING':
      return { ...state, briefLoading: { ...state.briefLoading, [action.payload.id]: action.payload.loading } };
    case 'SET_BRIEF_SUCCESS':
      return { 
        ...state, 
        briefCache: { ...state.briefCache, [action.payload.id]: action.payload.brief },
        briefLoading: { ...state.briefLoading, [action.payload.id]: false }
      };
    case 'SET_BRIEF_ERROR':
      return { 
        ...state, 
        briefError: { ...state.briefError, [action.payload.id]: action.payload.error },
        briefLoading: { ...state.briefLoading, [action.payload.id]: false }
      };
    case 'CLEAR_CACHE':
      return { ...state, briefCache: {}, briefLoading: {}, briefError: {} };
    default:
      return state;
  }
};

const VentureContext = createContext<{
  state: VentureState;
  dispatch: React.Dispatch<VentureAction>;
} | undefined>(undefined);

export const VentureProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(ventureReducer, initialState);
  return (
    <VentureContext.Provider value={{ state, dispatch }}>
      {children}
    </VentureContext.Provider>
  );
};

export const useVenture = () => {
  const context = useContext(VentureContext);
  if (!context) throw new Error('useVenture must be used within VentureProvider');
  return context;
};
