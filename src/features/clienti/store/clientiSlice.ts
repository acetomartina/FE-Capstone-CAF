import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import { clientiService } from "../api/clientiService";

import type {
  Cliente,
  ParametriRicercaClienti,
  RispostaPaginata,
} from "../types/clientiTypes";

interface ClientiState {
  elenco: Cliente[];
  clienteSelezionato: Cliente | null;
  paginaCorrente: number;
  totalePagine: number;
  totaleElementi: number;
  dimensionePagina: number;
  caricamento: boolean;
  errore: string | null;
}

const initialState: ClientiState = {
  elenco: [],
  clienteSelezionato: null,
  paginaCorrente: 0,
  totalePagine: 0,
  totaleElementi: 0,
  dimensionePagina: 10,
  caricamento: false,
  errore: null,
};

export const caricaClienti = createAsyncThunk<
  RispostaPaginata<Cliente>,
  ParametriRicercaClienti | undefined,
  { rejectValue: string }
>(
  "clienti/caricaClienti",
  async (parametri = {}, { rejectWithValue }) => {
    try {
      return await clientiService.trovaTutti(parametri);
    } catch {
      return rejectWithValue(
        "Impossibile caricare l’elenco dei clienti."
      );
    }
  }
);

export const caricaClientePerId = createAsyncThunk<
  Cliente,
  number,
  { rejectValue: string }
>(
  "clienti/caricaClientePerId",
  async (id, { rejectWithValue }) => {
    try {
      return await clientiService.trovaPerId(id);
    } catch {
      return rejectWithValue(
        "Impossibile caricare il cliente selezionato."
      );
    }
  }
);

const clientiSlice = createSlice({
  name: "clienti",
  initialState,
  reducers: {
    pulisciClienteSelezionato: (state) => {
      state.clienteSelezionato = null;
    },

    impostaDimensionePagina: (
      state,
      action: PayloadAction<number>
    ) => {
      state.dimensionePagina = action.payload;
      state.paginaCorrente = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(caricaClienti.pending, (state) => {
        state.caricamento = true;
        state.errore = null;
      })
      .addCase(caricaClienti.fulfilled, (state, action) => {
        state.caricamento = false;
        state.elenco = action.payload.content;
        state.paginaCorrente = action.payload.number;
        state.totalePagine = action.payload.totalPages;
        state.totaleElementi = action.payload.totalElements;
        state.dimensionePagina = action.payload.size;
      })
      .addCase(caricaClienti.rejected, (state, action) => {
        state.caricamento = false;
        state.errore =
          action.payload ??
          "Si è verificato un errore durante il caricamento.";
      })

      .addCase(caricaClientePerId.pending, (state) => {
        state.caricamento = true;
        state.errore = null;
      })
      .addCase(caricaClientePerId.fulfilled, (state, action) => {
        state.caricamento = false;
        state.clienteSelezionato = action.payload;
      })
      .addCase(caricaClientePerId.rejected, (state, action) => {
        state.caricamento = false;
        state.errore =
          action.payload ??
          "Si è verificato un errore durante il caricamento.";
      });
  },
});

export const {
  pulisciClienteSelezionato,
  impostaDimensionePagina,
} = clientiSlice.actions;

export default clientiSlice.reducer;