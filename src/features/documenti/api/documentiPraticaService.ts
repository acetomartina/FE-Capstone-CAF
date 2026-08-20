import api from "../../../services/api";

import type {
  DocumentoPratica,
  RiepilogoDocumenti,
  StatoDocumentoPratica,
} from "../types/documentiTypes";

export const documentiPraticaService = {
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

  async cambiaStato(
    documentoId: number,
    stato: StatoDocumentoPratica,
  ): Promise<DocumentoPratica> {
    const risposta =
      await api.patch<DocumentoPratica>(
        `/api/documenti-pratica/${documentoId}/stato`,
        {
          stato,
        },
      );

    return risposta.data;
  },
};