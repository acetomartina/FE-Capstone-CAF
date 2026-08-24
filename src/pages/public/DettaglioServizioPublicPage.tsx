import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FiArrowLeft,
  FiArrowRight,
  FiBriefcase,
  FiCalendar,
  FiCheck,
  FiChevronDown,
  FiClock,
  FiFileText,
  FiGlobe,
  FiInfo,
  FiMapPin,
  FiTag,
} from "react-icons/fi";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  serviziPublicService,
} from "../../features/servizi/api/serviziPublicService";

import type {
  DocumentoServizio,
  ServizioCatalogo,
  TipoObbligatorietaDocumento,
} from "../../features/servizi/types/serviziTypes";

import "./DettaglioServizioPublicPage.css";

const ottieniTema = (macroArea: string) => {
  const valore = macroArea.toLowerCase();

  if (valore.includes("energia")) return "orange";
  if (valore.includes("telefon")) return "blue";
  if (valore.includes("finanzi")) return "fuchsia";
  if (valore.includes("mobil")) return "purple";
  if (valore.includes("digital")) return "petrol";

  return "green";
};

const formattaData = (
  valore: string | null,
): string | null => {
  if (!valore) return null;

  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${valore}T00:00:00`));
};

const DettaglioServizioPublicPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [servizio, setServizio] =
    useState<ServizioCatalogo | null>(null);

  const [documenti, setDocumenti] =
    useState<DocumentoServizio[]>([]);

  const [caricamento, setCaricamento] =
    useState(true);

  const [errore, setErrore] =
    useState<string | null>(null);

  const [postItAperto, setPostItAperto] =
    useState<"cose" | "serve">("cose");

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [slug]);

  useEffect(() => {
    const caricaServizio = async () => {
      if (!slug) {
        setErrore("Servizio non valido.");
        setCaricamento(false);
        return;
      }

      try {
        setCaricamento(true);
        setErrore(null);

        const [
          risultatoServizio,
          risultatoDocumenti,
        ] = await Promise.all([
          serviziPublicService
            .trovaServizioPerSlug(slug),

          serviziPublicService
            .trovaDocumentiPubbliciPerSlug(slug)
            .catch(() => []),
        ]);

        setServizio(risultatoServizio);
        setDocumenti(risultatoDocumenti);
      } catch {
        setErrore(
          "Non è stato possibile caricare il servizio richiesto.",
        );
      } finally {
        setCaricamento(false);
      }
    };

    void caricaServizio();
  }, [slug]);

  const metadati = useMemo(() => {
    if (!servizio) return [];

    return [
      servizio.durataMinuti
        ? {
            icona: FiClock,
            etichetta: "Durata indicativa",
            valore: `${servizio.durataMinuti} min`,
          }
        : null,
      {
        icona: FiCalendar,
        etichetta: "Appuntamento",
        valore: servizio.prenotabile
          ? "Prenotabile"
          : "Accesso diretto",
      },
      {
        icona: servizio.richiedibileOnline
          ? FiGlobe
          : FiMapPin,
        etichetta: "Modalità",
        valore: servizio.richiedibileOnline
          ? "Anche online"
          : "Presso la sede",
      },
      servizio.prezzoTesto
        ? {
            icona: FiTag,
            etichetta: "Costo",
            valore: servizio.prezzoTesto,
          }
        : null,
    ].filter(
      (elemento): elemento is NonNullable<typeof elemento> =>
        elemento !== null,
    );
  }, [servizio]);

  const documentiPerTipo = useMemo(() => {
    const gruppi: Record<
      TipoObbligatorietaDocumento,
      DocumentoServizio[]
    > = {
      OBBLIGATORIO: [],
      CONDIZIONALE: [],
      FACOLTATIVO: [],
    };

    documenti.forEach((documento) => {
      gruppi[documento.tipoObbligatorieta].push(documento);
    });

    return gruppi;
  }, [documenti]);

  if (caricamento) {
    return (
      <main className="servizio-dettaglio-page">
        <section className="servizio-dettaglio-state">
          <span className="servizio-dettaglio-loader" />
          <p>Caricamento servizio...</p>
        </section>
      </main>
    );
  }

  if (errore || !servizio) {
    return (
      <main className="servizio-dettaglio-page">
        <section className="servizio-dettaglio-state">
          <FiBriefcase />
          <span>Catalogo servizi</span>
          <h1>Servizio non disponibile</h1>
          <p>
            {errore ??
              "Il servizio richiesto non è disponibile."}
          </p>
          <button
            type="button"
            onClick={() => navigate("/servizi")}
          >
            <FiArrowLeft />
            Torna ai servizi
          </button>
        </section>
      </main>
    );
  }

  const tema = ottieniTema(servizio.macroAreaNome);
  const validita = formattaData(servizio.validoFinoAl);
  return (
    <main
      className={`servizio-dettaglio-page servizio-dettaglio-page--${tema}`}
    >
      <section className="servizio-dettaglio-hero">
        <div className="servizio-dettaglio-container">
          <nav
            className="servizio-dettaglio-breadcrumb"
            aria-label="Breadcrumb"
          >
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/servizi">Servizi</Link>
            <span>/</span>
            <strong>{servizio.nome}</strong>
          </nav>

          <div className="servizio-dettaglio-hero__panel">
            <div className="servizio-dettaglio-hero__content">
              <span className="servizio-dettaglio-eyebrow">
                {servizio.macroAreaNome}
              </span>

              <h1>{servizio.nome}</h1>

              {servizio.descrizioneBreve && (
                <p className="servizio-dettaglio-lead">
                  {servizio.descrizioneBreve}
                </p>
              )}

              <div className="servizio-dettaglio-hero__actions">
                <Link
                  to="/#contatti"
                  className="servizio-dettaglio-button servizio-dettaglio-button--primary"
                >
                  {servizio.richiedibileOnline
                    ? "Avvia la richiesta"
                    : "Contatta la sede"}
                  <FiArrowRight />
                </Link>

                <a
                  href="#come-funziona"
                  className="servizio-dettaglio-button servizio-dettaglio-button--ghost"
                >
                  Come funziona
                </a>
              </div>
            </div>

            <div className="servizio-dettaglio-hero__visual">
              <button
                type="button"
                className={`servizio-dettaglio-paper-stack ${
                  postItAperto === "serve"
                    ? "servizio-dettaglio-paper-stack--switched"
                    : ""
                }`}
                aria-label={
                  postItAperto === "cose"
                    ? `Mostra a cosa serve ${servizio.nome}`
                    : `Mostra cos'è ${servizio.nome}`
                }
                aria-pressed={postItAperto === "serve"}
                onClick={() =>
                  setPostItAperto((stato) =>
                    stato === "cose" ? "serve" : "cose",
                  )
                }
                onMouseEnter={() => setPostItAperto("serve")}
                onMouseLeave={() => setPostItAperto("cose")}
              >
                <article className="servizio-dettaglio-paper servizio-dettaglio-paper--back">
                  <span className="servizio-dettaglio-paper__pin" />

                  <small>A cosa serve</small>

                  <h2>Perché può esserti utile</h2>

                  <p>
                    {servizio.aCosaServe ??
                      "Ti aiuta a gestire questa esigenza con il supporto della sede CAF."}
                  </p>

                  <span className="servizio-dettaglio-paper__hint">
                    Clicca per tornare
                  </span>
                </article>

                <article className="servizio-dettaglio-paper servizio-dettaglio-paper--main">
                  <span className="servizio-dettaglio-paper__pin" />

                  <span className="servizio-dettaglio-paper__icon">
                    <FiInfo />
                  </span>

                  <small>Cos&apos;è</small>

                  <h2>{servizio.nome}</h2>

                  <p>
                    {servizio.cosE ??
                      servizio.descrizioneBreve ??
                      "Scopri in modo semplice cos'è questo servizio e quando può esserti utile."}
                  </p>

                  <div className="servizio-dettaglio-paper__checks">
                    <span>
                      <FiCheck /> Spiegato senza tecnicismi
                    </span>

                    <span>
                      <FiCheck /> Assistenza della sede
                    </span>
                  </div>

                  <span className="servizio-dettaglio-paper__hint servizio-dettaglio-paper__hint--main">
                    Passa sopra o clicca
                  </span>
                </article>
              </button>

              <span className="servizio-dettaglio-hero__scribble" />
            </div>
          </div>

          <div className="servizio-dettaglio-meta">
            {metadati.map(
              ({ icona: Icona, etichetta, valore }) => (
                <div
                  key={etichetta}
                  className="servizio-dettaglio-meta__item"
                >
                  <Icona />
                  <span>
                    <small>{etichetta}</small>
                    <strong>{valore}</strong>
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="servizio-dettaglio-content">
        <div className="servizio-dettaglio-container">
          <section className="servizio-dettaglio-quick-guide">
            <header className="servizio-dettaglio-quick-guide__header">
              <div className="servizio-dettaglio-section-heading">
                <span className="servizio-dettaglio-section-icon">
                  <FiInfo />
                </span>
                <span>In breve</span>
              </div>

              <div>
                <h2>Capirlo in un minuto.</h2>
                <p>
                  Le informazioni essenziali, spiegate senza
                  tecnicismi.
                </p>
              </div>
            </header>

            <div className="servizio-dettaglio-quick-guide__items">
              <article>
                <span className="servizio-dettaglio-quick-guide__number">
                  01
                </span>
                <small>Cos’è</small>
                <h3>{servizio.nome}</h3>
                <p>
                  {servizio.cosE ??
                    servizio.descrizioneBreve ??
                    "Un servizio gestito dalla sede CAF FAPI di Pianopoli con assistenza dedicata."}
                </p>
              </article>

              <article>
                <span className="servizio-dettaglio-quick-guide__number">
                  02
                </span>
                <small>A cosa serve</small>
                <h3>Perché può esserti utile</h3>
                <p>
                  {servizio.aCosaServe ??
                    servizio.descrizione ??
                    "Ti permette di gestire la richiesta con il supporto della sede, evitando dubbi e passaggi poco chiari."}
                </p>
              </article>

              <article>
                <span className="servizio-dettaglio-quick-guide__number">
                  03
                </span>
                <small>A chi è rivolto</small>
                <h3>È pensato per te se...</h3>
                <p>
                  {servizio.destinatari ??
                    "Hai bisogno di assistenza per capire requisiti, documenti e modalità della richiesta."}
                </p>
              </article>
            </div>

            {servizio.requisiti && (
              <div className="servizio-dettaglio-quick-guide__note">
                <FiCheck />
                <span>
                  <small>Da sapere prima di iniziare</small>
                  <strong>{servizio.requisiti}</strong>
                </span>
              </div>
            )}
          </section>

          <section
            id="come-funziona"
            className="servizio-dettaglio-process"
          >
            <header className="servizio-dettaglio-process__header">
              <div>
                <span>Un percorso semplice</span>
                <h2>Come funziona</h2>
              </div>

              {servizio.comeFunziona && (
                <p>{servizio.comeFunziona}</p>
              )}
            </header>

            <div className="servizio-dettaglio-steps">
              <article>
                <span>01</span>
                <h3>Parlaci della tua esigenza</h3>
                <p>
                  Contatta la sede o avvia la richiesta online.
                </p>
              </article>

              <article>
                <span>02</span>
                <h3>Prepara ciò che serve</h3>
                <p>
                  Ti indicheremo dati e documenti necessari.
                </p>
              </article>

              <article>
                <span>03</span>
                <h3>Segui la lavorazione</h3>
                <p>
                  {servizio.generaPratica
                    ? "La richiesta diventa una pratica tracciabile."
                    : "La sede completa il servizio insieme a te."}
                </p>
              </article>
            </div>
          </section>

          {servizio.richiedeDocumenti && (
            <section
              id="documenti"
              className="servizio-dettaglio-documents"
            >
              <header className="servizio-dettaglio-documents__header">
                <div className="servizio-dettaglio-documents__intro">
                  <span className="servizio-dettaglio-documents__icon">
                    <FiFileText />
                  </span>

                  <div>
                    <span className="servizio-dettaglio-documents__eyebrow">
                      Documentazione
                    </span>

                    <h2>Cosa portare con te.</h2>

                    <p>
                      Qui trovi la checklist iniziale del servizio.
                      I documenti condizionali servono solo quando
                      la tua situazione li rende necessari.
                    </p>
                  </div>
                </div>

                {documenti.length > 0 && (
                  <div className="servizio-dettaglio-documents__total">
                    <strong>{documenti.length}</strong>
                    <span>
                      {documenti.length === 1
                        ? "documento"
                        : "documenti"}
                    </span>
                  </div>
                )}
              </header>

              {documenti.length > 0 ? (
                <div className="servizio-dettaglio-document-groups">
                  {(
                    [
                      {
                        tipo: "OBBLIGATORIO",
                        titolo: "Da portare",
                        descrizione:
                          "Sono i documenti normalmente necessari per avviare la pratica.",
                      },
                      {
                        tipo: "CONDIZIONALE",
                        titolo: "Solo se riguarda il tuo caso",
                        descrizione:
                          "Servono soltanto in presenza della situazione indicata.",
                      },
                      {
                        tipo: "FACOLTATIVO",
                        titolo: "Utili, ma non sempre necessari",
                        descrizione:
                          "Possono aiutare la lavorazione, ma non sono richiesti in ogni caso.",
                      },
                    ] as const
                  ).map(({ tipo, titolo, descrizione }) => {
                    const elenco = documentiPerTipo[tipo];

                    if (elenco.length === 0) {
                      return null;
                    }

                    return (
                      <details
                        key={tipo}
                        className={`servizio-dettaglio-document-group servizio-dettaglio-document-group--${tipo.toLowerCase()}`}
                        open={tipo === "OBBLIGATORIO"}
                      >
                        <summary>
                          <div className="servizio-dettaglio-document-group__summary-copy">
                            <span
                              className={`servizio-dettaglio-document-badge servizio-dettaglio-document-badge--${tipo.toLowerCase()}`}
                            >
                              {tipo === "OBBLIGATORIO"
                                ? "Obbligatori"
                                : tipo === "CONDIZIONALE"
                                  ? "Condizionali"
                                  : "Facoltativi"}
                            </span>

                            <div>
                              <h3>{titolo}</h3>
                              <p>{descrizione}</p>
                            </div>
                          </div>

                          <div className="servizio-dettaglio-document-group__summary-meta">
                            <span>{elenco.length}</span>
                            <FiChevronDown />
                          </div>
                        </summary>

                        <div className="servizio-dettaglio-document-list">
                          {elenco.map((documento) => (
                            <article
                              key={documento.id}
                              className="servizio-dettaglio-document-item"
                            >
                              <span className="servizio-dettaglio-document-item__check">
                                <FiCheck />
                              </span>

                              <div className="servizio-dettaglio-document-item__content">
                                <h4>{documento.etichetta}</h4>

                                {documento.suggerimento && (
                                  <p>{documento.suggerimento}</p>
                                )}
                              </div>
                            </article>
                          ))}
                        </div>
                      </details>
                    );
                  })}
                </div>
              ) : (
                <div className="servizio-dettaglio-documents__empty">
                  <FiInfo />

                  <div>
                    <strong>
                      La checklist verrà definita con la sede.
                    </strong>

                    <p>
                      Per questo servizio sono previsti documenti,
                      ma al momento non ci sono elementi pubblici
                      configurati.
                    </p>
                  </div>
                </div>
              )}

              <div className="servizio-dettaglio-documents__note">
                <FiInfo />
                <p>
                  L&apos;elenco è indicativo: in base alla tua situazione
                  la sede può richiedere documentazione aggiuntiva o
                  confermare che alcune voci non sono necessarie.
                </p>
              </div>
            </section>
          )}

          {(servizio.notaPrezzo || validita) && (
            <section className="servizio-dettaglio-notes">
              {servizio.notaPrezzo && (
                <div>
                  <FiTag />
                  <span>
                    <small>Informazioni sul costo</small>
                    <strong>{servizio.notaPrezzo}</strong>
                  </span>
                </div>
              )}

              {validita && (
                <div>
                  <FiCalendar />
                  <span>
                    <small>Valido fino al</small>
                    <strong>{validita}</strong>
                  </span>
                </div>
              )}
            </section>
          )}

          <section className="servizio-dettaglio-final-cta">
            <div>
              <span>Vuoi procedere?</span>
              <h2>Iniziamo da qui.</h2>
              <p>
                Raccontaci di cosa hai bisogno: ti guideremo
                nella richiesta, senza passaggi complicati.
              </p>
            </div>

            <Link to="/#contatti">
              {servizio.prenotabile
                ? "Prenota un appuntamento"
                : "Contatta la sede"}
              <FiArrowRight />
            </Link>
          </section>
        </div>
      </section>
    </main>
  );
};

export default DettaglioServizioPublicPage;