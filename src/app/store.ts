import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import clientiReducer from "../features/clienti/store/clientiSlice";
import praticheReducer from "../features/pratiche/store/praticheSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    clienti: clientiReducer,
    pratiche: praticheReducer,
  },
});

export type RootState = ReturnType<
  typeof store.getState
>;

export type AppDispatch =
  typeof store.dispatch;