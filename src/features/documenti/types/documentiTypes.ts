import type {
  UtentePratica,
} from "../../pratiche/types/praticheTypes";

export type StatoDocumentoPratica =
  | "MANCANTE"
  | "RICEVUTO"
  | "DA_VERIFICARE"
  | "VALIDATO"
  | "RIFIUTATO"
  | "NON_APPLICABILE";

export type TipoObbligatorietaDocumento =
  | "OBBLIGATORIO"
  | "CONDIZIONALE"
  | "FACOLTATIVO";

export type DocumentoPratica = {
  id: number;
  praticaId: number;
  numeroPratica: string;
  etichetta: string;
  suggerimento: string | null;
  tipoObbligatorieta: TipoObbligatorietaDocumento;
  stato: StatoDocumentoPratica;
  richiestoDa: UtentePratica | null;
  creatoIl: string;
  aggiornatoIl: string;
};

export type DocumentoAdmin = {
  id: number;

  praticaId: number;
  numeroPratica: string;
  oggettoPratica: string;
  dataScadenza: string | null;

  clienteId: number;
  clienteNome: string;
  clienteCognome: string;
  clienteCodiceFiscale: string;

  servizioId: number;
  servizioNome: string;

  etichetta: string;
  suggerimento: string | null;
  tipoObbligatorieta: TipoObbligatorietaDocumento;
  stato: StatoDocumentoPratica;

  creatoIl: string;
  aggiornatoIl: string;
};

export type RiepilogoDocumenti = {
  totale: number;
  mancanti: number;
  ricevuti: number;
  daVerificare: number;
  validati: number;
  rifiutati: number;
  nonApplicabili: number;
  completati: number;
  percentualeCompletamento: number;
};

export type RiepilogoDocumentiAdmin = {
  totale: number;
  mancanti: number;
  ricevuti: number;
  daVerificare: number;
  validati: number;
  rifiutati: number;
  nonApplicabili: number;
};

export type PaginaDocumentiAdmin = {
  content: DocumentoAdmin[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
};

export type ParametriDocumentiAdmin = {
  termine?: string;
  stato?: StatoDocumentoPratica;
  tipoObbligatorieta?: TipoObbligatorietaDocumento;
  page?: number;
  size?: number;
  sort?: string;
};