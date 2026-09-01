export type TipologiaAppuntamento =
  | "APPUNTAMENTO_CAF"
  | "CONSEGNA_DOCUMENTI"
  | "CONSULENZA"
  | "TELEFONATA"
  | "ALTRO";

export type ModalitaAppuntamento =
  | "IN_SEDE"
  | "TELEFONICO"
  | "ONLINE";

export type StatoAppuntamento =
  | "PROGRAMMATO"
  | "CONFERMATO"
  | "COMPLETATO"
  | "ANNULLATO";

export type Appuntamento = {
  id: number;

  clienteId: number;
  clienteNome: string;
  clienteCognome: string;
  clienteCodiceFiscale: string;

  praticaId: number | null;
  numeroPratica: string | null;
  oggettoPratica: string | null;

  servizioId: number | null;
  servizioNome: string | null;

  responsabileId: number | null;
  responsabileNome: string | null;
  responsabileCognome: string | null;

  titolo: string;
  descrizione: string | null;

  tipologia: TipologiaAppuntamento;
  modalita: ModalitaAppuntamento;
  stato: StatoAppuntamento;

  inizio: string;
  fine: string;

  luogo: string | null;
  linkOnline: string | null;
  note: string | null;
  motivoAnnullamento: string | null;

  creatoIl: string;
  aggiornatoIl: string;
};

export type CreaAppuntamentoRequest = {
  clienteId: number;
  praticaId?: number | null;
  responsabileId?: number | null;

  titolo: string;
  descrizione?: string | null;

  tipologia: TipologiaAppuntamento;
  modalita: ModalitaAppuntamento;

  inizio: string;
  fine: string;

  luogo?: string | null;
  linkOnline?: string | null;
  note?: string | null;
};

export type AggiornaAppuntamentoRequest =
  CreaAppuntamentoRequest;

export type CambiaStatoAppuntamentoRequest = {
  stato: StatoAppuntamento;
  motivoAnnullamento?: string | null;
};

export type ParametriRicercaAppuntamenti = {
  dal?: string;
  al?: string;
  clienteId?: number;
  responsabileId?: number;
  stato?: StatoAppuntamento;
};