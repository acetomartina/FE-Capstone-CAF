import api from "../../../services/api";

import type {
  Cliente,
  ParametriRicercaClienti,
  RispostaPaginata,
  CreaClienteRequest,
  AggiornaClienteRequest,
} from "../types/clientiTypes";

const BASE_CLIENTI = "/api/clienti";

const costruisciParametri = (
  parametri: ParametriRicercaClienti,
): URLSearchParams => {
  const query = new URLSearchParams();

  if (parametri.page !== undefined) {
    query.set("page", String(parametri.page));
  }

  if (parametri.size !== undefined) {
    query.set("size", String(parametri.size));
  }

  if (parametri.sort) {
    query.set("sort", parametri.sort);
  }

  return query;
};

export const clientiService = {
  async trovaTutti(
    parametri: ParametriRicercaClienti = {},
  ): Promise<RispostaPaginata<Cliente>> {
    const query = costruisciParametri(parametri);

    const risposta =
      await api.get<RispostaPaginata<Cliente>>(
        `${BASE_CLIENTI}?${query.toString()}`,
      );

    return risposta.data;
  },

  async trovaPerId(
    id: number,
  ): Promise<Cliente> {
    const risposta = await api.get<Cliente>(
      `${BASE_CLIENTI}/${id}`,
    );

    return risposta.data;
  },

  async cercaPerCognome(
    cognome: string,
    parametri: ParametriRicercaClienti = {},
  ): Promise<RispostaPaginata<Cliente>> {
    const query = costruisciParametri(parametri);

    query.set("cognome", cognome);

    const risposta =
      await api.get<RispostaPaginata<Cliente>>(
        `${BASE_CLIENTI}/ricerca/cognome?${query.toString()}`,
      );

    return risposta.data;
  },

  async cercaPerCodiceFiscale(
    codiceFiscale: string,
    parametri: ParametriRicercaClienti = {},
  ): Promise<RispostaPaginata<Cliente>> {
    const query = costruisciParametri(parametri);

    query.set(
      "codiceFiscale",
      codiceFiscale,
    );

    const risposta =
      await api.get<RispostaPaginata<Cliente>>(
        `${BASE_CLIENTI}/ricerca/codice-fiscale?${query.toString()}`,
      );

    return risposta.data;
  },

  async creaCliente(
    dati: CreaClienteRequest,
  ): Promise<Cliente> {
    const risposta =
      await api.post<Cliente>(
        BASE_CLIENTI,
        dati,
      );

    return risposta.data;
  },

  async aggiornaCliente(
    id: number,
    dati: AggiornaClienteRequest,
  ): Promise<Cliente> {
    const risposta =
      await api.put<Cliente>(
        `${BASE_CLIENTI}/${id}`,
        dati,
      );

    return risposta.data;
  },

  async eliminaCliente(
    id: number,
  ): Promise<void> {
    await api.delete(
      `${BASE_CLIENTI}/${id}`,
    );
  },

  async ripristinaCliente(
    id: number,
  ): Promise<Cliente> {
    const risposta =
      await api.patch<Cliente>(
        `${BASE_CLIENTI}/${id}/ripristina`,
      );

    return risposta.data;
  },
};