import type { Ruolo } from "./authTypes";

/** Punto d'ingresso unico: smista verso l'area del ruolo. */
export const PERCORSO_AREA_RISERVATA = "/area-riservata";

/*
 * ADMIN e SUPER_ADMIN condividono l'area: nel backend li separa un solo
 * permesso, il cambio ruolo. Le funzioni riservate al super admin si
 * mostrano dentro l'area, invece di duplicarla.
 *
 * Il tipo Record<Ruolo, string> e' voluto: aggiungere un ruolo all'enum
 * senza dargli un percorso non compila.
 */
const PERCORSI: Record<Ruolo, string> = {
  SUPER_ADMIN: "/amministrazione",
  ADMIN: "/amministrazione",
  USER: "/dipendente",
  CLIENTE: "/cliente",
};

export const percorsoPerRuolo = (ruolo: Ruolo): string => PERCORSI[ruolo];

/** Ruoli ammessi in ciascuna area, per la guardia sulle rotte. */
export const RUOLI_AMMINISTRAZIONE: Ruolo[] = ["ADMIN", "SUPER_ADMIN"];

export const RUOLI_DIPENDENTE: Ruolo[] = ["USER"];

export const RUOLI_CLIENTE: Ruolo[] = ["CLIENTE"];
