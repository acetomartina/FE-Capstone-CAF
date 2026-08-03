/* Ricalca @Size + @Pattern di CreaUtenteRequest lato backend: il reset
   imposta una password ex novo, quindi vale il vincolo della creazione
   utente, non quello più largo del login. Se il backend cambia le regole,
   qui è l'unico punto da aggiornare. */

export const LUNGHEZZA_MINIMA_PASSWORD = 8;
export const LUNGHEZZA_MASSIMA_PASSWORD = 72;

const COMPLESSITA =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

export interface EsitoValidazione {
  valida: boolean;
  errore: string | null;
}

const ESITO_VALIDO: EsitoValidazione = { valida: true, errore: null };

const nonValida = (errore: string): EsitoValidazione => ({
  valida: false,
  errore,
});

/* Restituisce il primo errore utile: mostrarne uno alla volta evita di
   sommergere l'utente con quattro righe rosse tutte insieme. */
export const validaNuovaPassword = (
  password: string,
  conferma: string,
): EsitoValidazione => {
  if (password.length < LUNGHEZZA_MINIMA_PASSWORD) {
    return nonValida(
      `La password deve contenere almeno ${LUNGHEZZA_MINIMA_PASSWORD} caratteri.`,
    );
  }

  if (password.length > LUNGHEZZA_MASSIMA_PASSWORD) {
    return nonValida(
      `La password non può superare i ${LUNGHEZZA_MASSIMA_PASSWORD} caratteri.`,
    );
  }

  if (!COMPLESSITA.test(password)) {
    return nonValida(
      "La password deve contenere almeno una maiuscola, una minuscola, un numero e un carattere speciale.",
    );
  }

  if (password !== conferma) {
    return nonValida("Le due password non coincidono.");
  }

  return ESITO_VALIDO;
};
