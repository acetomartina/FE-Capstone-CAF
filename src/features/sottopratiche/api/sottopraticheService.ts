import api from "../../../services/api";

import type {
  RispostaPaginataSottopratiche,
} from "../types/sottopraticheTypes";

export const sottopraticheService = {
  async trovaPerPratica(
    praticaId: number,
  ): Promise<RispostaPaginataSottopratiche> {
    const risposta =
      await api.get<RispostaPaginataSottopratiche>(
        `/api/pratiche/${praticaId}/sottopratiche?page=0&size=50&sort=creatoIl,desc`,
      );

    return risposta.data;
  },
};
