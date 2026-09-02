import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, UtenteAutenticato } from "./authTypes";

const initialState: AuthState = {
  utente: null,
  token: null,
  autenticato: false,
  caricamento: false,
  errore: null,
  sessioneVerificata: false,
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
      state.caricamento = false;
      state.errore = null;
      state.sessioneVerificata = true;
    },

    /* Il controllo iniziale e' finito e non c'era nessuna sessione buona:
       da qui in poi "non autenticato" e' una risposta, non un'attesa. */
    sessioneAssente: (state) => {
      state.utente = null;
      state.token = null;
      state.autenticato = false;
      state.caricamento = false;
      state.sessioneVerificata = true;
    },

    impostaCaricamento: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.caricamento = action.payload;

      if (action.payload) {
        state.errore = null;
      }
    },

    impostaErrore: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.errore = action.payload;
      state.caricamento = false;
    },

    aggiornaUtenteAutenticato: (
  state,
  action: PayloadAction<
    Partial<UtenteAutenticato>
  >,
) => {
  if (!state.utente) {
    return;
  }

  state.utente = {
    ...state.utente,
    ...action.payload,
  };
},

    logout: (state) => {
      state.utente = null;
      state.token = null;
      state.autenticato = false;
      state.caricamento = false;
      state.errore = null;

      /* Dopo un'uscita volontaria sappiamo benissimo come stanno le cose:
         resta verificata, altrimenti la guardia tornerebbe ad aspettare. */
      state.sessioneVerificata = true;
    },
  },
});

export const {
  impostaAutenticazione,
  impostaCaricamento,
  impostaErrore,
  sessioneAssente,
  aggiornaUtenteAutenticato,
  logout,
} = authSlice.actions;

export default authSlice.reducer;