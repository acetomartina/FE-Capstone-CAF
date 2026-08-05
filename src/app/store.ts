import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import clientiReducer from "../features/clienti/store/clientiSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    clienti: clientiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;