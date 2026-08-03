import api from "../../services/api";

import type {
  RichiestaRecuperoPassword,
  RichiestaResetPassword,
  RispostaRecuperoPassword,
  RispostaResetPassword,
} from "./authTypes";

export const authService = {
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
};
