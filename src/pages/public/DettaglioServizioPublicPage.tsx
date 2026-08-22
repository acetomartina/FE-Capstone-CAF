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
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiGlobe,
  FiHelpCircle,
  FiInfo,
  FiLayers,
  FiTag,
  FiUser,
  FiUsers,
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
  ServizioCatalogo,
} from "../../features/servizi/types/serviziTypes";

import "./DettaglioServizioPublicPage.css";

const formattaData = (
  valore: string | null,
): string => {
  if (!valore) {
    return "Nessuna scadenza indicata";
  }

  return new Intl.DateTimeFormat(
    "it-IT",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    },
  ).format(
    new Date(`${valore}T00:00:00`),
  );
};

const DettaglioServizioPublicPage = () => {
  const { slug } =
    useParams<{ slug: string }>();

  const navigate =
    useNavigate();

  const [
    servizio,
    setServizio,
  ] = useState<ServizioCatalogo | null>(
    null,
  );

  const [
    caricamento,
    setCaricamento,
  ] = useState(true);

  const [
    errore,
    setErrore,
  ] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const caricaServizio =
      async () => {
        if (!slug) {
          setErrore(
            "Servizio non valido.",
          );

          setCaricamento(false);

          return;
        }

        try {
          setCaricamento(true);
          setErrore(null);

          const risultato =
            await serviziPublicService
              .trovaServizioPerSlug(
                slug,
              );

          setServizio(
            risultato,
          );
        } catch {
          setErrore(
            "Non è stato possibile caricare il servizio richiesto.",
          );
        } finally {
          setCaricamento(
            false,
          );
        }
      };

    void caricaServizio();
  }, [slug]);

  const metadati =
    useMemo(() => {
      if (!servizio) {
        return [];
      }

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
          etichetta: "Prenotazione",
          valore:
            servizio.prenotabile
              ? "Disponibile"
              : "Non richiesta",
        },

        {
          icona: FiGlobe,
          etichetta: "Richiesta online",
          valore:
            servizio.richiedibileOnline
              ? "Disponibile"
              : "Solo in sede",
        },

        servizio.prezzoTesto
          ? {
              icona: FiTag,
              etichetta: "Costo",
              valore:
                servizio.prezzoTesto,
            }
          : null,
      ].filter(
        (
          elemento,
        ): elemento is {
          icona: typeof FiClock;
          etichetta: string;
          valore: string;
        } => elemento !== null,
      );
    }, [servizio]);

  if (caricamento) {
    return (
      <main className="servizio-dettaglio-page">
        <section className="servizio-dettaglio-state">
          <span className="servizio-dettaglio-loader" />

          <p>
            Caricamento servizio...
          </p>
        </section>
      </main>
    );
  }

  if (
    errore ||
    !servizio
  ) {
    return (
      <main className="servizio-dettaglio-page">
        <section className="servizio-dettaglio-state">
          <FiBriefcase />

          <h1>
            Servizio non disponibile
          </h1>

          <p>
            {errore ??
              "Il servizio richiesto non è disponibile."}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/servizi",
              )
            }
          >
            <FiArrowLeft />

            Torna ai servizi
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="servizio-dettaglio-page">
      <section className="servizio-dettaglio-hero">
        <div className="servizio-dettaglio-container">
          <nav
            className="servizio-dettaglio-breadcrumb"
            aria-label="Breadcrumb"
          >
            <Link to="/">
              Home
            </Link>

            <span>/</span>

            <Link to="/servizi">
              Servizi
            </Link>

            <span>/</span>

            <strong>
              {
                servizio.nome
              }
            </strong>
          </nav>

          <div className="servizio-dettaglio-hero__grid">
            <div className="servizio-dettaglio-hero__content">
              <span className="servizio-dettaglio-eyebrow">
                {
                  servizio.macroAreaNome
                }
              </span>

              <h1>
                {
                  servizio.nome
                }
              </h1>

              {servizio.descrizioneBreve && (
                <p className="servizio-dettaglio-lead">
                  {
                    servizio.descrizioneBreve
                  }
                </p>
              )}

              <div className="servizio-dettaglio-badges">
                {servizio.inEvidenza && (
                  <span className="servizio-dettaglio-badge servizio-dettaglio-badge--evidenza">
                    <FiCheckCircle />

                    In evidenza
                  </span>
                )}

                {servizio.prenotabile && (
                  <span className="servizio-dettaglio-badge">
                    Prenotabile
                  </span>
                )}

                {servizio.richiedibileOnline && (
                  <span className="servizio-dettaglio-badge">
                    Richiedibile online
                  </span>
                )}

                {servizio.richiedeDocumenti && (
                  <span className="servizio-dettaglio-badge">
                    Documenti richiesti
                  </span>
                )}
              </div>
            </div>

            <aside className="servizio-dettaglio-summary">
              <span className="servizio-dettaglio-summary__icon">
                <FiFileText />
              </span>

              <h2>
                Informazioni rapide
              </h2>

              <div className="servizio-dettaglio-summary__items">
                {metadati.map(
                  ({
                    icona:
                      Icona,
                    etichetta,
                    valore,
                  }) => (
                    <div
                      key={
                        etichetta
                      }
                    >
                      <Icona />

                      <span>
                        {
                          etichetta
                        }

                        <strong>
                          {
                            valore
                          }
                        </strong>
                      </span>
                    </div>
                  ),
                )}
              </div>

              <Link
                to="/#contatti"
                className="servizio-dettaglio-summary__cta"
              >
                Richiedi informazioni

                <FiArrowRight />
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <section className="servizio-dettaglio-content">
        <div className="servizio-dettaglio-container servizio-dettaglio-content__grid">
          <div className="servizio-dettaglio-main">
            {servizio.descrizione && (
              <article className="servizio-dettaglio-block">
                <div className="servizio-dettaglio-block__icon">
                  <FiInfo />
                </div>

                <div>
                  <span>
                    Panoramica
                  </span>

                  <h2>
                    Il servizio
                  </h2>

                  <p>
                    {
                      servizio.descrizione
                    }
                  </p>
                </div>
              </article>
            )}

            {servizio.destinatari && (
              <article className="servizio-dettaglio-block">
                <div className="servizio-dettaglio-block__icon servizio-dettaglio-block__icon--blue">
                  <FiUsers />
                </div>

                <div>
                  <span>
                    Destinatari
                  </span>

                  <h2>
                    A chi è rivolto
                  </h2>

                  <p>
                    {
                      servizio.destinatari
                    }
                  </p>
                </div>
              </article>
            )}

            {servizio.requisiti && (
              <article className="servizio-dettaglio-block">
                <div className="servizio-dettaglio-block__icon servizio-dettaglio-block__icon--orange">
                  <FiCheckCircle />
                </div>

                <div>
                  <span>
                    Cosa serve
                  </span>

                  <h2>
                    Requisiti
                  </h2>

                  <p>
                    {
                      servizio.requisiti
                    }
                  </p>
                </div>
              </article>
            )}

            {servizio.comeFunziona && (
              <article className="servizio-dettaglio-block">
                <div className="servizio-dettaglio-block__icon servizio-dettaglio-block__icon--purple">
                  <FiBriefcase />
                </div>

                <div>
                  <span>
                    Procedura
                  </span>

                  <h2>
                    Come funziona
                  </h2>

                  <p>
                    {
                      servizio.comeFunziona
                    }
                  </p>
                </div>
              </article>
            )}

            <section className="servizio-dettaglio-feature-grid">
              <article className="servizio-dettaglio-feature-card">
                <span className="servizio-dettaglio-feature-card__icon">
                  <FiLayers />
                </span>

                <small>
                  Gestione
                </small>

                <h2>
                  Come viene gestito
                </h2>

                <ul>
                  <li>
                    <FiCheckCircle />

                    {servizio.generaPratica
                      ? "Il servizio genera una pratica dedicata."
                      : "Il servizio non richiede l'apertura di una pratica."}
                  </li>

                  <li>
                    <FiCheckCircle />

                    {servizio.richiedeDocumenti
                      ? "È prevista la raccolta di documentazione."
                      : "Non è prevista documentazione obbligatoria."}
                  </li>

                  <li>
                    <FiCheckCircle />

                    Servizio attualmente attivo.
                  </li>
                </ul>
              </article>

              <article className="servizio-dettaglio-feature-card">
                <span className="servizio-dettaglio-feature-card__icon servizio-dettaglio-feature-card__icon--blue">
                  <FiGlobe />
                </span>

                <small>
                  Modalità
                </small>

                <h2>
                  Dove puoi richiederlo
                </h2>

                <ul>
                  <li>
                    <FiCheckCircle />

                    Assistenza disponibile presso la sede.
                  </li>

                  <li>
                    <FiCheckCircle />

                    {servizio.prenotabile
                      ? "Puoi prenotare un appuntamento."
                      : "Non è necessaria una prenotazione."}
                  </li>

                  <li>
                    <FiCheckCircle />

                    {servizio.richiedibileOnline
                      ? "Puoi avviare la richiesta anche online."
                      : "La richiesta viene gestita in sede."}
                  </li>
                </ul>
              </article>
            </section>

            {servizio.richiedeDocumenti && (
              <article className="servizio-dettaglio-preparazione">
                <div className="servizio-dettaglio-preparazione__icon">
                  <FiFileText />
                </div>

                <div>
                  <span>
                    Prima di iniziare
                  </span>

                  <h2>
                    Prepara la documentazione
                  </h2>

                  <p>
                    Per questo servizio è prevista
                    la raccolta di documenti.
                    Preparare in anticipo la
                    documentazione necessaria
                    permette di velocizzare la
                    lavorazione della pratica.
                  </p>

                  <p>
                    La sede ti indicherà quali
                    documenti servono in base alla
                    tua situazione specifica.
                  </p>
                </div>
              </article>
            )}

            {servizio.partnerId !==
              null && (
              <article className="servizio-dettaglio-partner">
                <span className="servizio-dettaglio-partner__icon">
                  <FiUser />
                </span>

                <div>
                  <span>
                    Partner convenzionato
                  </span>

                  <h2>
                    Servizio in collaborazione
                  </h2>

                  <p>
                    Questo servizio viene erogato
                    con il supporto di un partner
                    convenzionato con la sede CAF
                    FAPI Pianopoli.
                  </p>

                  <small>
                    Nome, logo e informazioni del
                    partner verranno mostrati qui
                    quando completeremo
                    l'anagrafica partner.
                  </small>
                </div>
              </article>
            )}

            {servizio.notaPrezzo && (
              <article className="servizio-dettaglio-block">
                <div className="servizio-dettaglio-block__icon servizio-dettaglio-block__icon--fuchsia">
                  <FiTag />
                </div>

                <div>
                  <span>
                    Costi
                  </span>

                  <h2>
                    Informazioni sul prezzo
                  </h2>

                  <p>
                    {
                      servizio.notaPrezzo
                    }
                  </p>
                </div>
              </article>
            )}

            <section className="servizio-dettaglio-faq">
              <header className="servizio-dettaglio-faq__header">
                <span className="servizio-dettaglio-faq__icon">
                  <FiHelpCircle />
                </span>

                <div>
                  <small>
                    Domande frequenti
                  </small>

                  <h2>
                    Cosa sapere prima di richiederlo
                  </h2>
                </div>
              </header>

              <div className="servizio-dettaglio-faq__items">
                <article>
                  <h3>
                    Posso richiedere il servizio online?
                  </h3>

                  <p>
                    {servizio.richiedibileOnline
                      ? "Sì. Questo servizio può essere avviato anche online. La sede potrà comunque contattarti se saranno necessari ulteriori dati o documenti."
                      : "Al momento questo servizio viene gestito direttamente dalla sede. Puoi contattarci per conoscere modalità e disponibilità."}
                  </p>
                </article>

                <article>
                  <h3>
                    È possibile prenotare?
                  </h3>

                  <p>
                    {servizio.prenotabile
                      ? "Sì. Puoi contattare la sede per concordare un appuntamento ed evitare attese."
                      : "Per questo servizio non è prevista una prenotazione obbligatoria. Contatta comunque la sede se vuoi verificare la disponibilità."}
                  </p>
                </article>

                <article>
                  <h3>
                    Devo portare dei documenti?
                  </h3>

                  <p>
                    {servizio.richiedeDocumenti
                      ? "Sì. La documentazione richiesta può variare in base alla tua situazione. La sede ti indicherà l'elenco corretto prima dell'avvio della pratica."
                      : "Non risultano documenti obbligatori associati al servizio. La sede potrà comunque richiedere informazioni aggiuntive se necessario."}
                  </p>
                </article>
              </div>
            </section>

            <section className="servizio-dettaglio-final-cta">
              <div>
                <small>
                  Vuoi procedere?
                </small>

                <h2>
                  Siamo qui per aiutarti.
                </h2>

                <p>
                  Contatta CAF FAPI Pianopoli per
                  verificare disponibilità,
                  documentazione necessaria e
                  modalità di richiesta del
                  servizio.
                </p>
              </div>

              <Link to="/#contatti">
                Contatta la sede

                <FiArrowRight />
              </Link>
            </section>
          </div>

          <aside className="servizio-dettaglio-sidebar">
            <section className="servizio-dettaglio-cta">
              <span>
                Hai bisogno di questo
                servizio?
              </span>

              <h2>
                Parliamone.
              </h2>

              <p>
                Contatta CAF FAPI Pianopoli
                per informazioni,
                disponibilità e
                documentazione necessaria.
              </p>

              <Link to="/#contatti">
                Contattaci

                <FiArrowRight />
              </Link>
            </section>

            <section className="servizio-dettaglio-side-card">
              <h3>
                Riepilogo
              </h3>

              <dl>
                <div>
                  <dt>
                    Categoria
                  </dt>

                  <dd>
                    {
                      servizio.macroAreaNome
                    }
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
                    Online
                  </dt>

                  <dd>
                    {servizio.richiedibileOnline
                      ? "Sì"
                      : "No"}
                  </dd>
                </div>

                <div>
                  <dt>
                    Documenti
                  </dt>

                  <dd>
                    {servizio.richiedeDocumenti
                      ? "Richiesti"
                      : "Non richiesti"}
                  </dd>
                </div>

                {servizio.durataMinuti && (
                  <div>
                    <dt>
                      Durata
                    </dt>

                    <dd>
                      {
                        servizio.durataMinuti
                      }{" "}
                      min
                    </dd>
                  </div>
                )}

                <div>
                  <dt>
                    Validità
                  </dt>

                  <dd>
                    {formattaData(
                      servizio.validoFinoAl,
                    )}
                  </dd>
                </div>
              </dl>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default DettaglioServizioPublicPage;