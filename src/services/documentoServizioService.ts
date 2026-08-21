import api from "./api";

import type {
  CreateDocumentoServizioRequest,
  DocumentoServizioResponse,
  RiordinaDocumentiServizioRequest,
  UpdateDocumentoServizioRequest,
} from "../types/documentoServizio";

export const documentoServizioService = {
  async trovaDocumentiPerServizio(
    servizioId: number,
  ): Promise<DocumentoServizioResponse[]> {
    const response = await api.get<DocumentoServizioResponse[]>(
      `/api/servizi/${servizioId}/documenti`,
    );

    return response.data;
  },

  async creaDocumento(
    servizioId: number,
    request: CreateDocumentoServizioRequest,
  ): Promise<DocumentoServizioResponse> {
    const response = await api.post<DocumentoServizioResponse>(
      `/api/servizi/${servizioId}/documenti`,
      request,
    );

    return response.data;
  },

  async aggiornaDocumento(
    documentoId: number,
    request: UpdateDocumentoServizioRequest,
  ): Promise<DocumentoServizioResponse> {
    const response = await api.patch<DocumentoServizioResponse>(
      `/api/documenti-servizio/${documentoId}`,
      request,
    );

    return response.data;
  },

  async disattivaDocumento(
    documentoId: number,
  ): Promise<void> {
    await api.delete(
      `/api/documenti-servizio/${documentoId}`,
    );
  },

  async riordinaDocumenti(
    servizioId: number,
    documentoIds: number[],
  ): Promise<DocumentoServizioResponse[]> {
    const request: RiordinaDocumentiServizioRequest = {
      documentoIds,
    };

    const response = await api.put<DocumentoServizioResponse[]>(
      `/api/servizi/${servizioId}/documenti/ordine`,
      request,
    );

    return response.data;
  },
};