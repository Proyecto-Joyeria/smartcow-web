import { configureStore } from '@reduxjs/toolkit';
import { gpsReducer } from './slices/gpsSlice';

export const store = configureStore({
  reducer: {
    gps: gpsReducer,
  },
});

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
