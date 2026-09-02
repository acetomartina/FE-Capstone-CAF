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

  /*
   * All'avvio non sappiamo ancora se il token salvato sia valido: finche'
   * resta false, "non autenticato" significa "non lo so ancora" e nessuno
   * deve prendere decisioni. Senza questo terzo stato la guardia
   * rimanderebbe al login anche chi ha una sessione buona.
   */
  sessioneVerificata: boolean;
}

/* Risposta di GET /api/auth/me. L'endpoint restituisce l'utente completo:
   qui dichiariamo solo i campi che il frontend usa davvero. */
export interface RispostaUtenteCorrente {
  id: number;
  nome: string;
  cognome: string;
  email: string;
  ruolo: Ruolo;
  attivo: boolean;
  urlImmagineProfilo: string | null;
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

/* L'attivazione account condivide il contratto del reset: token piu'
   nuova password. Restano due tipi distinti perche' sono due endpoint
   diversi, e nulla garantisce che restino identici per sempre. */
export interface RichiestaAttivazioneAccount {
  token: string;
  nuovaPassword: string;
}

export interface RispostaAttivazioneAccount {
  messaggio?: string;
}