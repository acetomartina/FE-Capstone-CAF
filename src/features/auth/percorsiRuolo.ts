import type { Ruolo } from "./authTypes";

/**
 * Punto d'ingresso unico:
 * smista verso l'area corretta
 * in base al ruolo autenticato.
 */
export const PERCORSO_AREA_RISERVATA =
  "/area-riservata";

/*
 * ADMIN e SUPER_ADMIN entrano direttamente
 * nella Dashboard operativa.
 *
 * La pagina /amministrazione resta disponibile
 * come area secondaria per utenti,
 * configurazioni e gestione della sede.
 *
 * USER mantiene la propria area dipendente.
 * CLIENTE mantiene la propria area cliente.
 */
const PERCORSI: Record<Ruolo, string> = {
  SUPER_ADMIN: "/dashboard",
  ADMIN: "/dashboard",
  USER: "/dipendente",
  CLIENTE: "/cliente",
};

export const percorsoPerRuolo = (
  ruolo: Ruolo,
): string => PERCORSI[ruolo];

/**
 * Ruoli ammessi nelle varie aree.
 */
export const RUOLI_AMMINISTRAZIONE: Ruolo[] = [
  "ADMIN",
  "SUPER_ADMIN",
];

export const RUOLI_DIPENDENTE: Ruolo[] = [
  "USER",
];

export const RUOLI_CLIENTE: Ruolo[] = [
  "CLIENTE",
];