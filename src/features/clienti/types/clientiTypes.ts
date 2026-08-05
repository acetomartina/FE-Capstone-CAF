// rispecchia il ClienteResponse del BE

export interface Cliente {
  id: number;
  nome: string;
  cognome: string;
  codiceFiscale: string;
  dataNascita: string | null;
  luogoNascita: string | null;
  email: string;
  telefono: string | null;
  indirizzo: string | null;
  comune: string | null;
  provincia: string | null;
  cap: string | null;
  attivo: boolean;
  emailVerificata: boolean;
  urlImmagineProfilo: string | null;
  creatoIl: string;
  aggiornatoIl: string;
}

export interface RispostaPaginata<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ParametriRicercaClienti {
  page?: number;
  size?: number;
  sort?: string;
  cognome?: string;
  codiceFiscale?: string;
}