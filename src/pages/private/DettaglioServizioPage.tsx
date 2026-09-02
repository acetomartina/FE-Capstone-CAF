import {
  useEffect,
  useState,
} from "react";

import {
  FiArrowLeft,
  FiClock,
  FiDollarSign,
  FiEdit3,
  FiFileText,
  FiGlobe,
  FiRefreshCw,
  FiSave,
  FiSettings,
  FiX,
} from "react-icons/fi";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { serviziService } from "../../features/servizi/api/serviziService";

import type {
  AggiornaServizioRequest,
  Servizio,
} from "../../features/servizi/types/serviziTypes";

import DocumentiServizioPanel from "../../features/servizi/components/DocumentiServizioPanel";
import { useDocumentiServizio } from "../../features/servizi/hooks/useDocumentiServizio";

import {
  creaFormDaServizio,
  type FormServizio,
} from "../../features/servizi/form/servizioForm";

import "./DettaglioServizioPage.css";

/* =========================================================
   COMPONENTE
   ========================================================= */

const DettaglioServizioPage = () => {
  const { id } = useParams<{
    id: string;
  }>();

  const navigate = useNavigate();

  const servizioId = Number(id);

  /* =======================================================
     DATI
     ======================================================= */

  const [
    servizio,
    setServizio,
  ] = useState<Servizio | null>(
    null,
  );

  /* =======================================================
     FORM SERVIZIO
     ======================================================= */

  const [
    form,
    setForm,
  ] = useState<FormServizio | null>(
    null,
  );

  const [
    modalitaModifica,
    setModalitaModifica,
  ] = useState(false);

  /* =======================================================
     STATI UI
     ======================================================= */

  const [
    caricamento,
    setCaricamento,
  ] = useState(true);

  const [
    salvataggio,
    setSalvataggio,
  ] = useState(false);

  const [
    errore,
    setErrore,
  ] = useState<string | null>(
    null,
  );

  const [
    messaggioSuccesso,
    setMessaggioSuccesso,
  ] = useState<string | null>(
    null,
  );

  /* =======================================================
     CHECKLIST DOCUMENTALE
     =======================================================
     Stato e operazioni vivono nel loro hook: qui restano solo
     i messaggi, che la barra in cima condivide con la modifica
     dell'anagrafica. */

  const checklist = useDocumentiServizio({
    servizioId,
    segnalaErrore: setErrore,
    segnalaSuccesso: setMessaggioSuccesso,
  });

  /* Solo cio' che serve fuori dal pannello: i conteggi mostrati
     nell'intestazione e il travaso dal caricamento iniziale. */
  const {
    documenti,
    documentiAttivi,
    impostaDocumenti,
  } = checklist;

  /* =======================================================
     DERIVATI
     ======================================================= */

  /* =======================================================
     CARICAMENTO
     ======================================================= */

  const caricaDettaglio =
    async () => {
      if (
        !Number.isInteger(
          servizioId,
        ) ||
        servizioId <= 0
      ) {
        setErrore(
          "Identificativo servizio non valido.",
        );

        setCaricamento(false);

        return;
      }

      try {
        setCaricamento(true);
        setErrore(null);

        const [
          dettaglioServizio,
          documentiServizio,
        ] = await Promise.all([
          serviziService
            .trovaServizioPerId(
              servizioId,
            ),

          serviziService
            .trovaDocumentiPerServizio(
              servizioId,
            ),
        ]);

        setServizio(
          dettaglioServizio,
        );

        setForm(
          creaFormDaServizio(
            dettaglioServizio,
          ),
        );

        impostaDocumenti(
          documentiServizio,
        );
      } catch {
        setErrore(
          "Non è stato possibile caricare il dettaglio del servizio.",
        );
      } finally {
        setCaricamento(false);
      }
    };

  useEffect(() => {
    void caricaDettaglio();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [servizioId]);

  /* =======================================================
     HELPERS SERVIZIO
     ======================================================= */

  const formattaPrezzo =
    () => {
      if (!servizio) {
        return "—";
      }

      if (
        servizio.prezzoTesto
      ) {
        return servizio.prezzoTesto;
      }

      if (
        servizio.prezzo === null
      ) {
        return "—";
      }

      return new Intl.NumberFormat(
        "it-IT",
        {
          style: "currency",
          currency: "EUR",
        },
      ).format(servizio.prezzo);
    };

  const aggiornaCampo = <
    K extends keyof FormServizio,
  >(
    campo: K,
    valore: FormServizio[K],
  ) => {
    setForm((corrente) =>
      corrente
        ? {
            ...corrente,
            [campo]: valore,
          }
        : corrente,
    );
  };

  const annullaModifica =
    () => {
      if (!servizio) {
        return;
      }

      setForm(
        creaFormDaServizio(
          servizio,
        ),
      );

      setModalitaModifica(false);
      setErrore(null);
      setMessaggioSuccesso(null);
    };

  /* =======================================================
     SALVATAGGIO SERVIZIO
     ======================================================= */

  const salvaModifiche =
    async () => {
      if (!form) {
        return;
      }

      if (
        form.nome.trim() === ""
      ) {
        setErrore(
          "Il nome del servizio è obbligatorio.",
        );

        return;
      }

      try {
        setSalvataggio(true);
        setErrore(null);
        setMessaggioSuccesso(null);

        const request:
          AggiornaServizioRequest = {
          nome:
            form.nome.trim(),

          descrizioneBreve:
            form.descrizioneBreve.trim(),

          descrizione:
            form.descrizione.trim(),

          destinatari:
            form.destinatari.trim(),

          requisiti:
            form.requisiti.trim(),

          comeFunziona:
            form.comeFunziona.trim(),

          prezzo:
            form.prezzo.trim() === ""
              ? undefined
              : Number(
                  form.prezzo,
                ),

          prezzoTesto:
            form.prezzoTesto.trim(),

          notaPrezzo:
            form.notaPrezzo.trim(),

          durataMinuti:
            form.durataMinuti.trim() ===
            ""
              ? undefined
              : Number(
                  form.durataMinuti,
                ),

          prenotabile:
            form.prenotabile,

          richiedibileOnline:
            form.richiedibileOnline,

          inEvidenza:
            form.inEvidenza,

          generaPratica:
            form.generaPratica,

          richiedeDocumenti:
            form.richiedeDocumenti,

          ordineVisualizzazione:
            Number(
              form.ordineVisualizzazione,
            ),

          attivo:
            form.attivo,

          validoFinoAl:
            form.validoFinoAl.trim() ===
            ""
              ? undefined
              : form.validoFinoAl,
        };

        const aggiornato =
          await serviziService
            .aggiornaServizio(
              servizioId,
              request,
            );

        setServizio(
          aggiornato,
        );

        setForm(
          creaFormDaServizio(
            aggiornato,
          ),
        );

        setModalitaModifica(false);

        setMessaggioSuccesso(
          "Servizio aggiornato correttamente.",
        );
      } catch {
        setErrore(
          "Non è stato possibile salvare le modifiche.",
        );
      } finally {
        setSalvataggio(false);
      }
    };

  /* =======================================================
     LOADING / ERROR
     ======================================================= */

  if (caricamento) {
    return (
      <section className="dettaglio-servizio-page">
        <div className="dettaglio-servizio-state">
          Caricamento servizio...
        </div>
      </section>
    );
  }

  if (!servizio || !form) {
    return (
      <section className="dettaglio-servizio-page">
        <button
          type="button"
          className="dettaglio-servizio-back"
          onClick={() =>
            navigate(
              "/amministrazione/servizi",
            )
          }
        >
          <FiArrowLeft />

          Configurazione servizi
        </button>

        <div className="dettaglio-servizio-error">
          {errore ??
            "Servizio non trovato."}
        </div>
      </section>
    );
  }

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <section className="dettaglio-servizio-page">
      {/* TOPBAR */}

      <div className="dettaglio-servizio-topbar">
        <button
          type="button"
          className="dettaglio-servizio-back"
          onClick={() =>
            navigate(
              "/amministrazione/servizi",
            )
          }
        >
          <FiArrowLeft />

          Configurazione servizi
        </button>

        <div className="dettaglio-servizio-topbar__actions">
          <button
            type="button"
            className="dettaglio-servizio-refresh"
            onClick={() =>
              void caricaDettaglio()
            }
            disabled={
              salvataggio
            }
          >
            <FiRefreshCw />

            Aggiorna
          </button>

          {!modalitaModifica ? (
            <button
              type="button"
              className="dettaglio-servizio-edit-button"
              onClick={() => {
                setModalitaModifica(
                  true,
                );

                setMessaggioSuccesso(
                  null,
                );
              }}
            >
              <FiEdit3 />

              Modifica servizio
            </button>
          ) : (
            <>
              <button
                type="button"
                className="dettaglio-servizio-cancel-button"
                onClick={
                  annullaModifica
                }
                disabled={
                  salvataggio
                }
              >
                <FiX />

                Annulla
              </button>

              <button
                type="button"
                className="dettaglio-servizio-save-button"
                onClick={() =>
                  void salvaModifiche()
                }
                disabled={
                  salvataggio
                }
              >
                <FiSave />

                {salvataggio
                  ? "Salvataggio..."
                  : "Salva modifiche"}
              </button>
            </>
          )}
        </div>
      </div>

      {errore && (
        <div className="dettaglio-servizio-error">
          {errore}
        </div>
      )}

      {messaggioSuccesso && (
        <div className="dettaglio-servizio-success">
          {messaggioSuccesso}
        </div>
      )}

      {/* HERO */}

      <header className="dettaglio-servizio-hero">
        <span className="dettaglio-servizio-eyebrow">
          {servizio.macroAreaNome}
        </span>

        {modalitaModifica ? (
          <input
            type="text"
            className="dettaglio-servizio-title-input"
            value={form.nome}
            onChange={(evento) =>
              aggiornaCampo(
                "nome",
                evento.target.value,
              )
            }
          />
        ) : (
          <h1>
            {servizio.nome}
          </h1>
        )}

        {modalitaModifica ? (
          <textarea
            className="dettaglio-servizio-description-input"
            rows={2}
            value={
              form.descrizioneBreve
            }
            onChange={(evento) =>
              aggiornaCampo(
                "descrizioneBreve",
                evento.target.value,
              )
            }
            placeholder="Descrizione breve del servizio"
          />
        ) : (
          <p>
            {servizio.descrizioneBreve ??
              "Nessuna descrizione breve disponibile."}
          </p>
        )}

        <div className="dettaglio-servizio-badges">
          {form.attivo && (
            <span className="dettaglio-servizio-badge dettaglio-servizio-badge--active">
              Attivo
            </span>
          )}

          {!form.attivo && (
            <span className="dettaglio-servizio-badge dettaglio-servizio-badge--inactive">
              Disattivato
            </span>
          )}

          {form.prenotabile && (
            <span className="dettaglio-servizio-badge dettaglio-servizio-badge--blue">
              Prenotabile
            </span>
          )}

          {form.richiedibileOnline && (
            <span className="dettaglio-servizio-badge dettaglio-servizio-badge--purple">
              Online
            </span>
          )}

          {form.inEvidenza && (
            <span className="dettaglio-servizio-badge dettaglio-servizio-badge--featured">
              In evidenza
            </span>
          )}
        </div>
      </header>

      {/* INFO */}

      <section className="dettaglio-servizio-info-grid">
        <article className="dettaglio-servizio-info-card">
          <span className="dettaglio-servizio-info-icon dettaglio-servizio-info-icon--green">
            <FiDollarSign />
          </span>

          <div>
            <small>
              Prezzo
            </small>

            {modalitaModifica ? (
              <>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="dettaglio-servizio-inline-input"
                  value={form.prezzo}
                  onChange={(evento) =>
                    aggiornaCampo(
                      "prezzo",
                      evento.target.value,
                    )
                  }
                  placeholder="0,00"
                />

                <input
                  type="text"
                  className="dettaglio-servizio-inline-secondary-input"
                  value={
                    form.notaPrezzo
                  }
                  onChange={(evento) =>
                    aggiornaCampo(
                      "notaPrezzo",
                      evento.target.value,
                    )
                  }
                  placeholder="Nota sul prezzo"
                />
              </>
            ) : (
              <>
                <strong>
                  {formattaPrezzo()}
                </strong>

                <span>
                  {servizio.notaPrezzo ??
                    "Nessuna nota"}
                </span>
              </>
            )}
          </div>
        </article>

        <article className="dettaglio-servizio-info-card">
          <span className="dettaglio-servizio-info-icon dettaglio-servizio-info-icon--blue">
            <FiClock />
          </span>

          <div>
            <small>
              Durata
            </small>

            {modalitaModifica ? (
              <input
                type="number"
                min="0"
                className="dettaglio-servizio-inline-input"
                value={
                  form.durataMinuti
                }
                onChange={(evento) =>
                  aggiornaCampo(
                    "durataMinuti",
                    evento.target.value,
                  )
                }
                placeholder="Minuti"
              />
            ) : (
              <strong>
                {servizio.durataMinuti
                  ? `${servizio.durataMinuti} min`
                  : "—"}
              </strong>
            )}

            <span>
              Durata indicativa
            </span>
          </div>
        </article>

        <article className="dettaglio-servizio-info-card">
          <span className="dettaglio-servizio-info-icon dettaglio-servizio-info-icon--purple">
            <FiFileText />
          </span>

          <div>
            <small>
              Documenti
            </small>

            <strong>
              {documentiAttivi}
            </strong>

            <span>
              {documenti.length} configurati
            </span>
          </div>
        </article>

        <article className="dettaglio-servizio-info-card">
          <span className="dettaglio-servizio-info-icon dettaglio-servizio-info-icon--orange">
            <FiGlobe />
          </span>

          <div>
            <small>
              Richiesta online
            </small>

            <strong>
              {form.richiedibileOnline
                ? "Disponibile"
                : "Non disponibile"}
            </strong>

            <span>
              Canale digitale
            </span>
          </div>
        </article>
      </section>

      {/* LAYOUT */}

      <div className="dettaglio-servizio-layout">
        <main className="dettaglio-servizio-main">
          {/* INFORMAZIONI */}

          <section className="dettaglio-servizio-panel">
            <header className="dettaglio-servizio-panel__header">
              <div>
                <span className="dettaglio-servizio-panel__icon">
                  <FiSettings />
                </span>

                <div>
                  <h2>
                    Informazioni servizio
                  </h2>

                  <p>
                    Contenuti utilizzabili anche
                    nelle pagine pubbliche.
                  </p>
                </div>
              </div>
            </header>

            <div className="dettaglio-servizio-details">
              <div>
                <small>
                  Descrizione
                </small>

                {modalitaModifica ? (
                  <textarea
                    rows={5}
                    className="dettaglio-servizio-textarea"
                    value={
                      form.descrizione
                    }
                    onChange={(evento) =>
                      aggiornaCampo(
                        "descrizione",
                        evento.target.value,
                      )
                    }
                    placeholder="Inserisci la descrizione completa del servizio..."
                  />
                ) : (
                  <p>
                    {servizio.descrizione ??
                      "Nessuna descrizione inserita."}
                  </p>
                )}
              </div>

              <div>
                <small>
                  Destinatari
                </small>

                {modalitaModifica ? (
                  <textarea
                    rows={5}
                    className="dettaglio-servizio-textarea"
                    value={
                      form.destinatari
                    }
                    onChange={(evento) =>
                      aggiornaCampo(
                        "destinatari",
                        evento.target.value,
                      )
                    }
                    placeholder="A chi è rivolto il servizio?"
                  />
                ) : (
                  <p>
                    {servizio.destinatari ??
                      "Non specificati."}
                  </p>
                )}
              </div>

              <div>
                <small>
                  Requisiti
                </small>

                {modalitaModifica ? (
                  <textarea
                    rows={5}
                    className="dettaglio-servizio-textarea"
                    value={
                      form.requisiti
                    }
                    onChange={(evento) =>
                      aggiornaCampo(
                        "requisiti",
                        evento.target.value,
                      )
                    }
                    placeholder="Inserisci i requisiti..."
                  />
                ) : (
                  <p>
                    {servizio.requisiti ??
                      "Nessun requisito specificato."}
                  </p>
                )}
              </div>

              <div>
                <small>
                  Come funziona
                </small>

                {modalitaModifica ? (
                  <textarea
                    rows={5}
                    className="dettaglio-servizio-textarea"
                    value={
                      form.comeFunziona
                    }
                    onChange={(evento) =>
                      aggiornaCampo(
                        "comeFunziona",
                        evento.target.value,
                      )
                    }
                    placeholder="Spiega come funziona il servizio..."
                  />
                ) : (
                  <p>
                    {servizio.comeFunziona ??
                      "Nessuna indicazione inserita."}
                  </p>
                )}
              </div>
            </div>
          </section>

          <DocumentiServizioPanel
            checklist={checklist}
          />
        </main>

        {/* SIDEBAR */}

        <aside className="dettaglio-servizio-sidebar">
          <section className="dettaglio-servizio-side-card">
            <header>
              <FiSettings />

              <h2>
                Configurazione
              </h2>
            </header>

            {modalitaModifica ? (
              <div className="dettaglio-servizio-switches">
                {[
                  {
                    key: "attivo",
                    label: "Attivo",
                    description:
                      "Servizio disponibile",
                  },
                  {
                    key: "prenotabile",
                    label: "Prenotabile",
                    description:
                      "Appuntamento in sede",
                  },
                  {
                    key: "richiedibileOnline",
                    label:
                      "Richiedibile online",
                    description:
                      "Richiesta digitale",
                  },
                  {
                    key: "inEvidenza",
                    label: "In evidenza",
                    description:
                      "Mostra in primo piano",
                  },
                  {
                    key: "generaPratica",
                    label:
                      "Genera pratica",
                    description:
                      "Crea una pratica",
                  },
                  {
                    key: "richiedeDocumenti",
                    label:
                      "Richiede documenti",
                    description:
                      "Usa checklist documentale",
                  },
                ].map(
                  (configurazione) => {
                    const key =
                      configurazione.key as
                        | "attivo"
                        | "prenotabile"
                        | "richiedibileOnline"
                        | "inEvidenza"
                        | "generaPratica"
                        | "richiedeDocumenti";

                    return (
                      <label
                        key={key}
                      >
                        <span>
                          <strong>
                            {
                              configurazione.label
                            }
                          </strong>

                          <small>
                            {
                              configurazione.description
                            }
                          </small>
                        </span>

                        <input
                          type="checkbox"
                          checked={
                            form[key]
                          }
                          onChange={(
                            evento,
                          ) =>
                            aggiornaCampo(
                              key,
                              evento
                                .target
                                .checked,
                            )
                          }
                        />
                      </label>
                    );
                  },
                )}
              </div>
            ) : (
              <dl>
                <div>
                  <dt>
                    Attivo
                  </dt>

                  <dd>
                    {servizio.attivo
                      ? "Sì"
                      : "No"}
                  </dd>
                </div>

                <div>
                  <dt>
                    Prenotabile
                  </dt>

                  <dd>
                    {servizio.prenotabile
                      ? "Sì"
                      : "No"}
                  </dd>
                </div>

                <div>
                  <dt>
                    Richiedibile online
                  </dt>

                  <dd>
                    {servizio.richiedibileOnline
                      ? "Sì"
                      : "No"}
                  </dd>
                </div>

                <div>
                  <dt>
                    In evidenza
                  </dt>

                  <dd>
                    {servizio.inEvidenza
                      ? "Sì"
                      : "No"}
                  </dd>
                </div>

                <div>
                  <dt>
                    Genera pratica
                  </dt>

                  <dd>
                    {servizio.generaPratica
                      ? "Sì"
                      : "No"}
                  </dd>
                </div>

                <div>
                  <dt>
                    Richiede documenti
                  </dt>

                  <dd>
                    {servizio.richiedeDocumenti
                      ? "Sì"
                      : "No"}
                  </dd>
                </div>
              </dl>
            )}
          </section>

          <section className="dettaglio-servizio-side-card">
            <header>
              <FiFileText />

              <h2>
                Identificativi
              </h2>
            </header>

            <dl>
              <div>
                <dt>
                  ID servizio
                </dt>

                <dd>
                  {servizio.id}
                </dd>
              </div>

              <div>
                <dt>
                  Slug
                </dt>

                <dd>
                  {servizio.slug}
                </dd>
              </div>

              <div>
                <dt>
                  Ordine
                </dt>

                <dd>
                  {
                    servizio.ordineVisualizzazione
                  }
                </dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </section>
  );
};

export default DettaglioServizioPage;
