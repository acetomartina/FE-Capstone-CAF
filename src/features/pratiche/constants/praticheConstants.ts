import type {
  PrioritaPratica,
  StatoPratica,
} from "../types/praticheTypes";

export const ETICHETTE_STATO_PRATICA: Record<
  StatoPratica,
  string
> = {
  BOZZA: "Bozza",
  DA_AVVIARE: "Da avviare",
  IN_LAVORAZIONE: "In lavorazione",
  IN_ATTESA_DOCUMENTI: "In attesa documenti",
  IN_ATTESA_CLIENTE: "In attesa cliente",
  IN_ATTESA_ENTE: "In attesa ente",
  COMPLETATA: "Completata",
  ANNULLATA: "Annullata",
};

export const ETICHETTE_PRIORITA_PRATICA: Record<
  PrioritaPratica,
  string
> = {
  BASSA: "Bassa",
  NORMALE: "Normale",
  ALTA: "Alta",
  URGENTE: "Urgente",
};