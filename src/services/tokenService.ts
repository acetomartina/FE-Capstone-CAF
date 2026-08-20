const CHIAVE_TOKEN = "caf_fapi_token";
const CHIAVE_EMAIL_RICORDATA =
  "caf_fapi_email_ricordata";

export const tokenService = {
  salvaToken(
    token: string,
    ricordami: boolean = true,
  ): void {
    /*
     * Evitiamo che lo stesso token possa
     * rimanere contemporaneamente nei due storage.
     */
    localStorage.removeItem(CHIAVE_TOKEN);
    sessionStorage.removeItem(CHIAVE_TOKEN);

    if (ricordami) {
      localStorage.setItem(
        CHIAVE_TOKEN,
        token,
      );

      return;
    }

    sessionStorage.setItem(
      CHIAVE_TOKEN,
      token,
    );
  },

  recuperaToken(): string | null {
    /*
     * Una sessione persistente ha priorità.
     * Se non esiste, controlliamo quella
     * valida soltanto per la sessione corrente.
     */
    return (
      localStorage.getItem(CHIAVE_TOKEN) ??
      sessionStorage.getItem(CHIAVE_TOKEN)
    );
  },

  rimuoviToken(): void {
    localStorage.removeItem(CHIAVE_TOKEN);
    sessionStorage.removeItem(CHIAVE_TOKEN);
  },

  salvaEmailRicordata(
    email: string,
  ): void {
    localStorage.setItem(
      CHIAVE_EMAIL_RICORDATA,
      email,
    );
  },

  recuperaEmailRicordata():
    | string
    | null {
    return localStorage.getItem(
      CHIAVE_EMAIL_RICORDATA,
    );
  },

  rimuoviEmailRicordata(): void {
    localStorage.removeItem(
      CHIAVE_EMAIL_RICORDATA,
    );
  },

  haSessionePersistente(): boolean {
    return Boolean(
      localStorage.getItem(CHIAVE_TOKEN),
    );
  },
};