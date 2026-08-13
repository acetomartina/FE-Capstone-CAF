import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import {
  praticheService,
} from "../api/praticheService";

import type {
  ParametriRicercaPratiche,
  Pratica,
  RispostaPaginata,
} from "../types/praticheTypes";

interface PraticheState {
  elenco: Pratica[];

  praticaSelezionata:
    | Pratica
    | null;

  paginaCorrente: number;

  totalePagine: number;

  totaleElementi: number;

  dimensionePagina: number;

  caricamento: boolean;

  errore:
    | string
    | null;
}

const initialState: PraticheState = {
  elenco: [],

  praticaSelezionata: null,

  paginaCorrente: 0,

  totalePagine: 0,

  totaleElementi: 0,

  dimensionePagina: 10,

  caricamento: false,

  errore: null,
};

export const caricaPratiche =
  createAsyncThunk<
    RispostaPaginata<Pratica>,
    | ParametriRicercaPratiche
    | undefined,
    {
      rejectValue: string;
    }
  >(
    "pratiche/caricaPratiche",

    async (
      parametri = {},
      {
        rejectWithValue,
      },
    ) => {
      try {
        return await praticheService
          .trovaTutte(
            parametri,
          );
      } catch {
        return rejectWithValue(
          "Impossibile caricare l’elenco delle pratiche.",
        );
      }
    },
  );

export const caricaPraticaPerId =
  createAsyncThunk<
    Pratica,
    number,
    {
      rejectValue: string;
    }
  >(
    "pratiche/caricaPraticaPerId",

    async (
      id,
      {
        rejectWithValue,
      },
    ) => {
      try {
        return await praticheService
          .trovaPerId(id);
      } catch {
        return rejectWithValue(
          "Impossibile caricare la pratica selezionata.",
        );
      }
    },
  );

const praticheSlice =
  createSlice({
    name: "pratiche",

    initialState,

    reducers: {
      pulisciPraticaSelezionata: (
        state,
      ) => {
        state.praticaSelezionata =
          null;
      },

      impostaDimensionePagina: (
        state,
        action: PayloadAction<number>,
      ) => {
        state.dimensionePagina =
          action.payload;

        state.paginaCorrente = 0;
      },

      pulisciErrorePratiche: (
        state,
      ) => {
        state.errore = null;
      },
    },

    extraReducers: (
      builder,
    ) => {
      builder
        .addCase(
          caricaPratiche.pending,
          (state) => {
            state.caricamento =
              true;

            state.errore = null;
          },
        )

        .addCase(
          caricaPratiche.fulfilled,
          (
            state,
            action,
          ) => {
            state.caricamento =
              false;

            state.elenco =
              action.payload.content;

            state.paginaCorrente =
              action.payload.number;

            state.totalePagine =
              action.payload.totalPages;

            state.totaleElementi =
              action.payload.totalElements;

            state.dimensionePagina =
              action.payload.size;
          },
        )

        .addCase(
          caricaPratiche.rejected,
          (
            state,
            action,
          ) => {
            state.caricamento =
              false;

            state.errore =
              action.payload ??
              "Si è verificato un errore durante il caricamento.";
          },
        )

        .addCase(
          caricaPraticaPerId.pending,
          (state) => {
            state.caricamento =
              true;

            state.errore = null;
          },
        )

        .addCase(
          caricaPraticaPerId.fulfilled,
          (
            state,
            action,
          ) => {
            state.caricamento =
              false;

            state.praticaSelezionata =
              action.payload;
          },
        )

        .addCase(
          caricaPraticaPerId.rejected,
          (
            state,
            action,
          ) => {
            state.caricamento =
              false;

            state.errore =
              action.payload ??
              "Si è verificato un errore durante il caricamento.";
          },
        );
    },
  });

export const {
  pulisciPraticaSelezionata,
  impostaDimensionePagina,
  pulisciErrorePratiche,
} = praticheSlice.actions;

export default praticheSlice.reducer;