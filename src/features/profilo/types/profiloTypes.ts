import type {
  Ruolo,
} from "../../auth/authTypes";

export type ProfiloUtente = {
  id: number;
  nome: string;
  cognome: string;
  codiceFiscale: string;
  dataNascita: string | null;
  luogoNascita: string | null;
  email: string;
  telefono: string | null;
  indirizzo: string | null;
  comune: string | null;
  provincia: string | null;
  cap: string | null;
  ruolo: Ruolo;
  attivo: boolean;
  emailVerificata: boolean;
  mansione: string | null;
  numeroMatricola: string | null;
  urlImmagineProfilo: string | null;
  ultimoAccesso: string | null;
  creatoIl: string;
  aggiornatoIl: string;
};

export type AggiornaProfiloRequest = {
  nome: string;
  cognome: string;
  dataNascita: string | null;
  luogoNascita: string | null;
  telefono: string | null;
  indirizzo: string | null;
  comune: string | null;
  provincia: string | null;
  cap: string | null;
  mansione: string | null;
  urlImmagineProfilo: string | null;
};

export type CambiaPasswordProfiloRequest = {
  passwordAttuale: string;
  nuovaPassword: string;
};

export type MessaggioProfiloResponse = {
  messaggio: string;
};