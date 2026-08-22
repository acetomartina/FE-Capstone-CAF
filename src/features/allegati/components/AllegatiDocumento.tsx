import {
  useRef,
  useState,
} from "react";

import {
  Alert,
  Button,
  Spinner,
} from "react-bootstrap";

import {
  FiDownload,
  FiFileText,
  FiPlus,
  FiTrash2,
  FiUploadCloud,
} from "react-icons/fi";

import {
  allegatiService,
} from "../api/allegatiService";

import type {
  AllegatoDocumento,
} from "../types/allegatiTypes";

type AllegatiDocumentoProps = {
  documentoId: number;
  allegati: AllegatoDocumento[];
  onModifica?: () => void | Promise<void>;
};

const formattaDimensione = (
  bytes: number,
): string => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const kb = bytes / 1024;

  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`;
  }

  const mb = kb / 1024;

  return `${mb.toFixed(1)} MB`;
};

const formattaDataOra = (
  valore: string,
): string => {
  return new Intl.DateTimeFormat(
    "it-IT",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(
    new Date(valore),
  );
};

export default function AllegatiDocumento({
  documentoId,
  allegati,
  onModifica,
}: AllegatiDocumentoProps) {
  const inputRef =
    useRef<HTMLInputElement | null>(
      null,
    );

  const [
    uploadInCorso,
    setUploadInCorso,
  ] = useState(false);

  const [
    downloadId,
    setDownloadId,
  ] = useState<number | null>(
    null,
  );

  const [
    eliminazioneId,
    setEliminazioneId,
  ] = useState<number | null>(
    null,
  );

  const [
    errore,
    setErrore,
  ] = useState<string | null>(
    null,
  );

  const apriSelettoreFile =
    () => {
      inputRef.current?.click();
    };

  const caricaFile =
    async (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const file =
        event.target.files?.[0];

      if (!file) {
        return;
      }

      try {
        setUploadInCorso(true);
        setErrore(null);

        await allegatiService.carica(
          documentoId,
          file,
        );

        await onModifica?.();
      } catch {
        setErrore(
          "Non è stato possibile caricare il documento.",
        );
      } finally {
        setUploadInCorso(false);

        event.target.value = "";
      }
    };

  const scarica =
    async (
      allegato: AllegatoDocumento,
    ) => {
      try {
        setDownloadId(
          allegato.id,
        );

        setErrore(null);

        await allegatiService.scarica(
          allegato,
        );
      } catch {
        setErrore(
          "Non è stato possibile scaricare il documento.",
        );
      } finally {
        setDownloadId(
          null,
        );
      }
    };

  const elimina =
    async (
      allegato: AllegatoDocumento,
    ) => {
      const confermato =
        window.confirm(
          `Eliminare "${allegato.nomeOriginale}"?`,
        );

      if (!confermato) {
        return;
      }

      try {
        setEliminazioneId(
          allegato.id,
        );

        setErrore(null);

        await allegatiService.elimina(
          allegato.id,
        );

        await onModifica?.();
      } catch {
        setErrore(
          "Non è stato possibile eliminare il documento.",
        );
      } finally {
        setEliminazioneId(
          null,
        );
      }
    };

  return (
    <div className="allegati-documento">
      {errore && (
        <Alert
          variant="danger"
          className="allegati-documento__alert"
        >
          {errore}
        </Alert>
      )}

      {allegati.length > 0 && (
        <div className="allegati-documento__lista">
          {allegati.map(
            (allegato) => (
              <div
                key={allegato.id}
                className="allegati-documento__item"
              >
                <div className="allegati-documento__file">
                  <span className="allegati-documento__file-icon">
                    <FiFileText />
                  </span>

                  <div>
                    <strong>
                      {
                        allegato.nomeOriginale
                      }
                    </strong>

                    <small>
                      {formattaDimensione(
                        allegato.dimensione,
                      )}

                      {" · "}

                      Caricato da{" "}
                      {
                        allegato.caricatoDaNome
                      }{" "}
                      {
                        allegato.caricatoDaCognome
                      }

                      {" · "}

                      {formattaDataOra(
                        allegato.caricatoIl,
                      )}
                    </small>
                  </div>
                </div>

                <div className="allegati-documento__azioni">
                  <Button
                    type="button"
                    variant="link"
                    title="Scarica allegato"
                    disabled={
                      downloadId ===
                      allegato.id
                    }
                    onClick={() =>
                      void scarica(
                        allegato,
                      )
                    }
                  >
                    {downloadId ===
                    allegato.id ? (
                      <Spinner
                        animation="border"
                        size="sm"
                      />
                    ) : (
                      <FiDownload />
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="link"
                    title="Elimina allegato"
                    disabled={
                      eliminazioneId ===
                      allegato.id
                    }
                    onClick={() =>
                      void elimina(
                        allegato,
                      )
                    }
                  >
                    {eliminazioneId ===
                    allegato.id ? (
                      <Spinner
                        animation="border"
                        size="sm"
                      />
                    ) : (
                      <FiTrash2 />
                    )}
                  </Button>
                </div>
              </div>
            ),
          )}
        </div>
      )}

      {allegati.length === 0 && (
        <div className="allegati-documento__vuoto">
          Nessun file caricato.
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
        hidden
        onChange={(event) =>
          void caricaFile(event)
        }
      />

      <Button
        type="button"
        variant="outline-secondary"
        className="allegati-documento__upload"
        disabled={uploadInCorso}
        onClick={apriSelettoreFile}
      >
        {uploadInCorso ? (
          <>
            <Spinner
              animation="border"
              size="sm"
            />

            Caricamento...
          </>
        ) : allegati.length ===
          0 ? (
          <>
            <FiUploadCloud />
            Carica documento
          </>
        ) : (
          <>
            <FiPlus />
            Aggiungi altro file
          </>
        )}
      </Button>
    </div>
  );
}