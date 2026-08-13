import api from "../../../services/api";

import type {
  RicercaGlobaleResponse,
} from "../types/ricercaTypes";

export const ricercaService = {
  async cerca(
    query: string,
  ): Promise<RicercaGlobaleResponse> {
    const risposta =
      await api.get<RicercaGlobaleResponse>(
        "/api/ricerca-globale",
        {
          params: {
            q: query,
          },
        },
      );

    return risposta.data;
  },
};