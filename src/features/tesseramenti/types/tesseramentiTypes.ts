export type StatoTesseramento =
  | "VALIDA"
  | "IN_SCADENZA"
  | "SCADUTA"
  | "ANNULLATA";

export interface Tesseramento {
  id: number;
  clienteId: number;
  dataTesseramento: string;
  dataScadenza: string;
  quota: number;
  note: string | null;
  annullato: boolean;
  stato: StatoTesseramento;
  creatoIl: string;
  aggiornatoIl: string;
}

export interface CreaTesseramentoRequest {
  dataTesseramento: string;
  note: string | null;
}