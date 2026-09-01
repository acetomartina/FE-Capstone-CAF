import api from "../../../services/api";

import type {
  AggiornaConfigurazioneTesseramentoRequest,
  ConfigurazioneTesseramento,
} from "../types/configurazioneTesseramentoTypes";

const BASE_URL =
  "/api/amministrazione/tesseramento";

export const configurazioneTesseramentoService = {
  async trova(): Promise<ConfigurazioneTesseramento> {
    const risposta =
      await api.get<ConfigurazioneTesseramento>(
        BASE_URL,
      );

    return risposta.data;
  },

  async aggiorna(
    dati: AggiornaConfigurazioneTesseramentoRequest,
  ): Promise<ConfigurazioneTesseramento> {
    const risposta =
      await api.put<ConfigurazioneTesseramento>(
        BASE_URL,
        dati,
      );

    return risposta.data;
  },
};