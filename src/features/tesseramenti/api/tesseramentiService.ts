import api from "../../../services/api";

import type {
  CreaTesseramentoRequest,
  Tesseramento,
} from "../types/tesseramentiTypes";

const baseUrl = (
  clienteId: number,
) =>
  `/api/clienti/${clienteId}/tesseramenti`;

export const tesseramentiService = {
  async trovaCorrente(
    clienteId: number,
  ): Promise<Tesseramento | null> {
    const risposta =
      await api.get<Tesseramento>(
        `${baseUrl(clienteId)}/corrente`,
      );

    if (risposta.status === 204) {
      return null;
    }

    return risposta.data;
  },

  async trovaStorico(
    clienteId: number,
  ): Promise<Tesseramento[]> {
    const risposta =
      await api.get<Tesseramento[]>(
        baseUrl(clienteId),
      );

    return risposta.data;
  },

  async crea(
    clienteId: number,
    dati: CreaTesseramentoRequest,
  ): Promise<Tesseramento> {
    const risposta =
      await api.post<Tesseramento>(
        baseUrl(clienteId),
        dati,
      );

    return risposta.data;
  },
};