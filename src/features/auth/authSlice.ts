import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, UtenteAutenticato } from "./authTypes";

const initialState: AuthState = {
  utente: null,
  token: null,
  autenticato: false,
  caricamento: false,
  errore: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    impostaAutenticazione: (
      state,
      action: PayloadAction<{
        utente: UtenteAutenticato;
        token: string;
      }>
    ) => {
      state.utente = action.payload.utente;
      state.token = action.payload.token;
      state.autenticato = true;
      state.errore = null;
    },

    impostaCaricamento: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.caricamento = action.payload;
    },

    impostaErrore: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.errore = action.payload;
    },

    logout: (state) => {
      state.utente = null;
      state.token = null;
      state.autenticato = false;
      state.caricamento = false;
      state.errore = null;
    },
  },
});

export const {
  impostaAutenticazione,
  impostaCaricamento,
  impostaErrore,
  logout,
} = authSlice.actions;

export default authSlice.reducer;