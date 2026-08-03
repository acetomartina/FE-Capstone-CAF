/* USER e' il dipendente del CAF: "utente" nel senso di membro dello staff,
   non di persona che usa il sito. I clienti hanno il ruolo CLIENTE. */
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
  attivo: boolean;
  urlImmagineProfilo: string | null;
}

export interface RichiestaLogin {
  email: string;
  password: string;
}

/* Ricalca LoginResponse del backend. `expiresAt` arriva come stringa ISO,
   non come Date: la conversione, se servira', si fa dove si usa. */
export interface RispostaLogin {
  accessToken: string;
  tokenType: string;
  expiresAt: string;
  id: number;
  nome: string;
  cognome: string;
  email: string;
  ruolo: Ruolo;
  attivo: boolean;
  urlImmagineProfilo: string | null;
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