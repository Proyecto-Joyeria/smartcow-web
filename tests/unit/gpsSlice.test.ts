import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import {
  gpsReducer,
  updateAnimalPosition,
  updateAnimalVitals,
  clearPositions,
  selectAllPositions,
  selectAnimalPosition,
  selectRouteHistory,
  selectAnimalVitals,
  selectPositionsByStatus,
} from '@/store/slices/gpsSlice';
import type { RootState } from '@/store';

const EMPTY_STATE = { positions: {}, routeHistory: {}, vitals: {} };

function makeStore(preloadedGps = EMPTY_STATE) {
  return configureStore({
    reducer: { gps: gpsReducer },
    preloadedState: { gps: preloadedGps } as { gps: typeof EMPTY_STATE },
  });
}

const MOCK_POS = {
  animalId: 'a1',
  lat: 4.711,
  lng: -74.072,
  ts: '2026-06-08T00:00:00.000Z',
  status: 'HEALTHY' as const,
  name: 'Estrella',
};

describe('gpsSlice — updateAnimalPosition', () => {
  it('adds a new position', () => {
    const store = makeStore();
    store.dispatch(updateAnimalPosition(MOCK_POS));
    const positions = selectAllPositions(store.getState() as RootState);
    expect(positions).toHaveLength(1);
    expect(positions[0]).toMatchObject({ animalId: 'a1', lat: 4.711 });
  });

  it('overwrites position for same animalId', () => {
    const store = makeStore();
    store.dispatch(updateAnimalPosition(MOCK_POS));
    store.dispatch(updateAnimalPosition({ ...MOCK_POS, lat: 4.800 }));
    const positions = selectAllPositions(store.getState() as RootState);
    expect(positions).toHaveLength(1);
    expect(positions[0].lat).toBe(4.800);
  });

  it('appends to routeHistory', () => {
    const store = makeStore();
    store.dispatch(updateAnimalPosition(MOCK_POS));
    store.dispatch(updateAnimalPosition({ ...MOCK_POS, lat: 4.720 }));
    const history = selectRouteHistory('a1')(store.getState() as RootState);
    expect(history).toHaveLength(2);
    expect(history[1]).toEqual([4.720, -74.072]);
  });

  it('caps routeHistory at 20 entries', () => {
    const store = makeStore();
    for (let i = 0; i < 25; i++) {
      store.dispatch(updateAnimalPosition({ ...MOCK_POS, lat: 4.700 + i * 0.001 }));
    }
    const history = selectRouteHistory('a1')(store.getState() as RootState);
    expect(history).toHaveLength(20);
    // oldest entry (i=0, lat=4.700) should be gone; newest (i=24, lat=4.724) present
    expect(history[history.length - 1][0]).toBeCloseTo(4.724, 3);
  });
});

describe('gpsSlice — updateAnimalVitals', () => {
  it('stores vitals keyed by animalId', () => {
    const store = makeStore();
    store.dispatch(updateAnimalVitals({
      animalId: 'a1',
      temperature: { value: 38.5, unit: '°C',  trend: '↔', history: [] },
      heartRate:   { value: 70,   unit: 'bpm', trend: '↔', history: [] },
      activity:    { value: 5.0,  unit: 'km',  trend: '↔', history: [] },
      battery:     { value: 90,   unit: '%',   trend: '↔', history: [] },
    }));
    const vitals = selectAnimalVitals('a1')(store.getState() as RootState);
    expect(vitals).not.toBeNull();
    expect(vitals!.temperature.value).toBe(38.5);
  });

  it('returns null for unknown animalId', () => {
    const store = makeStore();
    const vitals = selectAnimalVitals('unknown')(store.getState() as RootState);
    expect(vitals).toBeNull();
  });
});

describe('gpsSlice — clearPositions', () => {
  it('empties positions and routeHistory', () => {
    const store = makeStore();
    store.dispatch(updateAnimalPosition(MOCK_POS));
    store.dispatch(clearPositions());
    expect(selectAllPositions(store.getState() as RootState)).toHaveLength(0);
    expect(selectRouteHistory('a1')(store.getState() as RootState)).toHaveLength(0);
  });
});

describe('gpsSlice — selectors', () => {
  it('selectAnimalPosition returns the position for an id', () => {
    const store = makeStore();
    store.dispatch(updateAnimalPosition(MOCK_POS));
    const pos = selectAnimalPosition('a1')(store.getState() as RootState);
    expect(pos).toMatchObject({ animalId: 'a1' });
  });

  it('selectAnimalPosition returns undefined for unknown id', () => {
    const store = makeStore();
    expect(selectAnimalPosition('nope')(store.getState() as RootState)).toBeUndefined();
  });

  it('selectPositionsByStatus filters correctly', () => {
    const store = makeStore();
    store.dispatch(updateAnimalPosition(MOCK_POS));
    store.dispatch(updateAnimalPosition({ ...MOCK_POS, animalId: 'a2', status: 'WARNING' }));
    const healthy = selectPositionsByStatus('HEALTHY')(store.getState() as RootState);
    expect(healthy).toHaveLength(1);
    expect(healthy[0].animalId).toBe('a1');
  });
});
