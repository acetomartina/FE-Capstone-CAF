export type RisultatoClienteRicerca = {
  id: number;
  nome: string;
  cognome: string;
  codiceFiscale: string;
  email: string;
  telefono: string | null;
  attivo: boolean;
};

export type RicercaGlobaleResponse = {
  clienti: RisultatoClienteRicerca[];
  pratiche: unknown[];
  documenti: unknown[];
};