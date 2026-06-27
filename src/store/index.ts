import { configureStore } from '@reduxjs/toolkit';
import { gpsReducer }    from './slices/gpsSlice';
import { alertsReducer } from './slices/alertsSlice';

export const store = configureStore({
  reducer: {
    gps:    gpsReducer,
    alerts: alertsReducer,
  },
});

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
