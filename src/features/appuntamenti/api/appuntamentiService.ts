import api from "../../../services/api";

import type {
  AggiornaAppuntamentoRequest,
  Appuntamento,
  CambiaStatoAppuntamentoRequest,
  CreaAppuntamentoRequest,
  ParametriRicercaAppuntamenti,
} from "../types/appuntamentiTypes";

const BASE_APPUNTAMENTI =
  "/api/appuntamenti";

const costruisciParametri = (
  parametri:
    ParametriRicercaAppuntamenti,
): URLSearchParams => {
  const query = new URLSearchParams();

  if (parametri.dal) {
    query.set(
      "dal",
      parametri.dal,
    );
  }

  if (parametri.al) {
    query.set(
      "al",
      parametri.al,
    );
  }

  if (
    parametri.clienteId !==
    undefined
  ) {
    query.set(
      "clienteId",
      String(parametri.clienteId),
    );
  }

  if (
    parametri.responsabileId !==
    undefined
  ) {
    query.set(
      "responsabileId",
      String(
        parametri.responsabileId,
      ),
    );
  }

  if (parametri.stato) {
    query.set(
      "stato",
      parametri.stato,
    );
  }

  return query;
};

export const appuntamentiService = {
  async trovaTutti(
    parametri:
      ParametriRicercaAppuntamenti = {},
  ): Promise<Appuntamento[]> {
    const query =
      costruisciParametri(
        parametri,
      );

    const suffisso =
      query.toString()
        ? `?${query.toString()}`
        : "";

    const risposta =
      await api.get<Appuntamento[]>(
        `${BASE_APPUNTAMENTI}${suffisso}`,
      );

    return risposta.data;
  },

  async trovaPerId(
    id: number,
  ): Promise<Appuntamento> {
    const risposta =
      await api.get<Appuntamento>(
        `${BASE_APPUNTAMENTI}/${id}`,
      );

    return risposta.data;
  },

  async crea(
    dati: CreaAppuntamentoRequest,
  ): Promise<Appuntamento> {
    const risposta =
      await api.post<Appuntamento>(
        BASE_APPUNTAMENTI,
        dati,
      );

    return risposta.data;
  },

  async aggiorna(
    id: number,
    dati:
      AggiornaAppuntamentoRequest,
  ): Promise<Appuntamento> {
    const risposta =
      await api.put<Appuntamento>(
        `${BASE_APPUNTAMENTI}/${id}`,
        dati,
      );

    return risposta.data;
  },

  async cambiaStato(
    id: number,
    dati:
      CambiaStatoAppuntamentoRequest,
  ): Promise<Appuntamento> {
    const risposta =
      await api.patch<Appuntamento>(
        `${BASE_APPUNTAMENTI}/${id}/stato`,
        dati,
      );

    return risposta.data;
  },

  async elimina(
    id: number,
  ): Promise<void> {
    await api.delete(
      `${BASE_APPUNTAMENTI}/${id}`,
    );
  },
};