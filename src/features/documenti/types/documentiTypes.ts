import type {
  UtentePratica,
} from "../../pratiche/types/praticheTypes";

export type StatoDocumentoPratica =
  | "MANCANTE"
  | "RICEVUTO"
  | "DA_VERIFICARE"
  | "VALIDATO"
  | "RIFIUTATO";

export type DocumentoPratica = {
  id: number;
  praticaId: number;
  numeroPratica: string;
  etichetta: string;
  suggerimento: string | null;
  obbligatorio: boolean;
  stato: StatoDocumentoPratica;
  richiestoDa: UtentePratica | null;
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
  completati: number;
  percentualeCompletamento: number;
};