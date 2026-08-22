export type MacroArea = {
  id: number;

  nome: string;

  slug: string;

  descrizioneBreve: string | null;

  chiaveIcona: string | null;

  chiaveColore: string | null;

  ordineVisualizzazione: number;
};

export type ServizioCatalogo = {
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