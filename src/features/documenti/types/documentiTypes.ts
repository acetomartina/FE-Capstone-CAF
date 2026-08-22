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