export type Ruolo = 
| "SUPER ADMIN"
| "ADMIN"
| "USER"
| "CLIENTE";

export interface UtenteAutenticato {
    id: number;
    nome: string;
    cognome: string;
    email: string;
    ruolo: Ruolp;
}

export interface AuthState {
    utente: UtenteAutenticato | null;
    token: string | null;
    autenticato: boolean;
    caricamento: boolean;
    errore: string | null;
}