import {
  FiCheck,
  FiEdit3,
  FiEye,
  FiEyeOff,
  FiFileText,
  FiPlus,
  FiRotateCcw,
  FiSave,
  FiTrash2,
  FiX,
} from "react-icons/fi";

import { TIPI_OBBLIGATORIETA } from "../form/servizioForm";
import type { useDocumentiServizio } from "../hooks/useDocumentiServizio";

interface DocumentiServizioPanelProps {

  checklist: ReturnType<typeof useDocumentiServizio>;
}

const DocumentiServizioPanel = ({
  checklist,
}: DocumentiServizioPanelProps) => {
  const {
    documenti,
    documentiAttivi,
    documentiOrdinati,
    documentoInModificaId,
    formDocumento,
    setFormDocumento,
    nuovoDocumentoAperto,
    setNuovoDocumentoAperto,
    nuovoDocumento,
    setNuovoDocumento,
    operazioneDocumentoId,
    creazioneDocumento,
    avviaModificaDocumento,
    annullaModificaDocumento,
    salvaDocumento,
    apriNuovoDocumento,
    creaDocumento,
    cambiaAttivazioneDocumento,
  } = checklist;

  return (
    <>

          <section className="dettaglio-servizio-panel">
            <header className="dettaglio-servizio-panel__header dettaglio-servizio-panel__header--documenti">
              <div>
                <span className="dettaglio-servizio-panel__icon dettaglio-servizio-panel__icon--documents">
                  <FiFileText />
                </span>

                <div>
                  <h2>
                    Documenti richiesti
                  </h2>

                  <p>
                    Checklist utilizzata per
                    generare i documenti delle
                    pratiche.
                  </p>
                </div>
              </div>

              <div className="dettaglio-servizio-documenti-header-actions">
                <span className="dettaglio-servizio-panel__count">
                  {documentiAttivi}/
                  {documenti.length}
                </span>

                <button
                  type="button"
                  className="dettaglio-servizio-add-document"
                  onClick={
                    apriNuovoDocumento
                  }
                >
                  <FiPlus />

                  Aggiungi documento
                </button>
              </div>
            </header>

            {nuovoDocumentoAperto && (
              <div className="dettaglio-servizio-documento-editor dettaglio-servizio-documento-editor--new">
                <div className="dettaglio-servizio-documento-editor__heading">
                  <div>
                    <span>
                      Nuovo documento
                    </span>

                    <strong>
                      Aggiungi un elemento alla checklist
                    </strong>
                  </div>

                  <button
                    type="button"
                    className="dettaglio-servizio-icon-button"
                    onClick={() =>
                      setNuovoDocumentoAperto(
                        false,
                      )
                    }
                    aria-label="Chiudi"
                  >
                    <FiX />
                  </button>
                </div>

                <div className="dettaglio-servizio-documento-editor__grid">
                  <label className="dettaglio-servizio-documento-field dettaglio-servizio-documento-field--full">
                    <span>
                      Documento
                    </span>

                    <input
                      type="text"
                      value={
                        nuovoDocumento.etichetta
                      }
                      onChange={(evento) =>
                        setNuovoDocumento(
                          (corrente) => ({
                            ...corrente,
                            etichetta:
                              evento.target.value,
                          }),
                        )
                      }
                      placeholder="Es. Documento di identità"
                    />
                  </label>

                  <label className="dettaglio-servizio-documento-field dettaglio-servizio-documento-field--full">
                    <span>
                      Suggerimento
                    </span>

                    <textarea
                      rows={3}
                      value={
                        nuovoDocumento.suggerimento
                      }
                      onChange={(evento) =>
                        setNuovoDocumento(
                          (corrente) => ({
                            ...corrente,
                            suggerimento:
                              evento.target.value,
                          }),
                        )
                      }
                      placeholder="Indicazioni da mostrare all'utente..."
                    />
                  </label>
                </div>

                <div className="dettaglio-servizio-documento-editor__bottom">
                  <div>
                    <span className="dettaglio-servizio-documento-field-label">
                      Obbligatorietà
                    </span>

                    <div className="dettaglio-servizio-obbligatorieta">
                      {TIPI_OBBLIGATORIETA.map(
                        (tipo) => (
                          <button
                            key={
                              tipo.value
                            }
                            type="button"
                            className={[
                              "dettaglio-servizio-obbligatorieta__button",
                              nuovoDocumento.tipoObbligatorieta ===
                              tipo.value
                                ? "dettaglio-servizio-obbligatorieta__button--active"
                                : "",
                            ]
                              .filter(
                                Boolean,
                              )
                              .join(" ")}
                            onClick={() =>
                              setNuovoDocumento(
                                (
                                  corrente,
                                ) => ({
                                  ...corrente,
                                  tipoObbligatorieta:
                                    tipo.value,
                                }),
                              )
                            }
                          >
                            {
                              tipo.label
                            }
                          </button>
                        ),
                      )}
                    </div>
                  </div>

                  <label className="dettaglio-servizio-visibility-toggle">
                    <span>
                      <FiEye />

                      Visibile al cliente
                    </span>

                    <input
                      type="checkbox"
                      checked={
                        nuovoDocumento.visibileAlCliente
                      }
                      onChange={(evento) =>
                        setNuovoDocumento(
                          (corrente) => ({
                            ...corrente,
                            visibileAlCliente:
                              evento.target.checked,
                          }),
                        )
                      }
                    />
                  </label>
                </div>

                <div className="dettaglio-servizio-documento-editor__actions">
                  <button
                    type="button"
                    className="dettaglio-servizio-document-cancel"
                    onClick={() =>
                      setNuovoDocumentoAperto(
                        false,
                      )
                    }
                  >
                    Annulla
                  </button>

                  <button
                    type="button"
                    className="dettaglio-servizio-document-save"
                    onClick={() =>
                      void creaDocumento()
                    }
                    disabled={
                      creazioneDocumento
                    }
                  >
                    <FiSave />

                    {creazioneDocumento
                      ? "Salvataggio..."
                      : "Aggiungi documento"}
                  </button>
                </div>
              </div>
            )}

            <div className="dettaglio-servizio-documenti">
              {documentiOrdinati.length ===
              0 ? (
                <div className="dettaglio-servizio-empty">
                  Nessun documento configurato.
                </div>
              ) : (
                documentiOrdinati.map(
                  (documento) => {
                    const inModifica =
                      documentoInModificaId ===
                      documento.id;

                    if (
                      inModifica &&
                      formDocumento
                    ) {
                      return (
                        <article
                          key={
                            documento.id
                          }
                          className="dettaglio-servizio-documento-editor"
                        >
                          <div className="dettaglio-servizio-documento-editor__heading">
                            <div>
                              <span>
                                Modifica documento
                              </span>

                              <strong>
                                {
                                  documento.etichetta
                                }
                              </strong>
                            </div>

                            <button
                              type="button"
                              className="dettaglio-servizio-icon-button"
                              onClick={
                                annullaModificaDocumento
                              }
                              aria-label="Chiudi modifica"
                            >
                              <FiX />
                            </button>
                          </div>

                          <div className="dettaglio-servizio-documento-editor__grid">
                            <label className="dettaglio-servizio-documento-field dettaglio-servizio-documento-field--full">
                              <span>
                                Documento
                              </span>

                              <input
                                type="text"
                                value={
                                  formDocumento.etichetta
                                }
                                onChange={(
                                  evento,
                                ) =>
                                  setFormDocumento(
                                    (
                                      corrente,
                                    ) =>
                                      corrente
                                        ? {
                                            ...corrente,
                                            etichetta:
                                              evento
                                                .target
                                                .value,
                                          }
                                        : corrente,
                                  )
                                }
                              />
                            </label>

                            <label className="dettaglio-servizio-documento-field dettaglio-servizio-documento-field--full">
                              <span>
                                Suggerimento
                              </span>

                              <textarea
                                rows={3}
                                value={
                                  formDocumento.suggerimento
                                }
                                onChange={(
                                  evento,
                                ) =>
                                  setFormDocumento(
                                    (
                                      corrente,
                                    ) =>
                                      corrente
                                        ? {
                                            ...corrente,
                                            suggerimento:
                                              evento
                                                .target
                                                .value,
                                          }
                                        : corrente,
                                  )
                                }
                              />
                            </label>
                          </div>

                          <div className="dettaglio-servizio-documento-editor__bottom">
                            <div>
                              <span className="dettaglio-servizio-documento-field-label">
                                Obbligatorietà
                              </span>

                              <div className="dettaglio-servizio-obbligatorieta">
                                {TIPI_OBBLIGATORIETA.map(
                                  (
                                    tipo,
                                  ) => (
                                    <button
                                      key={
                                        tipo.value
                                      }
                                      type="button"
                                      className={[
                                        "dettaglio-servizio-obbligatorieta__button",
                                        formDocumento.tipoObbligatorieta ===
                                        tipo.value
                                          ? "dettaglio-servizio-obbligatorieta__button--active"
                                          : "",
                                      ]
                                        .filter(
                                          Boolean,
                                        )
                                        .join(
                                          " ",
                                        )}
                                      onClick={() =>
                                        setFormDocumento(
                                          (
                                            corrente,
                                          ) =>
                                            corrente
                                              ? {
                                                  ...corrente,
                                                  tipoObbligatorieta:
                                                    tipo.value,
                                                }
                                              : corrente,
                                        )
                                      }
                                    >
                                      {
                                        tipo.label
                                      }
                                    </button>
                                  ),
                                )}
                              </div>
                            </div>

                            <label className="dettaglio-servizio-visibility-toggle">
                              <span>
                                {formDocumento.visibileAlCliente ? (
                                  <FiEye />
                                ) : (
                                  <FiEyeOff />
                                )}

                                Visibile al cliente
                              </span>

                              <input
                                type="checkbox"
                                checked={
                                  formDocumento.visibileAlCliente
                                }
                                onChange={(
                                  evento,
                                ) =>
                                  setFormDocumento(
                                    (
                                      corrente,
                                    ) =>
                                      corrente
                                        ? {
                                            ...corrente,
                                            visibileAlCliente:
                                              evento
                                                .target
                                                .checked,
                                          }
                                        : corrente,
                                  )
                                }
                              />
                            </label>
                          </div>

                          <div className="dettaglio-servizio-documento-editor__actions">
                            <button
                              type="button"
                              className="dettaglio-servizio-document-cancel"
                              onClick={
                                annullaModificaDocumento
                              }
                            >
                              Annulla
                            </button>

                            <button
                              type="button"
                              className="dettaglio-servizio-document-save"
                              onClick={() =>
                                void salvaDocumento(
                                  documento.id,
                                )
                              }
                              disabled={
                                operazioneDocumentoId ===
                                documento.id
                              }
                            >
                              <FiSave />

                              {operazioneDocumentoId ===
                              documento.id
                                ? "Salvataggio..."
                                : "Salva documento"}
                            </button>
                          </div>
                        </article>
                      );
                    }

                    return (
                      <article
                        key={
                          documento.id
                        }
                        className={[
                          "dettaglio-servizio-documento",
                          !documento.attivo
                            ? "dettaglio-servizio-documento--inactive"
                            : "",
                        ]
                          .filter(
                            Boolean,
                          )
                          .join(" ")}
                      >
                        <span className="dettaglio-servizio-documento__order">
                          {
                            documento.ordineVisualizzazione
                          }
                        </span>

                        <span
                          className={[
                            "dettaglio-servizio-documento__status",
                            `dettaglio-servizio-documento__status--${documento.tipoObbligatorieta.toLowerCase()}`,
                          ].join(
                            " ",
                          )}
                        >
                          <FiCheck />
                        </span>

                        <div className="dettaglio-servizio-documento__main">
                          <strong>
                            {
                              documento.etichetta
                            }
                          </strong>

                          <p>
                            {documento.suggerimento ??
                              "Nessuna indicazione aggiuntiva."}
                          </p>

                          <div className="dettaglio-servizio-documento__meta">
                            <span
                              className={`dettaglio-servizio-documento__type dettaglio-servizio-documento__type--${documento.tipoObbligatorieta.toLowerCase()}`}
                            >
                              {
                                TIPI_OBBLIGATORIETA.find(
                                  (
                                    tipo,
                                  ) =>
                                    tipo.value ===
                                    documento.tipoObbligatorieta,
                                )
                                  ?.label
                              }
                            </span>

                            <span>
                              {documento.visibileAlCliente ? (
                                <>
                                  <FiEye />
                                  Visibile
                                </>
                              ) : (
                                <>
                                  <FiEyeOff />
                                  Nascosto
                                </>
                              )}
                            </span>

                            {!documento.attivo && (
                              <span className="dettaglio-servizio-documento__inactive-badge">
                                Disattivato
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="dettaglio-servizio-documento__actions">
                          <button
                            type="button"
                            className="dettaglio-servizio-document-action dettaglio-servizio-document-action--edit"
                            onClick={() =>
                              avviaModificaDocumento(
                                documento,
                              )
                            }
                          >
                            <FiEdit3 />

                            Modifica
                          </button>

                          <button
                            type="button"
                            className={[
                              "dettaglio-servizio-document-action",
                              documento.attivo
                                ? "dettaglio-servizio-document-action--disable"
                                : "dettaglio-servizio-document-action--enable",
                            ].join(
                              " ",
                            )}
                            onClick={() =>
                              void cambiaAttivazioneDocumento(
                                documento,
                              )
                            }
                            disabled={
                              operazioneDocumentoId ===
                              documento.id
                            }
                          >
                            {documento.attivo ? (
                              <>
                                <FiTrash2 />
                                Disattiva
                              </>
                            ) : (
                              <>
                                <FiRotateCcw />
                                Riattiva
                              </>
                            )}
                          </button>
                        </div>
                      </article>
                    );
                  },
                )
              )}
            </div>
          </section>
    </>
  );
};

export default DocumentiServizioPanel;
