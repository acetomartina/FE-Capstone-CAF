import api from "../../../services/api";

import type {
  Cliente,
  ParametriRicercaClienti,
  RispostaPaginata,
} from "../types/clientiTypes";

const costruisciParametri = (
  parametri: ParametriRicercaClienti
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
    parametri: ParametriRicercaClienti = {}
  ): Promise<RispostaPaginata<Cliente>> {
    const query = costruisciParametri(parametri);

    const risposta = await api.get<RispostaPaginata<Cliente>>(
      `/clienti?${query.toString()}`
    );

    return risposta.data;
  },

  async trovaPerId(id: number): Promise<Cliente> {
    const risposta = await api.get<Cliente>(`/clienti/${id}`);

    return risposta.data;
  },

  async cercaPerCognome(
    cognome: string,
    parametri: ParametriRicercaClienti = {}
  ): Promise<RispostaPaginata<Cliente>> {
    const query = costruisciParametri(parametri);
    query.set("cognome", cognome);

    const risposta = await api.get<RispostaPaginata<Cliente>>(
      `/clienti/ricerca/cognome?${query.toString()}`
    );

    return risposta.data;
  },

  async cercaPerCodiceFiscale(
    codiceFiscale: string,
    parametri: ParametriRicercaClienti = {}
  ): Promise<RispostaPaginata<Cliente>> {
    const query = costruisciParametri(parametri);
    query.set("codiceFiscale", codiceFiscale);

    const risposta = await api.get<RispostaPaginata<Cliente>>(
      `/clienti/ricerca/codice-fiscale?${query.toString()}`
    );

    return risposta.data;
  },
};