export type Ruolo =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "USER"
  | "CLIENTE";

export interface UtenteAutenticato {
  id: number;
  nome: string;
  cognome: string;
  email: string;
  ruolo: Ruolo;
}

export interface AuthState {
  utente: UtenteAutenticato | null;
  token: string | null;
  autenticato: boolean;
  caricamento: boolean;
  errore: string | null;
}

export type StatoOperazione =
  | "inattivo"
  | "invio"
  | "completato"
  | "errore";

export interface RichiestaRecuperoPassword {
  email: string;
}

/* Il backend risponde sempre 200, esista o no la mail: questo messaggio
   non va mostrato all'utente, il testo generico è fissato lato frontend. */
export interface RispostaRecuperoPassword {
  messaggio?: string;
}

export interface RichiestaResetPassword {
  token: string;
  nuovaPassword: string;
}

export interface RispostaResetPassword {
  messaggio?: string;
}