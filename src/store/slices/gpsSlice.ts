import { createSlice, createSelector } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import type { HealthStatus, AnimalVitals } from '@/types/animal.types';

const MAX_HISTORY = 20;

export interface GPSPosition {
  animalId: string;
  lat:      number;
  lng:      number;
  ts:       string;
  status:   HealthStatus;
  name?:    string;
}

interface GPSState {
  positions:    Record<string, GPSPosition>;
  routeHistory: Record<string, Array<[number, number]>>;
  vitals:       Record<string, AnimalVitals>;
}

const initialState: GPSState = {
  positions: {
    'mock-1': { animalId: 'mock-1', lat: 4.7110, lng: -74.0721, ts: new Date().toISOString(), status: 'HEALTHY', name: 'Estrella' },
    'mock-2': { animalId: 'mock-2', lat: 4.7150, lng: -74.0680, ts: new Date().toISOString(), status: 'WARNING', name: 'Luna'    },
    'mock-3': { animalId: 'mock-3', lat: 4.7080, lng: -74.0760, ts: new Date().toISOString(), status: 'OFFLINE'                  },
  },
  routeHistory: {},
  vitals:       {},
};

const gpsSlice = createSlice({
  name: 'gps',
  initialState,
  reducers: {
    updateAnimalPosition(state, action: PayloadAction<GPSPosition>) {
      const { animalId, lat, lng } = action.payload;
      state.positions[animalId] = action.payload;

      const history = state.routeHistory[animalId] ?? [];
      history.push([lat, lng]);
      if (history.length > MAX_HISTORY) history.shift();
      state.routeHistory[animalId] = history;
    },

    updateAnimalVitals(state, action: PayloadAction<{ animalId: string } & AnimalVitals>) {
      const { animalId, ...vitals } = action.payload;
      state.vitals[animalId] = vitals;
    },

    clearPositions(state) {
      state.positions    = {};
      state.routeHistory = {};
    },
  },
});

export const { updateAnimalPosition, updateAnimalVitals, clearPositions } = gpsSlice.actions;
export const gpsReducer = gpsSlice.reducer;

export const selectAllPositions = createSelector(
  (state: RootState) => state.gps.positions,
  positions => Object.values(positions),
);

export const selectAnimalPosition = (id: string) => (state: RootState) =>
  state.gps.positions[id];

export const selectRouteHistory = (id: string) => (state: RootState) =>
  state.gps.routeHistory[id] ?? [];

export const selectAnimalVitals = (id: string) => (state: RootState) =>
  state.gps.vitals[id] ?? null;

export const selectPositionsByStatus = (status: HealthStatus) => (state: RootState) =>
  Object.values(state.gps.positions).filter(p => p.status === status);
