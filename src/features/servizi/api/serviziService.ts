import api from "../../../services/api";

import type {
  MacroArea,
  ServizioCatalogo,
} from "../types/serviziTypes";

export const serviziService = {
  async trovaMacroAree(): Promise<MacroArea[]> {
    const risposta =
      await api.get<MacroArea[]>(
        "/api/macro-aree",
      );

    return risposta.data;
  },

  async trovaServiziPerMacroArea(
    macroAreaId: number,
  ): Promise<ServizioCatalogo[]> {
    const risposta =
      await api.get<ServizioCatalogo[]>(
        `/api/macro-aree/${macroAreaId}/servizi`,
      );

    return risposta.data;
  },
};