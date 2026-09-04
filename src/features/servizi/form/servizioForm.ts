import type {
  DocumentoServizio,
  Servizio,
  TipoObbligatorietaDocumento,
} from "../types/serviziTypes";

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
