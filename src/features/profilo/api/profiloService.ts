import api from "../../../services/api";

import type {
  AggiornaProfiloRequest,
  CambiaPasswordProfiloRequest,
  MessaggioProfiloResponse,
  ProfiloUtente,
} from "../types/profiloTypes";

const BASE_PROFILO = "/api/profilo";

export const profiloService = {
  async trovaProfilo(): Promise<ProfiloUtente> {
    const risposta =
      await api.get<ProfiloUtente>(
        BASE_PROFILO,
      );

    return risposta.data;
  },

  async aggiornaProfilo(
    dati: AggiornaProfiloRequest,
  ): Promise<ProfiloUtente> {
    const risposta =
      await api.put<ProfiloUtente>(
        BASE_PROFILO,
        dati,
      );

    return risposta.data;
  },

  async cambiaPassword(
    dati: CambiaPasswordProfiloRequest,
  ): Promise<MessaggioProfiloResponse> {
    const risposta =
      await api.patch<MessaggioProfiloResponse>(
        `${BASE_PROFILO}/password`,
        dati,
      );

    return risposta.data;
  },
};