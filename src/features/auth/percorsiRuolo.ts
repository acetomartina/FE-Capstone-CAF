import type { Ruolo } from "./authTypes";

export const PERCORSO_AREA_RISERVATA =
  "/area-riservata";

/* AREA CLIENTE SOSPESA.
   La chiave CLIENTE non si puo' togliere: Record<Ruolo, string> le
   pretende tutte. Punta al sito pubblico, cosi' un cliente che riuscisse
   comunque ad autenticarsi non finisce su una rotta inesistente.
   Per riattivare: rimettere "/cliente". */
const PERCORSI: Record<Ruolo, string> = {
  SUPER_ADMIN: "/dashboard",
  ADMIN: "/dashboard",
  USER: "/dipendente",
  CLIENTE: "/",
};

export const percorsoPerRuolo = (
  ruolo: Ruolo,
): string => PERCORSI[ruolo];

export const RUOLI_AMMINISTRAZIONE: Ruolo[] = [
  "ADMIN",
  "SUPER_ADMIN",
];

export const RUOLI_DIPENDENTE: Ruolo[] = [
  "USER",
];

/* AREA CLIENTE SOSPESA.
export const RUOLI_CLIENTE: Ruolo[] = [
  "CLIENTE",
];
*/