import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Alert,
  Button,
  Form,
  Spinner,
} from "react-bootstrap";

import {
  FiArrowLeft,
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiEdit3,
  FiFileText,
  FiLayers,
  FiMail,
  FiSave,
  FiUser,
  FiX,
} from "react-icons/fi";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  allegatiService,
} from "../../features/allegati/api/allegatiService";

import AllegatiDocumento from "../../features/allegati/components/AllegatiDocumento";

import type {
  AllegatoDocumento,
} from "../../features/allegati/types/allegatiTypes";

import {
  documentiPraticaService,
} from "../../features/documenti/api/documentiPraticaService";

import type {
  DocumentoPratica,
  RiepilogoDocumenti,
  StatoDocumentoPratica,
} from "../../features/documenti/types/documentiTypes";

import {
  praticheService,
} from "../../features/pratiche/api/praticheService";

import {
  ETICHETTE_PRIORITA_PRATICA,
  ETICHETTE_STATO_PRATICA,
} from "../../features/pratiche/constants/praticheConstants";

import type {
  PrioritaPratica,
  Pratica,
  StatoPratica,
} from "../../features/pratiche/types/praticheTypes";

import {
  sottopraticheService,
} from "../../features/sottopratiche/api/sottopraticheService";

import type {
  Sottopratica,
} from "../../features/sottopratiche/types/sottopraticheTypes";

import "./DettaglioPraticaPage.css";

const ETICHETTE_DOCUMENTO: Record<
  StatoDocumentoPratica,
  string
> = {
  MANCANTE: "Mancante",
  RICEVUTO: "Ricevuto",
  DA_VERIFICARE: "Da verificare",
  VALIDATO: "Validato",
  RIFIUTATO: "Rifiutato",
  NON_APPLICABILE: "Non applicabile",
};

const STATI_DOCUMENTO: StatoDocumentoPratica[] = [
  "MANCANTE",
  "RICEVUTO",
  "DA_VERIFICARE",
  "VALIDATO",
  "RIFIUTATO",
];

const STATI_PRATICA: StatoPratica[] = [
  "BOZZA",
  "DA_AVVIARE",
  "IN_LAVORAZIONE",
  "IN_ATTESA_DOCUMENTI",
  "IN_ATTESA_CLIENTE",
  "IN_ATTESA_ENTE",
  "COMPLETATA",
  "ANNULLATA",
];

const PRIORITA_PRATICA: PrioritaPratica[] = [
  "BASSA",
  "NORMALE",
  "ALTA",
  "URGENTE",
];

const riepilogoVuoto: RiepilogoDocumenti = {
  totale: 0,
  mancanti: 0,
  ricevuti: 0,
  daVerificare: 0,
  validati: 0,
  rifiutati: 0,
  nonApplicabili: 0,
  completati: 0,
  percentualeCompletamento: 0,
};

type ModificaPraticaForm = {
  oggetto: string;
  descrizione: string;
  stato: StatoPratica;
  priorita: PrioritaPratica;
  dataScadenza: string;
  note: string;
};

const formattaData = (
  valore: string | null,
): string => {
  if (!valore) {
    return "—";
  }

  const data =
    valore.includes("T")
      ? new Date(valore)
      : new Date(
          `${valore}T00:00:00`,
        );

  return new Intl.DateTimeFormat(
    "it-IT",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(data);
};

const creaFormDaPratica = (
  pratica: Pratica,
): ModificaPraticaForm => ({
  oggetto: pratica.oggetto,
  descrizione:
    pratica.descrizione ?? "",
  stato: pratica.stato,
  priorita: pratica.priorita,
  dataScadenza:
    pratica.dataScadenza ?? "",
  note: pratica.note ?? "",
});

const normalizzaTesto = (
  valore: string,
): string | null => {
  const pulito = valore.trim();

  return pulito.length > 0
    ? pulito
    : null;
};

export default function DettaglioPraticaPage() {
  const { id } =
    useParams<{ id: string }>();

  const navigate =
    useNavigate();

  const praticaId =
    Number(id);

  const [
    pratica,
    setPratica,
  ] = useState<Pratica | null>(
    null,
  );

  const [
    documenti,
    setDocumenti,
  ] = useState<DocumentoPratica[]>(
    [],
  );

  const [
    allegati,
    setAllegati,
  ] = useState<AllegatoDocumento[]>(
    [],
  );

  const [
    riepilogo,
    setRiepilogo,
  ] = useState<RiepilogoDocumenti>(
    riepilogoVuoto,
  );

  const [
    sottopratiche,
    setSottopratiche,
  ] = useState<Sottopratica[]>(
    [],
  );

  const [
    caricamento,
    setCaricamento,
  ] = useState(true);

  const [
    aggiornamentoDocumentoId,
    setAggiornamentoDocumentoId,
  ] = useState<number | null>(
    null,
  );

  const [
    errore,
    setErrore,
  ] = useState<string | null>(
    null,
  );

  const [
    modalitaModifica,
    setModalitaModifica,
  ] = useState(false);

  const [
    salvataggio,
    setSalvataggio,
  ] = useState(false);

  const [
    formModifica,
    setFormModifica,
  ] = useState<ModificaPraticaForm | null>(
    null,
  );

  const clienteCompleto =
    useMemo(() => {
      if (!pratica) {
        return "";
      }

      return `${pratica.cliente.nome} ${pratica.cliente.cognome}`;
    }, [pratica]);

  const caricaDettaglio =
    async () => {
      if (
        !Number.isInteger(
          praticaId,
        ) ||
        praticaId <= 0
      ) {
        setErrore(
          "Identificativo pratica non valido.",
        );

        setCaricamento(false);

        return;
      }

      try {
        setCaricamento(true);
        setErrore(null);

        const [
          dettaglio,
          elencoDocumenti,
          riepilogoDocumenti,
          elencoSottopratiche,
          elencoAllegati,
        ] = await Promise.all([
          praticheService
            .trovaPerId(
              praticaId,
            ),

          documentiPraticaService
            .trovaPerPratica(
              praticaId,
            ),

          documentiPraticaService
            .riepilogo(
              praticaId,
            ),

          sottopraticheService
            .trovaPerPratica(
              praticaId,
            ),

          allegatiService
            .trovaPerPratica(
              praticaId,
            ),
        ]);

        setPratica(
          dettaglio,
        );

        setDocumenti(
          elencoDocumenti,
        );

        setRiepilogo(
          riepilogoDocumenti,
        );

        setSottopratiche(
          elencoSottopratiche.content,
        );

        setAllegati(
          elencoAllegati,
        );
      } catch {
        setErrore(
          "Non è stato possibile caricare il dettaglio della pratica.",
        );
      } finally {
        setCaricamento(
          false,
        );
      }
    };

  useEffect(() => {
    void caricaDettaglio();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [praticaId]);

  const entraInModifica =
    () => {
      if (!pratica) {
        return;
      }

      setErrore(null);

      setFormModifica(
        creaFormDaPratica(
          pratica,
        ),
      );

      setModalitaModifica(
        true,
      );
    };

  const annullaModifica =
    () => {
      if (pratica) {
        setFormModifica(
          creaFormDaPratica(
            pratica,
          ),
        );
      }

      setErrore(null);

      setModalitaModifica(
        false,
      );
    };

  const aggiornaCampoForm = <
    K extends keyof ModificaPraticaForm,
  >(
    campo: K,
    valore: ModificaPraticaForm[K],
  ) => {
    setFormModifica(
      (corrente) => {
        if (!corrente) {
          return corrente;
        }

        return {
          ...corrente,
          [campo]: valore,
        };
      },
    );
  };

  const salvaModifiche =
    async () => {
      if (
        !pratica ||
        !formModifica
      ) {
        return;
      }

      const oggetto =
        formModifica.oggetto.trim();

      if (!oggetto) {
        setErrore(
          "L'oggetto della pratica è obbligatorio.",
        );

        return;
      }

      try {
        setSalvataggio(true);
        setErrore(null);

        await praticheService
          .aggiornaPratica(
            praticaId,
            {
              responsabileId:
                pratica.responsabile
                  ?.id ?? null,

              oggetto,

              descrizione:
                normalizzaTesto(
                  formModifica.descrizione,
                ),

              priorita:
                formModifica.priorita,

              dataScadenza:
                formModifica.dataScadenza ||
                null,

              note:
                normalizzaTesto(
                  formModifica.note,
                ),
            },
          );

        if (
          formModifica.stato !==
          pratica.stato
        ) {
          await praticheService
            .cambiaStato(
              praticaId,
              {
                stato:
                  formModifica.stato,
              },
            );
        }

        const dettaglioAggiornato =
          await praticheService
            .trovaPerId(
              praticaId,
            );

        setPratica(
          dettaglioAggiornato,
        );

        setFormModifica(
          creaFormDaPratica(
            dettaglioAggiornato,
          ),
        );

        setModalitaModifica(
          false,
        );
      } catch {
        setErrore(
          "Non è stato possibile salvare le modifiche della pratica.",
        );
      } finally {
        setSalvataggio(
          false,
        );
      }
    };

  const cambiaStatoDocumento =
    async (
      documentoId: number,
      stato: StatoDocumentoPratica,
    ) => {
      try {
        setAggiornamentoDocumentoId(
          documentoId,
        );

        setErrore(null);

        const aggiornato =
          await documentiPraticaService
            .cambiaStato(
              documentoId,
              stato,
            );

        setDocumenti(
          (correnti) =>
            correnti.map(
              (documento) =>
                documento.id ===
                aggiornato.id
                  ? aggiornato
                  : documento,
            ),
        );

        const [
          nuovoRiepilogo,
          praticaAggiornata,
        ] = await Promise.all([
          documentiPraticaService
            .riepilogo(
              praticaId,
            ),

          praticheService
            .trovaPerId(
              praticaId,
            ),
        ]);

        setRiepilogo(
          nuovoRiepilogo,
        );

        setPratica(
          praticaAggiornata,
        );
      } catch {
        setErrore(
          "Non è stato possibile aggiornare lo stato del documento.",
        );
      } finally {
        setAggiornamentoDocumentoId(
          null,
        );
      }
    };

  const aggiornaDocumenti =
    async () => {
      try {
        const [
          elencoDocumenti,
          riepilogoDocumenti,
          elencoAllegati,
          praticaAggiornata,
        ] = await Promise.all([
          documentiPraticaService
            .trovaPerPratica(
              praticaId,
            ),

          documentiPraticaService
            .riepilogo(
              praticaId,
            ),

          allegatiService
            .trovaPerPratica(
              praticaId,
            ),

          praticheService
            .trovaPerId(
              praticaId,
            ),
        ]);

        setDocumenti(
          elencoDocumenti,
        );

        setRiepilogo(
          riepilogoDocumenti,
        );

        setAllegati(
          elencoAllegati,
        );

        setPratica(
          praticaAggiornata,
        );
      } catch {
        setErrore(
          "Non è stato possibile aggiornare i documenti della pratica.",
        );
      }
    };

  if (caricamento) {
    return (
      <section className="dettaglio-pratica-page">
        <div className="dettaglio-pratica-loading">
          <Spinner
            animation="border"
            size="sm"
          />

          <span>
            Caricamento pratica...
          </span>
        </div>
      </section>
    );
  }

  if (!pratica) {
    return (
      <section className="dettaglio-pratica-page">
        <Button
          type="button"
          variant="link"
          className="dettaglio-pratica-back"
          onClick={() =>
            navigate(
              "/pratiche",
            )
          }
        >
          <FiArrowLeft />

          Torna alle pratiche
        </Button>

        <Alert variant="danger">
          {errore ??
            "Pratica non trovata."}
        </Alert>
      </section>
    );
  }

  return (
    <section className="dettaglio-pratica-page">
      <div className="dettaglio-pratica-topbar">
        <Button
          type="button"
          variant="link"
          className="dettaglio-pratica-back"
          onClick={() =>
            navigate(
              "/pratiche",
            )
          }
        >
          <FiArrowLeft />

          Pratiche
        </Button>

        <div className="dettaglio-pratica-topbar__azioni">
          {!modalitaModifica ? (
            <Button
              type="button"
              variant="outline-secondary"
              className="dettaglio-pratica-edit"
              onClick={
                entraInModifica
              }
            >
              <FiEdit3 />

              Modifica
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="outline-secondary"
                className="dettaglio-pratica-cancel"
                disabled={
                  salvataggio
                }
                onClick={
                  annullaModifica
                }
              >
                <FiX />

                Annulla
              </Button>

              <Button
                type="button"
                className="dettaglio-pratica-save"
                disabled={
                  salvataggio
                }
                onClick={() =>
                  void salvaModifiche()
                }
              >
                {salvataggio ? (
                  <Spinner
                    animation="border"
                    size="sm"
                  />
                ) : (
                  <FiSave />
                )}

                Salva modifiche
              </Button>
            </>
          )}
        </div>
      </div>

      {errore && (
        <Alert
          variant="danger"
          className="dettaglio-pratica-alert"
        >
          {errore}
        </Alert>
      )}

      <header className="dettaglio-pratica-hero">
        <div className="dettaglio-pratica-hero__main">
          <span className="dettaglio-pratica-eyebrow">
            {
              pratica.numeroPratica
            }
          </span>

          {modalitaModifica &&
          formModifica ? (
            <Form.Control
              type="text"
              value={
                formModifica.oggetto
              }
              maxLength={200}
              className="dettaglio-pratica-edit-field dettaglio-pratica-edit-field--title"
              aria-label="Oggetto pratica"
              onChange={(event) =>
                aggiornaCampoForm(
                  "oggetto",
                  event.target.value,
                )
              }
            />
          ) : (
            <h1>
              {pratica.oggetto}
            </h1>
          )}

          <div className="dettaglio-pratica-badges">
            {modalitaModifica &&
            formModifica ? (
              <>
                <Form.Select
                  value={
                    formModifica.stato
                  }
                  className="dettaglio-pratica-edit-select"
                  aria-label="Stato pratica"
                  onChange={(event) =>
                    aggiornaCampoForm(
                      "stato",
                      event.target
                        .value as StatoPratica,
                    )
                  }
                >
                  {STATI_PRATICA.map(
                    (stato) => (
                      <option
                        key={stato}
                        value={stato}
                      >
                        {
                          ETICHETTE_STATO_PRATICA[
                            stato
                          ]
                        }
                      </option>
                    ),
                  )}
                </Form.Select>

                <Form.Select
                  value={
                    formModifica.priorita
                  }
                  className="dettaglio-pratica-edit-select"
                  aria-label="Priorità pratica"
                  onChange={(event) =>
                    aggiornaCampoForm(
                      "priorita",
                      event.target
                        .value as PrioritaPratica,
                    )
                  }
                >
                  {PRIORITA_PRATICA.map(
                    (priorita) => (
                      <option
                        key={
                          priorita
                        }
                        value={
                          priorita
                        }
                      >
                        {
                          ETICHETTE_PRIORITA_PRATICA[
                            priorita
                          ]
                        }
                      </option>
                    ),
                  )}
                </Form.Select>
              </>
            ) : (
              <>
                <span
                  className={`dettaglio-pratica-badge dettaglio-pratica-badge--stato dettaglio-pratica-badge--${pratica.stato
                    .toLowerCase()
                    .replaceAll(
                      "_",
                      "-",
                    )}`}
                >
                  {
                    ETICHETTE_STATO_PRATICA[
                      pratica.stato
                    ]
                  }
                </span>

                <span
                  className={`dettaglio-pratica-badge dettaglio-pratica-badge--priorita dettaglio-pratica-badge--${pratica.priorita.toLowerCase()}`}
                >
                  {
                    ETICHETTE_PRIORITA_PRATICA[
                      pratica.priorita
                    ]
                  }
                </span>
              </>
            )}
          </div>
        </div>

        <div className="dettaglio-pratica-progress-card">
          <div className="dettaglio-pratica-progress-card__header">
            <div>
              <span>
                Avanzamento documenti
              </span>

              <strong>
                {
                  riepilogo.percentualeCompletamento
                }
                %
              </strong>
            </div>

            <FiCheckCircle />
          </div>

          <div className="dettaglio-pratica-progress">
            <span
              style={{
                width: `${Math.min(
                  100,
                  Math.max(
                    0,
                    riepilogo.percentualeCompletamento,
                  ),
                )}%`,
              }}
            />
          </div>

          <small>
            {riepilogo.completati} documenti
            risolti · {riepilogo.totale} totali
          </small>
        </div>
      </header>

      <section className="dettaglio-pratica-info-grid">
        <article className="dettaglio-pratica-info-card">
          <span className="dettaglio-pratica-info-card__icon dettaglio-pratica-info-card__icon--green">
            <FiUser />
          </span>

          <div>
            <small>
              Cliente
            </small>

            <strong>
              {clienteCompleto}
            </strong>

            <span>
              <FiMail />

              {
                pratica.cliente.email
              }
            </span>
          </div>
        </article>

        <article className="dettaglio-pratica-info-card">
          <span className="dettaglio-pratica-info-card__icon dettaglio-pratica-info-card__icon--blue">
            <FiBriefcase />
          </span>

          <div>
            <small>
              Servizio
            </small>

            <strong>
              {
                pratica.servizio.nome
              }
            </strong>

            <span>
              {
                pratica.servizio
                  .macroAreaNome
              }
            </span>
          </div>
        </article>

        <article className="dettaglio-pratica-info-card">
          <span className="dettaglio-pratica-info-card__icon dettaglio-pratica-info-card__icon--purple">
            <FiUser />
          </span>

          <div>
            <small>
              Responsabile
            </small>

            <strong>
              {pratica.responsabile
                ? `${pratica.responsabile.nome} ${pratica.responsabile.cognome}`
                : "Non assegnata"}
            </strong>

            <span>
              {pratica.responsabile
                ?.email ?? "—"}
            </span>
          </div>
        </article>

        <article className="dettaglio-pratica-info-card">
          <span className="dettaglio-pratica-info-card__icon dettaglio-pratica-info-card__icon--orange">
            <FiCalendar />
          </span>

          <div>
            <small>
              Scadenza
            </small>

            {modalitaModifica &&
            formModifica ? (
              <Form.Control
                type="date"
                value={
                  formModifica.dataScadenza
                }
                className="dettaglio-pratica-edit-field dettaglio-pratica-edit-field--date"
                onChange={(event) =>
                  aggiornaCampoForm(
                    "dataScadenza",
                    event.target.value,
                  )
                }
              />
            ) : (
              <>
                <strong>
                  {formattaData(
                    pratica.dataScadenza,
                  )}
                </strong>

                <span>
                  Creata il{" "}
                  {formattaData(
                    pratica.creatoIl,
                  )}
                </span>
              </>
            )}
          </div>
        </article>
      </section>

      <div className="dettaglio-pratica-layout">
        <main className="dettaglio-pratica-main">
          <section className="dettaglio-pratica-panel">
            <header className="dettaglio-pratica-panel__header">
              <div>
                <span className="dettaglio-pratica-panel__icon dettaglio-pratica-panel__icon--green">
                  <FiFileText />
                </span>

                <div>
                  <h2>
                    Documenti
                  </h2>

                  <p>
                    Checklist generata dal
                    servizio selezionato.
                  </p>
                </div>
              </div>

              <span className="dettaglio-pratica-panel__count">
                {
                  riepilogo.totale
                }
              </span>
            </header>

            <div className="dettaglio-pratica-doc-summary">
              <span>
                Mancanti

                <strong>
                  {
                    riepilogo.mancanti
                  }
                </strong>
              </span>

              <span>
                Ricevuti

                <strong>
                  {
                    riepilogo.ricevuti
                  }
                </strong>
              </span>

              <span>
                Da verificare

                <strong>
                  {
                    riepilogo.daVerificare
                  }
                </strong>
              </span>

              <span>
                Validati

                <strong>
                  {
                    riepilogo.validati
                  }
                </strong>
              </span>
            </div>

            <div className="dettaglio-pratica-documenti">
              {documenti.length ===
              0 ? (
                <div className="dettaglio-pratica-empty">
                  Nessun documento richiesto
                  per questa pratica.
                </div>
              ) : (
                documenti.map(
                  (documento) => (
                    <article
                      key={
                        documento.id
                      }
                      className="dettaglio-pratica-documento"
                    >
                      <div className="dettaglio-pratica-documento__main">
                        <span
                          className={`dettaglio-pratica-documento__status dettaglio-pratica-documento__status--${documento.stato
                            .toLowerCase()
                            .replaceAll(
                              "_",
                              "-",
                            )}`}
                        >
                          <FiFileText />
                        </span>

                        <div>
                          <strong>
                            {
                              documento.etichetta
                            }
                          </strong>

                          <span>
                            {documento.suggerimento ??
                              "Nessuna indicazione aggiuntiva"}
                          </span>

                          <small>
                            {documento.tipoObbligatorieta ===
                            "OBBLIGATORIO"
                              ? "Obbligatorio"
                              : documento.tipoObbligatorieta ===
                                  "CONDIZIONALE"
                                ? "Condizionale"
                                : "Facoltativo"}
                          </small>

                          <AllegatiDocumento
                            documentoId={
                              documento.id
                            }
                            allegati={
                              allegati.filter(
                                (
                                  allegato,
                                ) =>
                                  allegato.documentoPraticaId ===
                                  documento.id,
                              )
                            }
                            onModifica={
                              aggiornaDocumenti
                            }
                          />
                        </div>
                      </div>

                      <div className="dettaglio-pratica-documento__action">
                        {aggiornamentoDocumentoId ===
                        documento.id ? (
                          <div className="dettaglio-pratica-documento__updating">
                            <Spinner
                              animation="border"
                              size="sm"
                            />

                            <span>
                              Aggiornamento...
                            </span>
                          </div>
                        ) : (
                          <>
                            {(documento.stato ===
                              "DA_VERIFICARE" ||
                              documento.stato ===
                                "RICEVUTO") && (
                              <div className="dettaglio-pratica-documento__quick-actions">
                                <Button
                                  type="button"
                                  className="dettaglio-pratica-documento__validate"
                                  onClick={() =>
                                    void cambiaStatoDocumento(
                                      documento.id,
                                      "VALIDATO",
                                    )
                                  }
                                >
                                  <FiCheckCircle />

                                  Valida
                                </Button>

                                <Button
                                  type="button"
                                  variant="outline-danger"
                                  className="dettaglio-pratica-documento__reject"
                                  onClick={() =>
                                    void cambiaStatoDocumento(
                                      documento.id,
                                      "RIFIUTATO",
                                    )
                                  }
                                >
                                  <FiX />

                                  Rifiuta
                                </Button>
                              </div>
                            )}

                            <Form.Select
                              value={
                                documento.stato
                              }
                              aria-label={`Stato ${documento.etichetta}`}
                              onChange={(
                                event,
                              ) =>
                                void cambiaStatoDocumento(
                                  documento.id,
                                  event
                                    .target
                                    .value as StatoDocumentoPratica,
                                )
                              }
                            >
                              {STATI_DOCUMENTO.map(
                                (
                                  stato,
                                ) => (
                                  <option
                                    key={
                                      stato
                                    }
                                    value={
                                      stato
                                    }
                                  >
                                    {
                                      ETICHETTE_DOCUMENTO[
                                        stato
                                      ]
                                    }
                                  </option>
                                ),
                              )}

                              {documento.tipoObbligatorieta ===
                                "CONDIZIONALE" && (
                                <option value="NON_APPLICABILE">
                                  Non applicabile
                                </option>
                              )}
                            </Form.Select>
                          </>
                        )}
                      </div>
                    </article>
                  ),
                )
              )}
            </div>
          </section>

          <section className="dettaglio-pratica-panel">
            <header className="dettaglio-pratica-panel__header">
              <div>
                <span className="dettaglio-pratica-panel__icon dettaglio-pratica-panel__icon--blue">
                  <FiLayers />
                </span>

                <div>
                  <h2>
                    Sottopratiche
                  </h2>

                  <p>
                    Lavorazioni collegate alla
                    pratica principale.
                  </p>
                </div>
              </div>

              <span className="dettaglio-pratica-panel__count">
                {
                  sottopratiche.length
                }
              </span>
            </header>

            <div className="dettaglio-pratica-sottopratiche">
              {sottopratiche.length ===
              0 ? (
                <div className="dettaglio-pratica-empty">
                  Nessuna sottopratica
                  collegata.
                </div>
              ) : (
                sottopratiche.map(
                  (
                    sottopratica,
                  ) => (
                    <article
                      key={
                        sottopratica.id
                      }
                      className="dettaglio-pratica-sottopratica"
                    >
                      <div>
                        <strong>
                          {
                            sottopratica.titolo
                          }
                        </strong>

                        <span>
                          {
                            sottopratica.numeroPratica
                          }
                        </span>
                      </div>

                      <div className="dettaglio-pratica-sottopratica__meta">
                        <span>
                          <FiUser />

                          {sottopratica.operatoreAssegnato
                            ? `${sottopratica.operatoreAssegnato.nome} ${sottopratica.operatoreAssegnato.cognome}`
                            : "Non assegnata"}
                        </span>

                        <span>
                          <FiCalendar />

                          {formattaData(
                            sottopratica.dataScadenza,
                          )}
                        </span>
                      </div>

                      <span
                        className={`dettaglio-pratica-badge dettaglio-pratica-badge--${sottopratica.stato
                          .toLowerCase()
                          .replaceAll(
                            "_",
                            "-",
                          )}`}
                      >
                        {
                          ETICHETTE_STATO_PRATICA[
                            sottopratica.stato
                          ]
                        }
                      </span>
                    </article>
                  ),
                )
              )}
            </div>
          </section>
        </main>

        <aside className="dettaglio-pratica-sidebar">
          <section className="dettaglio-pratica-side-card">
            <header>
              <FiClock />

              <h2>
                Informazioni
              </h2>
            </header>

            <dl>
              <div>
                <dt>
                  Creazione
                </dt>

                <dd>
                  {formattaData(
                    pratica.creatoIl,
                  )}
                </dd>
              </div>

              <div>
                <dt>
                  Ultimo aggiornamento
                </dt>

                <dd>
                  {formattaData(
                    pratica.aggiornatoIl,
                  )}
                </dd>
              </div>

              <div>
                <dt>
                  Chiusura
                </dt>

                <dd>
                  {formattaData(
                    pratica.chiusoIl,
                  )}
                </dd>
              </div>
            </dl>
          </section>

          <section className="dettaglio-pratica-side-card">
            <header>
              <FiFileText />

              <h2>
                Descrizione
              </h2>
            </header>

            {modalitaModifica &&
            formModifica ? (
              <Form.Control
                as="textarea"
                rows={5}
                value={
                  formModifica.descrizione
                }
                className="dettaglio-pratica-edit-textarea"
                placeholder="Descrizione della pratica..."
                onChange={(event) =>
                  aggiornaCampoForm(
                    "descrizione",
                    event.target.value,
                  )
                }
              />
            ) : (
              <p>
                {pratica.descrizione ??
                  "Nessuna descrizione inserita."}
              </p>
            )}
          </section>

          <section className="dettaglio-pratica-side-card">
            <header>
              <FiBriefcase />

              <h2>
                Note interne
              </h2>
            </header>

            {modalitaModifica &&
            formModifica ? (
              <Form.Control
                as="textarea"
                rows={6}
                maxLength={2000}
                value={
                  formModifica.note
                }
                className="dettaglio-pratica-edit-textarea"
                placeholder="Note interne..."
                onChange={(event) =>
                  aggiornaCampoForm(
                    "note",
                    event.target.value,
                  )
                }
              />
            ) : (
              <p>
                {pratica.note ??
                  "Nessuna nota interna."}
              </p>
            )}
          </section>
        </aside>
      </div>
    </section>
  );
}