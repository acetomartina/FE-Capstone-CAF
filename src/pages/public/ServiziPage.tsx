import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  IconType,
} from "react-icons";

import {
  FiArrowRight,
  FiBriefcase,
  FiCheck,
  FiCreditCard,
  FiFileText,
  FiGrid,
  FiMonitor,
  FiPhone,
  FiTruck,
  FiZap,
} from "react-icons/fi";

import {
  Link,
  useLocation,
} from "react-router-dom";

import {
  serviziPublicService,
} from "../../features/servizi/api/serviziPublicService";

import type {
  MacroArea,
  ServizioCatalogo,
} from "../../features/servizi/types/serviziTypes";

import "./ServiziPage.css";

const ICONE_MACROAREA: Record<
  string,
  IconType
> = {
  "caf-fiscale": FiFileText,
  "energia-gas": FiZap,
  telefonia: FiPhone,
  finanziamenti: FiCreditCard,
  mobilita: FiTruck,
  "servizi-digitali": FiMonitor,
};

const trovaIcona = (
  slug: string,
): IconType => {
  return (
    ICONE_MACROAREA[slug] ??
    FiGrid
  );
};

const ServiziPage = () => {
  const location =
    useLocation();

  const [
    macroAree,
    setMacroAree,
  ] = useState<MacroArea[]>([]);

  const [
    servizi,
    setServizi,
  ] = useState<ServizioCatalogo[]>([]);

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
    const caricaCatalogo =
      async () => {
        try {
          setCaricamento(true);
          setErrore(null);

          const [
            elencoMacroAree,
            elencoServizi,
          ] = await Promise.all([
            serviziPublicService
              .trovaMacroAree(),

            serviziPublicService
              .trovaServizi(),
          ]);

          setMacroAree(
            [...elencoMacroAree].sort(
              (a, b) =>
                a.ordineVisualizzazione -
                b.ordineVisualizzazione,
            ),
          );

          setServizi(
            [...elencoServizi].sort(
              (a, b) =>
                a.ordineVisualizzazione -
                b.ordineVisualizzazione,
            ),
          );
        } catch {
          setErrore(
            "Non è stato possibile caricare i servizi disponibili.",
          );
        } finally {
          setCaricamento(false);
        }
      };

    void caricaCatalogo();
  }, []);

  /*
   * Gli elementi con gli id delle macroaree
   * vengono creati soltanto dopo il caricamento
   * API. Per questo gestiamo lo scroll all'hash
   * dopo che i dati sono disponibili.
   */
  useEffect(() => {
    if (
      caricamento ||
      macroAree.length === 0 ||
      !location.hash
    ) {
      return;
    }

    const id =
      decodeURIComponent(
        location.hash.substring(1),
      );

    const timer =
      window.setTimeout(
        () => {
          const elemento =
            document.getElementById(
              id,
            );

          elemento?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        },
        100,
      );

    return () =>
      window.clearTimeout(timer);
  }, [
    caricamento,
    location.hash,
    macroAree,
  ]);

  const serviziPerMacroArea =
    useMemo(() => {
      const mappa =
        new Map<
          number,
          ServizioCatalogo[]
        >();

      macroAree.forEach(
        (macroArea) => {
          mappa.set(
            macroArea.id,
            servizi.filter(
              (servizio) =>
                servizio.macroAreaId ===
                macroArea.id,
            ),
          );
        },
      );

      return mappa;
    }, [
      macroAree,
      servizi,
    ]);

  return (
    <main className="servizi-page">
      <section className="servizi-page__hero">
        <div className="servizi-page__hero-content">
          <span className="servizi-page__eyebrow">
            I nostri servizi
          </span>

          <h1>
            Tutto ciò che ti serve,
            <span>
              {" "}
              in un unico posto.
            </span>
          </h1>

          <p>
            Scopri i servizi disponibili
            presso CAF FAPI Pianopoli.
            Dall'assistenza fiscale alle
            utenze, dai finanziamenti ai
            servizi digitali.
          </p>
        </div>
      </section>

      {caricamento ? (
        <section className="servizi-page__state">
          <span className="servizi-page__loader" />

          <p>
            Caricamento servizi...
          </p>
        </section>
      ) : errore ? (
        <section className="servizi-page__state">
          <FiBriefcase />

          <h2>
            Qualcosa non ha funzionato
          </h2>

          <p>
            {errore}
          </p>
        </section>
      ) : (
        <>
          <nav
            className="servizi-page__navigation"
            aria-label="Categorie servizi"
          >
            <div className="servizi-page__container">
              {macroAree.map(
                (macroArea) => {
                  const Icona =
                    trovaIcona(
                      macroArea.slug,
                    );

                  return (
                    <a
                      key={
                        macroArea.id
                      }
                      href={`#${macroArea.slug}`}
                    >
                      <Icona
                        aria-hidden="true"
                      />

                      {
                        macroArea.nome
                      }
                    </a>
                  );
                },
              )}
            </div>
          </nav>

          <div className="servizi-page__container servizi-page__catalogo">
            {macroAree.map(
              (
                macroArea,
                indice,
              ) => {
                const Icona =
                  trovaIcona(
                    macroArea.slug,
                  );

                const elenco =
                  serviziPerMacroArea.get(
                    macroArea.id,
                  ) ?? [];

                return (
                  <section
                    key={
                      macroArea.id
                    }
                    id={
                      macroArea.slug
                    }
                    className="servizi-macroarea"
                  >
                    <header className="servizi-macroarea__header">
                      <div
                        className={`servizi-macroarea__icon servizi-macroarea__icon--${(indice % 6) + 1}`}
                      >
                        <Icona
                          aria-hidden="true"
                        />
                      </div>

                      <div>
                        <span>
                          Area{" "}
                          {String(
                            indice + 1,
                          ).padStart(
                            2,
                            "0",
                          )}
                        </span>

                        <h2>
                          {
                            macroArea.nome
                          }
                        </h2>

                        {macroArea.descrizioneBreve && (
                          <p>
                            {
                              macroArea.descrizioneBreve
                            }
                          </p>
                        )}
                      </div>
                    </header>

                    {elenco.length ===
                    0 ? (
                      <div className="servizi-macroarea__empty">
                        Nessun servizio
                        disponibile al
                        momento.
                      </div>
                    ) : (
                      <div className="servizi-macroarea__grid">
                        {elenco.map(
                          (
                            servizio,
                          ) => (
                            <article
                              key={
                                servizio.id
                              }
                              className="servizio-public-card"
                            >
                              <div className="servizio-public-card__top">
                                <span>
                                  <FiCheck />
                                </span>

                                {servizio.inEvidenza && (
                                  <small>
                                    In evidenza
                                  </small>
                                )}
                              </div>

                              <h3>
                                {
                                  servizio.nome
                                }
                              </h3>

                              <p>
                                {servizio.descrizioneBreve ??
                                  "Contattaci per maggiori informazioni su questo servizio."}
                              </p>

                              <div className="servizio-public-card__tags">
                                {servizio.prenotabile && (
                                  <span>
                                    Prenotabile
                                  </span>
                                )}

                                {servizio.richiedibileOnline && (
                                  <span>
                                    Online
                                  </span>
                                )}
                              </div>

                              <div className="servizio-public-card__footer">
                                {servizio.prezzoTesto ? (
                                  <strong>
                                    {
                                      servizio.prezzoTesto
                                    }
                                  </strong>
                                ) : (
                                  <span>
                                    Informazioni
                                    in sede
                                  </span>
                                )}

                                <Link
                                  to="/contatti"
                                  aria-label={`Richiedi informazioni su ${servizio.nome}`}
                                >
                                  Informazioni

                                  <FiArrowRight
                                    aria-hidden="true"
                                  />
                                </Link>
                              </div>
                            </article>
                          ),
                        )}
                      </div>
                    )}
                  </section>
                );
              },
            )}
          </div>
        </>
      )}
    </main>
  );
};

export default ServiziPage;