import api from "../../../services/api";

import type {
  DocumentoServizio,
  MacroArea,
  Servizio,
} from "../types/serviziTypes";

const BASE_PUBLIC = "/api/public";

export const serviziPublicService = {
  async trovaMacroAree(): Promise<MacroArea[]> {
    const risposta =
      await api.get<MacroArea[]>(
        `${BASE_PUBLIC}/macro-aree`,
      );

    return risposta.data;
  },

  async trovaServizi(): Promise<Servizio[]> {
    const risposta =
      await api.get<Servizio[]>(
        `${BASE_PUBLIC}/servizi`,
      );

    return risposta.data;
  },

  async trovaServiziPerMacroArea(
    macroAreaId: number,
  ): Promise<Servizio[]> {
    const risposta =
      await api.get<Servizio[]>(
        `${BASE_PUBLIC}/macro-aree/${macroAreaId}/servizi`,
      );

    return risposta.data;
  },

  async trovaServizioPerSlug(
    slug: string,
  ): Promise<Servizio> {
    const risposta =
      await api.get<Servizio>(
        `${BASE_PUBLIC}/servizi/${slug}`,
      );

    return risposta.data;
  },

  async trovaDocumentiPubbliciPerSlug(
    slug: string,
  ): Promise<DocumentoServizio[]> {
    const risposta =
      await api.get<DocumentoServizio[]>(
        `${BASE_PUBLIC}/servizi/${slug}/documenti`,
      );

    return risposta.data;
  },
};