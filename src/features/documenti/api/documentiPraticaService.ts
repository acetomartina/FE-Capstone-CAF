import api from "../../../services/api";

import type {
  DocumentoAdmin,
  DocumentoPratica,
  PaginaDocumentiAdmin,
  ParametriDocumentiAdmin,
  RiepilogoDocumenti,
  RiepilogoDocumentiAdmin,
  StatoDocumentoPratica,
} from "../types/documentiTypes";

const BASE_DOCUMENTI =
  "/api/documenti-pratica";

const costruisciParametriAdmin = (
  parametri: ParametriDocumentiAdmin,
): URLSearchParams => {
  const query = new URLSearchParams();

  if (parametri.termine?.trim()) {
    query.set(
      "termine",
      parametri.termine.trim(),
    );
  }

  if (parametri.stato) {
    query.set(
      "stato",
      parametri.stato,
    );
  }

  if (parametri.tipoObbligatorieta) {
    query.set(
      "tipoObbligatorieta",
      parametri.tipoObbligatorieta,
    );
  }

  query.set(
    "page",
    String(parametri.page ?? 0),
  );

  query.set(
    "size",
    String(parametri.size ?? 20),
  );

  query.set(
    "sort",
    parametri.sort ??
      "aggiornatoIl,desc",
  );

  return query;
};

export const documentiPraticaService = {
  async trovaTutti(
    parametri: ParametriDocumentiAdmin = {},
  ): Promise<PaginaDocumentiAdmin> {
    const query =
      costruisciParametriAdmin(
        parametri,
      );

    const risposta =
      await api.get<PaginaDocumentiAdmin>(
        `${BASE_DOCUMENTI}?${query.toString()}`,
      );

    return risposta.data;
  },

  async riepilogoAdmin():
    Promise<RiepilogoDocumentiAdmin> {
    const risposta =
      await api.get<RiepilogoDocumentiAdmin>(
        `${BASE_DOCUMENTI}/riepilogo`,
      );

    return risposta.data;
  },

  async trovaPerPratica(
    praticaId: number,
  ): Promise<DocumentoPratica[]> {
    const risposta =
      await api.get<DocumentoPratica[]>(
        `/api/pratiche/${praticaId}/documenti`,
      );

    return risposta.data;
  },

  async riepilogo(
    praticaId: number,
  ): Promise<RiepilogoDocumenti> {
    const risposta =
      await api.get<RiepilogoDocumenti>(
        `/api/pratiche/${praticaId}/documenti/riepilogo`,
      );

    return risposta.data;
  },

  async trovaMieiPerPratica(
    praticaId: number,
  ): Promise<DocumentoPratica[]> {
    const risposta =
      await api.get<DocumentoPratica[]>(
        `/api/pratiche/mie/${praticaId}/documenti`,
      );

    return risposta.data;
  },

  async riepilogoMiei(
    praticaId: number,
  ): Promise<RiepilogoDocumenti> {
    const risposta =
      await api.get<RiepilogoDocumenti>(
        `/api/pratiche/mie/${praticaId}/documenti/riepilogo`,
      );

    return risposta.data;
  },

  async cambiaStato(
    documentoId: number,
    stato: StatoDocumentoPratica,
  ): Promise<DocumentoPratica> {
    const risposta =
      await api.patch<DocumentoPratica>(
        `${BASE_DOCUMENTI}/${documentoId}/stato`,
        {
          stato,
        },
      );

    return risposta.data;
  },
};

export type {
  DocumentoAdmin,
};