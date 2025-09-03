import { configureStore } from '@reduxjs/toolkit';
import formReducer from './slices/formSlice';
import countryReducer from './slices/countrySlice';

export const store = configureStore({
  reducer: {
    form: formReducer,
    country: countryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['form/addSubmission'],
        ignoredPaths: ['form.submissions.profilePicture'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
