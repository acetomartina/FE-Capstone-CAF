const CHIAVE_TOKEN = "caf_fapi_token";

export const tokenService = {
  salvaToken(token: string): void {
    localStorage.setItem(CHIAVE_TOKEN, token);
  },

  recuperaToken(): string | null {
    return localStorage.getItem(CHIAVE_TOKEN);
  },

  rimuoviToken(): void {
    localStorage.removeItem(CHIAVE_TOKEN);
  },
};