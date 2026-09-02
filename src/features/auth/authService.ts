import api from "../../services/api";

import type {
  RichiestaLogin,
  RichiestaRecuperoPassword,
  RichiestaAttivazioneAccount,
  RichiestaResetPassword,
  RispostaLogin,
  RispostaRecuperoPassword,
  RispostaUtenteCorrente,
  RispostaResetPassword,
  RispostaAttivazioneAccount,
} from "./authTypes";

export const authService = {
  async login(
    email: string,
    password: string,
  ): Promise<RispostaLogin> {
    const corpo: RichiestaLogin = { email, password };

    const risposta = await api.post<RispostaLogin>(
      "/api/auth/login",
      corpo,
    );

    return risposta.data;
  },

  /* Il token viaggia da solo: lo aggiunge l'interceptor in api.ts. */
  async me(): Promise<RispostaUtenteCorrente> {
    const risposta =
      await api.get<RispostaUtenteCorrente>("/api/auth/me");

    return risposta.data;
  },

  async richiediRecuperoPassword(
    email: string,
  ): Promise<RispostaRecuperoPassword> {
    const corpo: RichiestaRecuperoPassword = { email };

    const risposta = await api.post<RispostaRecuperoPassword>(
      "/api/auth/recupera-password",
      corpo,
    );

    return risposta.data;
  },

  async resetPassword(
    token: string,
    nuovaPassword: string,
  ): Promise<RispostaResetPassword> {
    const corpo: RichiestaResetPassword = { token, nuovaPassword };

    const risposta = await api.post<RispostaResetPassword>(
      "/api/auth/reset-password",
      corpo,
    );

    return risposta.data;
  },

  /* Primo accesso di un cliente creato dalla sede: il token arriva dal
     link nella mail di invito e vale una volta sola. */
  async attivaAccount(
    token: string,
    nuovaPassword: string,
  ): Promise<RispostaAttivazioneAccount> {
    const corpo: RichiestaAttivazioneAccount = { token, nuovaPassword };

    const risposta = await api.post<RispostaAttivazioneAccount>(
      "/api/auth/attiva-account",
      corpo,
    );

    return risposta.data;
  },
};
