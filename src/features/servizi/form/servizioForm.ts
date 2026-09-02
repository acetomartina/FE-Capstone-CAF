import type {
  DocumentoServizio,
  Servizio,
  TipoObbligatorietaDocumento,
} from "../types/serviziTypes";

/*
 * Forma dei dati mentre stanno dentro un form, che non coincide con la
 * forma del dominio: un <input> lavora sempre su stringhe, anche quando
 * il campo è un numero o una data. La conversione avviene ai due bordi —
 * creaFormDaServizio entrando, la normalizzazione uscendo — così il resto
 * del codice non deve mai chiedersi se sta guardando "12" o 12.
 */

export type FormServizio = {
  nome: string;
  descrizioneBreve: string;
  descrizione: string;
  destinatari: string;
  requisiti: string;
  comeFunziona: string;

  prezzo: string;
  prezzoTesto: string;
  notaPrezzo: string;

  durataMinuti: string;

  prenotabile: boolean;
  richiedibileOnline: boolean;
  inEvidenza: boolean;
  generaPratica: boolean;
  richiedeDocumenti: boolean;
  attivo: boolean;

  ordineVisualizzazione: string;
  validoFinoAl: string;
};

export type FormDocumento = {
  etichetta: string;
  suggerimento: string;

  tipoObbligatorieta: TipoObbligatorietaDocumento;

  visibileAlCliente: boolean;

  ordineVisualizzazione: number;
};

export const TIPI_OBBLIGATORIETA: {
  value: TipoObbligatorietaDocumento;
  label: string;
}[] = [
  {
    value: "OBBLIGATORIO",
    label: "Obbligatorio",
  },
  {
    value: "CONDIZIONALE",
    label: "Condizionale",
  },
  {
    value: "FACOLTATIVO",
    label: "Facoltativo",
  },
];

/* I null del backend diventano stringhe vuote: React considera
   "controllato" solo un input il cui value non sia mai null. */
export const creaFormDaServizio = (
  servizio: Servizio,
): FormServizio => ({
  nome: servizio.nome ?? "",

  descrizioneBreve:
    servizio.descrizioneBreve ?? "",

  descrizione:
    servizio.descrizione ?? "",

  destinatari:
    servizio.destinatari ?? "",

  requisiti:
    servizio.requisiti ?? "",

  comeFunziona:
    servizio.comeFunziona ?? "",

  prezzo:
    servizio.prezzo !== null
      ? String(servizio.prezzo)
      : "",

  prezzoTesto:
    servizio.prezzoTesto ?? "",

  notaPrezzo:
    servizio.notaPrezzo ?? "",

  durataMinuti:
    servizio.durataMinuti !== null
      ? String(servizio.durataMinuti)
      : "",

  prenotabile:
    servizio.prenotabile,

  richiedibileOnline:
    servizio.richiedibileOnline,

  inEvidenza:
    servizio.inEvidenza,

  generaPratica:
    servizio.generaPratica,

  richiedeDocumenti:
    servizio.richiedeDocumenti,

  attivo:
    servizio.attivo,

  ordineVisualizzazione:
    String(
      servizio.ordineVisualizzazione,
    ),

  validoFinoAl:
    servizio.validoFinoAl ?? "",
});

export const creaFormDocumento = (
  documento: DocumentoServizio,
): FormDocumento => ({
  etichetta:
    documento.etichetta,

  suggerimento:
    documento.suggerimento ?? "",

  tipoObbligatorieta:
    documento.tipoObbligatorieta,

  visibileAlCliente:
    documento.visibileAlCliente,

  ordineVisualizzazione:
    documento.ordineVisualizzazione,
});
