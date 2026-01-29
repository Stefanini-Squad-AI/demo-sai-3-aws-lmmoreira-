import { configureStore, createSlice } from "@reduxjs/toolkit";
import type { Action, ThunkAction, PayloadAction } from "@reduxjs/toolkit";
import authReducer from "~/features/auth/authSlice";

interface AppState {
  initialized: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AppState = {
  initialized: false,
  loading: false,
  error: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.initialized = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetApp: (state) => {
      state.initialized = false;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setInitialized, setLoading, setError, resetApp } = appSlice.actions;

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/REGISTER',
        ],
      },
    }),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// Selector helpers
export const selectAppState = (state: RootState) => state.app;
export const selectIsInitialized = (state: RootState) => state.app.initialized;
export const selectIsLoading = (state: RootState) => state.app.loading;
export const selectError = (state: RootState) => state.app.error;