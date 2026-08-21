import api from "./api";

import type {
  MacroAreaResponse,
  ServizioResponse,
  UpdateServizioRequest,
} from "../types/servizio";

export const servizioService = {
  async trovaMacroAreeAttive(): Promise<MacroAreaResponse[]> {
    const response =
      await api.get<MacroAreaResponse[]>("/api/macro-aree");

    return response.data;
  },

  async trovaServiziAttivi(): Promise<ServizioResponse[]> {
    const response =
      await api.get<ServizioResponse[]>("/api/servizi");

    return response.data;
  },

  async trovaServiziPerMacroArea(
    macroAreaId: number,
  ): Promise<ServizioResponse[]> {
    const response = await api.get<ServizioResponse[]>(
      `/api/macro-aree/${macroAreaId}/servizi`,
    );

    return response.data;
  },

  async trovaServizioPerId(
    id: number,
  ): Promise<ServizioResponse> {
    const response = await api.get<ServizioResponse>(
      `/api/servizi/${id}`,
    );

    return response.data;
  },

  async aggiornaServizio(
    id: number,
    request: UpdateServizioRequest,
  ): Promise<ServizioResponse> {
    const response = await api.patch<ServizioResponse>(
      `/api/servizi/${id}`,
      request,
    );

    return response.data;
  },
};