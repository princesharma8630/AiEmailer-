import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlices/authslice'; // ✅ make sure this path is correct
import dashboardReducer from './slices/dashboardslices/dashboardSlice';
import mailAnalytics from './slices/AnalysisSlice/mailAnalyticsSlice';
import  bulkEmailReducer  from './slices/bulkEmailSlice/bulkEmailSlice';
import scheduleEmailReducer from '../redux/slices/scheduleEmailSlice/scheduleEmailSlice';
import customEmailReducer from './slices/customEmailSlice/customEmailSlice';
import signatureReducer from '../redux/slices/signatureSlices/signatureSlice'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard:dashboardReducer,
    mailAnalytics:mailAnalytics,
    bulkEmailReducer: bulkEmailReducer,
    scheduleEmail: scheduleEmailReducer,
    customEmal: customEmailReducer,
    signature

  },
});

// ✅ Export types for use across your app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
