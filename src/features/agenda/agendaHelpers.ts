import type { Pratica } from "../pratiche/types/praticheTypes";
import type { StatoAppuntamento } from "../appuntamenti/types/appuntamentiTypes";

export type VistaAgenda =
  | "SCADENZE"
  | "APPUNTAMENTI";

export type FiltroPeriodo =
  | "TUTTE"
  | "SCADUTE"
  | "OGGI"
  | "SETTE_GIORNI"
  | "TRENTA_GIORNI";

export type FiltroAppuntamenti =
  | "TUTTI"
  | "OGGI"
  | "SETTE_GIORNI"
  | "CONFERMATI"
  | "COMPLETATI";

export const MILLISECONDI_GIORNO =
  1000 * 60 * 60 * 24;

export const ETICHETTE_STATO_APPUNTAMENTO:
Record<StatoAppuntamento, string> = {
  PROGRAMMATO: "Programmato",
  CONFERMATO: "Confermato",
  COMPLETATO: "Completato",
  ANNULLATO: "Annullato",
};

export const STATI_APPUNTAMENTO:
StatoAppuntamento[] = [
  "PROGRAMMATO",
  "CONFERMATO",
  "COMPLETATO",
  "ANNULLATO",
];

export const normalizzaData = (
  data: Date,
): Date =>
  new Date(
    data.getFullYear(),
    data.getMonth(),
    data.getDate(),
  );

export const creaDataLocale = (
  valore: string,
): Date => {
  const [
    anno,
    mese,
    giorno,
  ] = valore.split("-").map(Number);

  return new Date(
    anno,
    mese - 1,
    giorno,
  );
};

export const distanzaTraDate = (
  data: Date,
): number => {
  const oggi =
    normalizzaData(new Date());

  const destinazione =
    normalizzaData(data);

  return Math.round(
    (
      destinazione.getTime() -
      oggi.getTime()
    ) / MILLISECONDI_GIORNO,
  );
};

export const distanzaInGiorni = (
  dataScadenza: string,
): number =>
  distanzaTraDate(
    creaDataLocale(dataScadenza),
  );

export const formattaDataScadenza = (
  valore: string,
): string =>
  new Intl.DateTimeFormat(
    "it-IT",
    {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(
    creaDataLocale(valore),
  );

export const formattaDataAppuntamento = (
  valore: string,
): string =>
  new Intl.DateTimeFormat(
    "it-IT",
    {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(
    new Date(valore),
  );

export const formattaOra = (
  valore: string,
): string =>
  new Intl.DateTimeFormat(
    "it-IT",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(
    new Date(valore),
  );

export const descrizioneScadenza = (
  dataScadenza: string,
): string => {
  const distanza =
    distanzaInGiorni(dataScadenza);

  if (distanza < 0) {
    const giorni = Math.abs(distanza);

    return giorni === 1
      ? "Scaduta ieri"
      : `Scaduta da ${giorni} giorni`;
  }

  if (distanza === 0) {
    return "Scade oggi";
  }

  if (distanza === 1) {
    return "Scade domani";
  }

  return `Tra ${distanza} giorni`;
};

export const classeScadenza = (
  dataScadenza: string,
): string => {
  const distanza =
    distanzaInGiorni(dataScadenza);

  if (distanza < 0) {
    return "overdue";
  }

  if (distanza === 0) {
    return "today";
  }

  if (distanza <= 7) {
    return "soon";
  }

  return "future";
};

export const praticaAperta = (
  pratica: Pratica,
): boolean =>
  pratica.stato !== "COMPLETATA" &&
  pratica.stato !== "ANNULLATA";
