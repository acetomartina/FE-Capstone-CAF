/*
 * Casa unica dei tipi del dominio "servizi".
 *
 * Prima esistevano due definizioni parallele: questa e una copia sotto
 * src/types/servizio.ts usata dalle pagine di amministrazione. Erano gia'
 * divergenti — alla copia mancavano cosE e aCosaServe, che il backend
 * restituisce da tempo — quindi l'area amministrativa non poteva vedere
 * due campi che invece esistevano. Da qui in poi la forma e' una sola.
 *
 * Rispecchia ServizioResponse / MacroAreaResponse / DocumentoServizio-
 * Response del backend: se cambiano quelli, si cambia qui.
 */

export type MacroArea = {
  id: number;
  nome: string;
  slug: string;
  descrizioneBreve: string | null;
  chiaveIcona: string | null;
  chiaveColore: string | null;
  ordineVisualizzazione: number;
};

export type Servizio = {
  id: number;
  macroAreaId: number;
  macroAreaNome: string;
  partnerId: number | null;

  nome: string;
  slug: string;

  descrizioneBreve: string | null;

  cosE: string | null;
  aCosaServe: string | null;

  descrizione: string | null;
  destinatari: string | null;
  requisiti: string | null;
  comeFunziona: string | null;

  prezzo: number | null;
  prezzoTesto: string | null;
  notaPrezzo: string | null;

  durataMinuti: number | null;

  prenotabile: boolean;
  richiedibileOnline: boolean;
  inEvidenza: boolean;
  generaPratica: boolean;
  richiedeDocumenti: boolean;

  ordineVisualizzazione: number;

  attivo: boolean;
  validoFinoAl: string | null;
};

/* Tutti i campi facoltativi: la PATCH aggiorna solo cio' che riceve. */
export type AggiornaServizioRequest = {
  nome?: string;
  descrizioneBreve?: string;

  cosE?: string;
  aCosaServe?: string;

  descrizione?: string;
  destinatari?: string;
  requisiti?: string;
  comeFunziona?: string;

  prezzo?: number;
  prezzoTesto?: string;
  notaPrezzo?: string;

  durataMinuti?: number;

  prenotabile?: boolean;
  richiedibileOnline?: boolean;
  inEvidenza?: boolean;
  generaPratica?: boolean;
  richiedeDocumenti?: boolean;

  ordineVisualizzazione?: number;
  attivo?: boolean;

  validoFinoAl?: string;
};

export type TipoObbligatorietaDocumento =
  | "OBBLIGATORIO"
  | "CONDIZIONALE"
  | "FACOLTATIVO";

export type DocumentoServizio = {
  id: number;
  servizioId: number;
  etichetta: string;
  suggerimento: string | null;
  attivo: boolean;
  visibileAlCliente: boolean;
  tipoObbligatorieta: TipoObbligatorietaDocumento;
  ordineVisualizzazione: number;
};

export type CreaDocumentoServizioRequest = {
  etichetta: string;
  suggerimento?: string;
  tipoObbligatorieta: TipoObbligatorietaDocumento;
  visibileAlCliente?: boolean;
  ordineVisualizzazione: number;
};

export type AggiornaDocumentoServizioRequest = {
  etichetta?: string;
  suggerimento?: string;
  tipoObbligatorieta?: TipoObbligatorietaDocumento;
  attivo?: boolean;
  visibileAlCliente?: boolean;
  ordineVisualizzazione?: number;
};

export type RiordinaDocumentiServizioRequest = {
  documentoIds: number[];
};
