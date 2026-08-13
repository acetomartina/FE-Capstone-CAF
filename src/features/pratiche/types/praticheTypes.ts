export type StatoPratica =
  | "BOZZA"
  | "DA_AVVIARE"
  | "IN_LAVORAZIONE"
  | "IN_ATTESA_DOCUMENTI"
  | "IN_ATTESA_CLIENTE"
  | "IN_ATTESA_ENTE"
  | "COMPLETATA"
  | "ANNULLATA";

export type PrioritaPratica =
  | "BASSA"
  | "NORMALE"
  | "ALTA"
  | "URGENTE";

export type UtentePratica = {
  id: number;
  nome: string;
  cognome: string;
  email: string;
};

export type ServizioPratica = {
  id: number;
  nome: string;
  slug: string;
  macroAreaId: number;
  macroAreaNome: string;
};

export type Pratica = {
  id: number;

  numeroPratica: string;

  cliente: UtentePratica;

  servizio: ServizioPratica;

  responsabile:
    | UtentePratica
    | null;

  oggetto: string;

  descrizione:
    | string
    | null;

  stato: StatoPratica;

  priorita: PrioritaPratica;

  dataScadenza:
    | string
    | null;

  chiusoIl:
    | string
    | null;

  note:
    | string
    | null;

  creatoIl: string;

  aggiornatoIl: string;
};

export type RispostaPaginata<T> = {
  content: T[];

  number: number;

  size: number;

  totalElements: number;

  totalPages: number;

  first: boolean;

  last: boolean;

  empty: boolean;
};

export type ParametriRicercaPratiche = {
  q?: string;

  stato?: StatoPratica;

  servizioId?: number;

  responsabileId?: number;

  page?: number;

  size?: number;

  sort?: string;
};

export type CreaPraticaRequest = {
  clienteId: number;

  servizioId: number;

  responsabileId?:
    | number
    | null;

  oggetto: string;

  descrizione?:
    | string
    | null;

  priorita?:
    | PrioritaPratica
    | null;

  dataScadenza?:
    | string
    | null;

  note?:
    | string
    | null;
};

export type AggiornaPraticaRequest = {
  responsabileId?:
    | number
    | null;

  oggetto: string;

  descrizione?:
    | string
    | null;

  priorita?:
    | PrioritaPratica
    | null;

  dataScadenza?:
    | string
    | null;

  note?:
    | string
    | null;
};

export type CambiaStatoPraticaRequest = {
  stato: StatoPratica;
};