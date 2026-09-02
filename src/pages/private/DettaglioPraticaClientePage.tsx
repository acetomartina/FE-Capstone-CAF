import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiRefreshCw,
} from "react-icons/fi";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import AllegatiDocumento from "../../features/allegati/components/AllegatiDocumento";
import type { AllegatoDocumento } from "../../features/allegati/types/allegatiTypes";
import { allegatiService } from "../../features/allegati/api/allegatiService";
import { documentiPraticaService } from "../../features/documenti/api/documentiPraticaService";
import type {
  DocumentoPratica,
  RiepilogoDocumenti,
  StatoDocumentoPratica,
  TipoObbligatorietaDocumento,
} from "../../features/documenti/types/documentiTypes";
import { praticheService } from "../../features/pratiche/api/praticheService";
import type {
  Pratica,
  StatoPratica,
} from "../../features/pratiche/types/praticheTypes";
import "./DettaglioPraticaPage.css";
import "./DettaglioPraticaClientePage.css";

const RIEPILOGO_VUOTO: RiepilogoDocumenti = {
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

const ETICHETTE_STATO_PRATICA: Record<
  StatoPratica,
  string
> = {
  BOZZA: "In preparazione",
  DA_AVVIARE: "Da avviare",
  IN_LAVORAZIONE: "In lavorazione",
  IN_ATTESA_DOCUMENTI:
    "Servono documenti",
  IN_ATTESA_CLIENTE:
    "In attesa di una tua risposta",
  IN_ATTESA_ENTE:
    "In attesa dell’ente",
  COMPLETATA: "Completata",
  ANNULLATA: "Annullata",
};

const ETICHETTE_STATO_DOCUMENTO: Record<
  StatoDocumentoPratica,
  string
> = {
  MANCANTE: "Da caricare",
  RICEVUTO: "Ricevuto",
  DA_VERIFICARE: "In verifica",
  VALIDATO: "Validato",
  RIFIUTATO: "Da sostituire",
  NON_APPLICABILE: "Non necessario",
};

const ETICHETTE_OBBLIGATORIETA: Record<
  TipoObbligatorietaDocumento,
  string
> = {
  OBBLIGATORIO: "Obbligatorio",
  CONDIZIONALE: "Se necessario",
  FACOLTATIVO: "Facoltativo",
};

const MESSAGGI_STATO_DOCUMENTO: Record<
  StatoDocumentoPratica,
  string
> = {
  MANCANTE:
    "Il CAF attende questo documento. Puoi caricarlo qui.",
  RICEVUTO:
    "Il documento è stato ricevuto dalla sede.",
  DA_VERIFICARE:
    "Il file è stato inviato e sarà controllato dal CAF.",
  VALIDATO:
    "Il documento è stato controllato e accettato.",
  RIFIUTATO:
    "Il file non è stato accettato. Caricane una versione corretta.",
  NON_APPLICABILE:
    "Questo documento non è necessario per la tua pratica.",
};

const formattaData = (
  valore: string | null,
): string => {
  if (!valore) {
    return "Non prevista";
  }

  const data = valore.includes("T")
    ? new Date(valore)
    : new Date(`${valore}T00:00:00`);

  if (Number.isNaN(data.getTime())) {
    return "Non disponibile";
  }

  return data.toLocaleDateString(
    "it-IT",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    },
  );
};

const classeStato = (
  stato: string,
): string =>
  stato
    .toLowerCase()
    .replaceAll("_", "-");

const DettaglioPraticaClientePage = () => {
  const { id } =
    useParams<{ id: string }>();

  const navigate = useNavigate();
  const praticaId = Number(id);

  const [pratica, setPratica] =
    useState<Pratica | null>(null);

  const [documenti, setDocumenti] =
    useState<DocumentoPratica[]>([]);

  const [allegati, setAllegati] =
    useState<AllegatoDocumento[]>([]);

  const [riepilogo, setRiepilogo] =
    useState<RiepilogoDocumenti>(
      RIEPILOGO_VUOTO,
    );

  const [caricamento, setCaricamento] =
    useState(true);

  const [errore, setErrore] =
    useState<string | null>(null);

  const caricaDettaglio =
    useCallback(async () => {
      if (
        !Number.isInteger(praticaId) ||
        praticaId <= 0
      ) {
        setErrore(
          "Identificativo della pratica non valido.",
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
          elencoAllegati,
        ] = await Promise.all([
          praticheService.trovaMiaPerId(
            praticaId,
          ),
          documentiPraticaService
            .trovaMieiPerPratica(
              praticaId,
            ),
          documentiPraticaService
            .riepilogoMiei(
              praticaId,
            ),
          allegatiService
            .trovaPerPratica(
              praticaId,
            ),
        ]);

        setPratica(dettaglio);
        setDocumenti(elencoDocumenti);
        setRiepilogo(
          riepilogoDocumenti,
        );
        setAllegati(elencoAllegati);
      } catch {
        setErrore(
          "Non è stato possibile caricare la pratica. Potrebbe non essere disponibile oppure non appartenere al tuo account.",
        );
      } finally {
        setCaricamento(false);
      }
    }, [praticaId]);

  useEffect(() => {
    void caricaDettaglio();
  }, [caricaDettaglio]);

  const allegatiPerDocumento =
    useMemo(() => {
      const raggruppati =
        new Map<
          number,
          AllegatoDocumento[]
        >();

      allegati.forEach((allegato) => {
        const correnti =
          raggruppati.get(
            allegato.documentoPraticaId,
          ) ?? [];

        raggruppati.set(
          allegato.documentoPraticaId,
          [...correnti, allegato],
        );
      });

      return raggruppati;
    }, [allegati]);

  if (caricamento) {
    return (
      <div className="cliente-pratica-loading">
        <FiRefreshCw />
        <strong>
          Caricamento della pratica…
        </strong>
        <span>
          Stiamo recuperando documenti
          e aggiornamenti.
        </span>
      </div>
    );
  }

  if (errore || !pratica) {
    return (
      <div className="cliente-pratica-error">
        <FiAlertCircle />

        <h1>Pratica non disponibile</h1>

        <p>
          {errore ??
            "Non è stato possibile trovare la pratica richiesta."}
        </p>

        <button
          type="button"
          onClick={() =>
            navigate("/cliente")
          }
        >
          <FiArrowLeft />
          Torna alla tua area
        </button>
      </div>
    );
  }

  return (
    <div className="cliente-pratica-page">
      <header className="cliente-pratica-header">
        <button
          type="button"
          className="cliente-pratica-back"
          onClick={() =>
            navigate("/cliente")
          }
        >
          <FiArrowLeft />
          La mia area
        </button>

        <button
          type="button"
          className="cliente-pratica-refresh"
          onClick={() =>
            void caricaDettaglio()
          }
        >
          <FiRefreshCw />
          Aggiorna
        </button>
      </header>

      <section className="cliente-pratica-hero">
        <div className="cliente-pratica-hero__content">
          <span>
            {pratica.numeroPratica}
          </span>

          <h1>
            {pratica.servizio.nome}
          </h1>

          <p>{pratica.oggetto}</p>

          <div className="cliente-pratica-hero__meta">
            <span
              className={`cliente-pratica-status cliente-pratica-status--${classeStato(pratica.stato)}`}
            >
              {
                ETICHETTE_STATO_PRATICA[
                  pratica.stato
                ]
              }
            </span>

            <span>
              <FiCalendar />
              Scadenza:{" "}
              {formattaData(
                pratica.dataScadenza,
              )}
            </span>
          </div>
        </div>

        <div className="cliente-pratica-progress">
          <div className="cliente-pratica-progress__top">
            <span>
              Documentazione
            </span>

            <strong>
              {
                riepilogo.percentualeCompletamento
              }
              %
            </strong>
          </div>

          <div
            className="cliente-pratica-progress__track"
            role="progressbar"
            aria-label="Completamento documentazione"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={
              riepilogo.percentualeCompletamento
            }
          >
            <span
              style={{
                width: `${riepilogo.percentualeCompletamento}%`,
              }}
            />
          </div>

          <p>
            {riepilogo.completati} di{" "}
            {riepilogo.totale} documenti
            completati
          </p>
        </div>
      </section>

      <div className="cliente-pratica-layout">
        <main className="cliente-pratica-main">
          <section className="cliente-pratica-panel">
            <div className="cliente-pratica-panel__header">
              <div>
                <span>Checklist</span>
                <h2>
                  Documenti della pratica
                </h2>
              </div>

              <span className="cliente-pratica-panel__count">
                {documenti.length}
              </span>
            </div>

            {documenti.length === 0 ? (
              <div className="cliente-pratica-empty">
                <FiCheckCircle />

                <strong>
                  Nessun documento richiesto
                </strong>

                <p>
                  Per questa pratica non
                  sono presenti documenti
                  da caricare.
                </p>
              </div>
            ) : (
              <div className="cliente-documenti">
                {documenti.map(
                  (documento) => {
                    const documentoAllegati =
                      allegatiPerDocumento.get(
                        documento.id,
                      ) ?? [];

                    return (
                      <article
                        key={documento.id}
                        className={`cliente-documento cliente-documento--${classeStato(documento.stato)}`}
                      >
                        <div className="cliente-documento__heading">
                          <span className="cliente-documento__icon">
                            {documento.stato ===
                            "VALIDATO" ? (
                              <FiCheckCircle />
                            ) : documento.stato ===
                              "RIFIUTATO" ? (
                              <FiAlertCircle />
                            ) : (
                              <FiFileText />
                            )}
                          </span>

                          <div className="cliente-documento__title">
                            <strong>
                              {
                                documento.etichetta
                              }
                            </strong>

                            <div>
                              <span>
                                {
                                  ETICHETTE_OBBLIGATORIETA[
                                    documento
                                      .tipoObbligatorieta
                                  ]
                                }
                              </span>

                              <span
                                className={`cliente-documento__status cliente-documento__status--${classeStato(documento.stato)}`}
                              >
                                {
                                  ETICHETTE_STATO_DOCUMENTO[
                                    documento
                                      .stato
                                  ]
                                }
                              </span>
                            </div>
                          </div>
                        </div>

                        {documento.suggerimento && (
                          <p className="cliente-documento__hint">
                            {
                              documento.suggerimento
                            }
                          </p>
                        )}

                        <p className="cliente-documento__message">
                          {
                            MESSAGGI_STATO_DOCUMENTO[
                              documento.stato
                            ]
                          }
                        </p>

                        {documento.stato !==
                          "NON_APPLICABILE" && (
                          <AllegatiDocumento
                            documentoId={
                              documento.id
                            }
                            allegati={
                              documentoAllegati
                            }
                            onModifica={
                              caricaDettaglio
                            }
                          />
                        )}
                      </article>
                    );
                  },
                )}
              </div>
            )}
          </section>
        </main>

        <aside className="cliente-pratica-sidebar">
          <section className="cliente-pratica-side-card">
            <header>
              <FiFileText />
              <h2>
                Informazioni pratica
              </h2>
            </header>

            <dl>
              <div>
                <dt>Numero</dt>
                <dd>
                  {
                    pratica.numeroPratica
                  }
                </dd>
              </div>

              <div>
                <dt>Servizio</dt>
                <dd>
                  {
                    pratica.servizio.nome
                  }
                </dd>
              </div>

              <div>
                <dt>Stato</dt>
                <dd>
                  {
                    ETICHETTE_STATO_PRATICA[
                      pratica.stato
                    ]
                  }
                </dd>
              </div>

              <div>
                <dt>Aperta il</dt>
                <dd>
                  {formattaData(
                    pratica.creatoIl,
                  )}
                </dd>
              </div>

              <div>
                <dt>Scadenza</dt>
                <dd>
                  {formattaData(
                    pratica.dataScadenza,
                  )}
                </dd>
              </div>
            </dl>
          </section>

          {pratica.descrizione && (
            <section className="cliente-pratica-side-card">
              <header>
                <FiClock />
                <h2>
                  Dettagli del servizio
                </h2>
              </header>

              <p>
                {pratica.descrizione}
              </p>
            </section>
          )}

          <section className="cliente-pratica-help">
            <span>Hai un dubbio?</span>

            <h2>
              Siamo qui per aiutarti.
            </h2>

            <p>
              Contatta il CAF se non sai
              quale documento caricare o
              se una richiesta non ti è
              chiara.
            </p>

            <a href="tel:+393779609155">
              377 960 9155
            </a>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default DettaglioPraticaClientePage;