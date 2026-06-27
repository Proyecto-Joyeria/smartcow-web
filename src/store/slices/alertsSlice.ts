import { createSlice, createSelector } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import type { Alert } from '@/types/alert.types';

const MAX_RECENT = 10;

interface AlertsState {
  unreadCount:  number;
  recentAlerts: Alert[];
}

const initialState: AlertsState = {
  unreadCount:  0,
  recentAlerts: [],
};

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    addAlert(state, action: PayloadAction<Alert>) {
      state.recentAlerts.unshift(action.payload);
      if (state.recentAlerts.length > MAX_RECENT) {
        state.recentAlerts.pop();
      }
      state.unreadCount += 1;
    },

    clearUnread(state) {
      state.unreadCount = 0;
    },

    resetRecent(state) {
      state.recentAlerts = [];
    },
  },
});

export const { addAlert, clearUnread, resetRecent } = alertsSlice.actions;
export const alertsReducer = alertsSlice.reducer;

export const selectUnreadCount = (state: RootState) => state.alerts.unreadCount;

export const selectRecentAlerts = createSelector(
  (state: RootState) => state.alerts.recentAlerts,
  alerts => alerts,
);
