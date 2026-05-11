
import React, { createContext, Dispatch, useContext, useEffect, useReducer } from 'react';
import { INITIAL_COURSES, INITIAL_LECTURERS, INITIAL_PROGRAMMES } from '../constants';
import type { AppState } from '../types';
import { AppAction, appReducer } from './reducer';

const LOCAL_STORAGE_KEY = 'lems_app_state';

const getInitialState = (): AppState => {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        isAdminAuthenticated: false, // Always reset auth on load
      };
    } catch (e) {
      console.error('Failed to load state from localStorage:', e);
    }
  }

  return {
    programmes: INITIAL_PROGRAMMES,
    courses: INITIAL_COURSES,
    lecturers: INITIAL_LECTURERS,
    assessments: [],
    auditLogs: [],
    isAdminAuthenticated: false,
  };
};

const initialState: AppState = getInitialState();

const AppStateContext = createContext<{
  state: AppState;
  dispatch: Dispatch<AppAction>;
} | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const { isAdminAuthenticated, ...stateToSave } = state;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
  }, [state]);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppStore must be used within an AppStateProvider');
  }
  return context;
};