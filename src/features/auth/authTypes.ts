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

  sessioneVerificata: boolean;
}

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

export interface RichiestaAttivazioneAccount {
  token: string;
  nuovaPassword: string;
}

export interface RispostaAttivazioneAccount {
  messaggio?: string;
}