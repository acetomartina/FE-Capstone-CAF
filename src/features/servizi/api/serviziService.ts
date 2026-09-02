import api from "../../../services/api";

import type {
  AggiornaDocumentoServizioRequest,
  AggiornaServizioRequest,
  CreaDocumentoServizioRequest,
  DocumentoServizio,
  MacroArea,
  RiordinaDocumentiServizioRequest,
  Servizio,
} from "../types/serviziTypes";

/*
 * Catalogo servizi lato area riservata.
 *
 * Le stesse risorse hanno anche una versione pubblica, in
 * serviziPublicService: la differenza non e' cosmetica, li' sotto
 * /api/public passa solo cio' che puo' vedere chi non ha fatto accesso.
 *
 * Questo modulo raccoglie anche la gestione della checklist documentale
 * di ogni servizio, che prima viveva in un service separato pur
 * insistendo sugli stessi endpoint.
 */
export const serviziService = {

  // ---------------------------------------------------------------
  // Catalogo
  // ---------------------------------------------------------------

  async trovaMacroAree(): Promise<MacroArea[]> {
    const risposta =
      await api.get<MacroArea[]>("/api/macro-aree");

    return risposta.data;
  },

  async trovaServiziAttivi(): Promise<Servizio[]> {
    const risposta =
      await api.get<Servizio[]>("/api/servizi");

    return risposta.data;
  },

  async trovaServiziPerMacroArea(
    macroAreaId: number,
  ): Promise<Servizio[]> {
    const risposta = await api.get<Servizio[]>(
      `/api/macro-aree/${macroAreaId}/servizi`,
    );

    return risposta.data;
  },

  async trovaServizioPerId(
    id: number,
  ): Promise<Servizio> {
    const risposta = await api.get<Servizio>(
      `/api/servizi/${id}`,
    );

    return risposta.data;
  },

  async aggiornaServizio(
    id: number,
    richiesta: AggiornaServizioRequest,
  ): Promise<Servizio> {
    const risposta = await api.patch<Servizio>(
      `/api/servizi/${id}`,
      richiesta,
    );

    return risposta.data;
  },

  // ---------------------------------------------------------------
  // Checklist documentale del servizio
  // ---------------------------------------------------------------

  async trovaDocumentiPerServizio(
    servizioId: number,
  ): Promise<DocumentoServizio[]> {
    const risposta = await api.get<DocumentoServizio[]>(
      `/api/servizi/${servizioId}/documenti`,
    );

    return risposta.data;
  },

  async creaDocumento(
    servizioId: number,
    richiesta: CreaDocumentoServizioRequest,
  ): Promise<DocumentoServizio> {
    const risposta = await api.post<DocumentoServizio>(
      `/api/servizi/${servizioId}/documenti`,
      richiesta,
    );

    return risposta.data;
  },

  async aggiornaDocumento(
    documentoId: number,
    richiesta: AggiornaDocumentoServizioRequest,
  ): Promise<DocumentoServizio> {
    const risposta = await api.patch<DocumentoServizio>(
      `/api/documenti-servizio/${documentoId}`,
      richiesta,
    );

    return risposta.data;
  },

  /* Il backend disattiva, non cancella: un documento gia' richiesto in
     una pratica deve restare leggibile nello storico. */
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
  ): Promise<DocumentoServizio[]> {
    const richiesta: RiordinaDocumentiServizioRequest = {
      documentoIds,
    };

    const risposta = await api.put<DocumentoServizio[]>(
      `/api/servizi/${servizioId}/documenti/ordine`,
      richiesta,
    );

    return risposta.data;
  },
};
