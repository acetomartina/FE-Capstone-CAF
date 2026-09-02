import api from "../../../services/api";

import type {
  AggiornaPraticaRequest,
  CambiaStatoPraticaRequest,
  CreaPraticaRequest,
  ParametriRicercaPratiche,
  Pratica,
  RispostaPaginata,
} from "../types/praticheTypes";

const BASE_PRATICHE = "/api/pratiche";

const costruisciParametri = (
  parametri: ParametriRicercaPratiche,
): URLSearchParams => {
  const query = new URLSearchParams();

  if (parametri.q?.trim()) {
    query.set(
      "q",
      parametri.q.trim(),
    );
  }

  if (parametri.stato) {
    query.set(
      "stato",
      parametri.stato,
    );
  }

  if (
    parametri.servizioId !==
    undefined
  ) {
    query.set(
      "servizioId",
      String(
        parametri.servizioId,
      ),
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

  if (
    parametri.page !== undefined
  ) {
    query.set(
      "page",
      String(parametri.page),
    );
  }

  if (
    parametri.size !== undefined
  ) {
    query.set(
      "size",
      String(parametri.size),
    );
  }

  if (parametri.sort) {
    query.set(
      "sort",
      parametri.sort,
    );
  }

  return query;
};

export const praticheService = {
  async trovaTutte(
    parametri: ParametriRicercaPratiche = {},
  ): Promise<
    RispostaPaginata<Pratica>
  > {
    const query =
      costruisciParametri(
        parametri,
      );

    const risposta =
      await api.get<
        RispostaPaginata<Pratica>
      >(
        `${BASE_PRATICHE}?${query.toString()}`,
      );

    return risposta.data;
  },

  async trovaPerId(
    id: number,
  ): Promise<Pratica> {
    const risposta =
      await api.get<Pratica>(
        `${BASE_PRATICHE}/${id}`,
      );

    return risposta.data;
  },

  async trovaPerCliente(
    clienteId: number,
    parametri: Pick<
      ParametriRicercaPratiche,
      | "page"
      | "size"
      | "sort"
    > = {},
  ): Promise<
    RispostaPaginata<Pratica>
  > {
    const query =
      costruisciParametri(
        parametri,
      );

    const risposta =
      await api.get<
        RispostaPaginata<Pratica>
      >(
        `${BASE_PRATICHE}/cliente/${clienteId}?${query.toString()}`,
      );

    return risposta.data;
  },

  async trovaMie(
  parametri: Pick<
    ParametriRicercaPratiche,
    "page" | "size" | "sort"
  > = {},
): Promise<RispostaPaginata<Pratica>> {
  const query =
    costruisciParametri(parametri);

  const risposta =
    await api.get<
      RispostaPaginata<Pratica>
    >(
      `${BASE_PRATICHE}/mie?${query.toString()}`,
    );

  return risposta.data;
},

async trovaMiaPerId(
  id: number,
): Promise<Pratica> {
  const risposta =
    await api.get<Pratica>(
      `${BASE_PRATICHE}/mie/${id}`,
    );

  return risposta.data;
},

  async creaPratica(
    dati: CreaPraticaRequest,
  ): Promise<Pratica> {
    const risposta =
      await api.post<Pratica>(
        BASE_PRATICHE,
        dati,
      );

    return risposta.data;
  },

  async aggiornaPratica(
    id: number,
    dati: AggiornaPraticaRequest,
  ): Promise<Pratica> {
    const risposta =
      await api.put<Pratica>(
        `${BASE_PRATICHE}/${id}`,
        dati,
      );

    return risposta.data;
  },

  async cambiaStato(
    id: number,
    dati: CambiaStatoPraticaRequest,
  ): Promise<Pratica> {
    const risposta =
      await api.patch<Pratica>(
        `${BASE_PRATICHE}/${id}/stato`,
        dati,
      );

    return risposta.data;
  },
};