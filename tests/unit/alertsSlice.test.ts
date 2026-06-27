import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import {
  alertsReducer,
  addAlert,
  clearUnread,
  resetRecent,
  selectUnreadCount,
  selectRecentAlerts,
} from '@/store/slices/alertsSlice';
import type { Alert } from '@/types/alert.types';

function makeAlert(overrides: Partial<Alert> = {}): Alert {
  return {
    id:          'alert-1',
    title:       'Temperatura elevada',
    description: 'La temperatura supera el umbral crítico',
    severity:    'CRITICAL',
    status:      'OPEN',
    animalId:    'animal-1',
    animalName:  'Estrella',
    createdAt:   '2026-01-01T00:00:00Z',
    updatedAt:   '2026-01-01T00:00:00Z',
    ...overrides,
  };
}

function makeStore() {
  return configureStore({ reducer: { alerts: alertsReducer } });
}

describe('alertsSlice', () => {
  it('starts with unreadCount 0 and empty recentAlerts', () => {
    const store = makeStore();
    expect(selectUnreadCount(store.getState() as any)).toBe(0);
    expect(selectRecentAlerts(store.getState() as any)).toHaveLength(0);
  });

  it('addAlert increments unreadCount', () => {
    const store = makeStore();
    store.dispatch(addAlert(makeAlert()));
    expect(selectUnreadCount(store.getState() as any)).toBe(1);
  });

  it('addAlert prepends to recentAlerts', () => {
    const store = makeStore();
    const a1 = makeAlert({ id: 'a1', title: 'Primera' });
    const a2 = makeAlert({ id: 'a2', title: 'Segunda' });
    store.dispatch(addAlert(a1));
    store.dispatch(addAlert(a2));
    const recent = selectRecentAlerts(store.getState() as any);
    expect(recent[0].id).toBe('a2');
    expect(recent[1].id).toBe('a1');
  });

  it('addAlert caps recentAlerts at 10', () => {
    const store = makeStore();
    for (let i = 0; i < 12; i++) {
      store.dispatch(addAlert(makeAlert({ id: `a${i}` })));
    }
    expect(selectRecentAlerts(store.getState() as any)).toHaveLength(10);
  });

  it('clearUnread resets unreadCount to 0', () => {
    const store = makeStore();
    store.dispatch(addAlert(makeAlert({ id: 'a1' })));
    store.dispatch(addAlert(makeAlert({ id: 'a2' })));
    store.dispatch(clearUnread());
    expect(selectUnreadCount(store.getState() as any)).toBe(0);
  });

  it('clearUnread does not remove recentAlerts', () => {
    const store = makeStore();
    store.dispatch(addAlert(makeAlert()));
    store.dispatch(clearUnread());
    expect(selectRecentAlerts(store.getState() as any)).toHaveLength(1);
  });

  it('resetRecent clears recentAlerts but keeps unreadCount', () => {
    const store = makeStore();
    store.dispatch(addAlert(makeAlert()));
    store.dispatch(resetRecent());
    expect(selectRecentAlerts(store.getState() as any)).toHaveLength(0);
    expect(selectUnreadCount(store.getState() as any)).toBe(1);
  });

  it('multiple addAlerts accumulate unreadCount correctly', () => {
    const store = makeStore();
    store.dispatch(addAlert(makeAlert({ id: 'a1' })));
    store.dispatch(addAlert(makeAlert({ id: 'a2' })));
    store.dispatch(addAlert(makeAlert({ id: 'a3' })));
    expect(selectUnreadCount(store.getState() as any)).toBe(3);
  });
});
