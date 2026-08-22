import api from "../../../services/api";

import type {
  AllegatoDocumento,
} from "../types/allegatiTypes";

export const allegatiService = {
  async trovaPerDocumento(
    documentoId: number,
  ): Promise<AllegatoDocumento[]> {
    const risposta =
      await api.get<AllegatoDocumento[]>(
        `/api/documenti-pratica/${documentoId}/allegati`,
      );

    return risposta.data;
  },

  async carica(
    documentoId: number,
    file: File,
  ): Promise<AllegatoDocumento> {
    const formData = new FormData();

    formData.append(
      "file",
      file,
    );

    const risposta =
      await api.post<AllegatoDocumento>(
        `/api/documenti-pratica/${documentoId}/allegati`,
        formData,
      );

    return risposta.data;
  },

  async scarica(
    allegato: AllegatoDocumento,
  ): Promise<void> {
    const risposta =
      await api.get<Blob>(
        `/api/allegati/${allegato.id}/download`,
        {
          responseType: "blob",
        },
      );

    const url =
      window.URL.createObjectURL(
        risposta.data,
      );

    const link =
      document.createElement("a");

    link.href = url;
    link.download =
      allegato.nomeOriginale;

    document.body.appendChild(
      link,
    );

    link.click();
    link.remove();

    window.URL.revokeObjectURL(
      url,
    );
  },

  async elimina(
    allegatoId: number,
  ): Promise<void> {
    await api.delete(
      `/api/allegati/${allegatoId}`,
    );
  },

  async trovaPerPratica(
  praticaId: number,
): Promise<AllegatoDocumento[]> {
  const risposta =
    await api.get<AllegatoDocumento[]>(
      `/api/pratiche/${praticaId}/allegati`,
    );

  return risposta.data;
},
};