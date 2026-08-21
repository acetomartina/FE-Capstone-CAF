export type MacroAreaResponse = {
  id: number;
  nome: string;
  slug: string;
  descrizioneBreve: string | null;
  chiaveIcona: string | null;
  chiaveColore: string | null;
  ordineVisualizzazione: number;
};

export type ServizioResponse = {
  id: number;
  macroAreaId: number;
  macroAreaNome: string;
  partnerId: number | null;

  nome: string;
  slug: string;

  descrizioneBreve: string | null;
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

export type UpdateServizioRequest = {
  nome?: string;
  descrizioneBreve?: string;
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