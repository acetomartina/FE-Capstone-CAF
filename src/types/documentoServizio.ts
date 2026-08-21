export type TipoObbligatorietaDocumento =
  | "OBBLIGATORIO"
  | "CONDIZIONALE"
  | "FACOLTATIVO";

export type DocumentoServizioResponse = {
  id: number;
  servizioId: number;

  etichetta: string;
  suggerimento: string | null;

  attivo: boolean;
  visibileAlCliente: boolean;

  tipoObbligatorieta: TipoObbligatorietaDocumento;

  ordineVisualizzazione: number;
};

export type CreateDocumentoServizioRequest = {
  etichetta: string;
  suggerimento?: string;

  tipoObbligatorieta: TipoObbligatorietaDocumento;

  visibileAlCliente?: boolean;

  ordineVisualizzazione: number;
};

export type UpdateDocumentoServizioRequest = {
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