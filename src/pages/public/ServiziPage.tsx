import { useEffect, useMemo, useState } from "react";

import type {
  IconType,
} from "react-icons";

import {
  FiArrowRight,
  FiBriefcase,
  FiCreditCard,
  FiFileText,
  FiGrid,
  FiInfo,
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
  Servizio,
} from "../../features/servizi/types/serviziTypes";

import ServicePostIt from "../../components/common/ServicePostIt/ServicePostIt";

import "./ServiziPage.css";

const ICONE_MACROAREA: Record<string, IconType> = {
  "caf-e-fiscale": FiFileText,
  "energia-e-gas": FiZap,
  "telefonia-e-internet": FiPhone,
  finanziamenti: FiCreditCard,
  "mobilita-e-logistica": FiTruck,
  "servizi-digitali": FiMonitor,
};

const trovaIcona = (
  slug: string,
): IconType => {
  return ICONE_MACROAREA[slug] ?? FiGrid;
};

const ServiziPage = () => {
  const location = useLocation();

  const [
    macroAree,
    setMacroAree,
  ] = useState<MacroArea[]>([]);

  const [
    servizi,
    setServizi,
  ] = useState<Servizio[]>([]);

  const [
    caricamento,
    setCaricamento,
  ] = useState(true);

  const [
    errore,
    setErrore,
  ] = useState<string | null>(null);

  useEffect(() => {
    const caricaCatalogo = async () => {
      try {
        setCaricamento(true);
        setErrore(null);

        const [
          elencoMacroAree,
          elencoServizi,
        ] = await Promise.all([
          serviziPublicService.trovaMacroAree(),
          serviziPublicService.trovaServizi(),
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

  useEffect(() => {
    if (
      caricamento ||
      macroAree.length === 0 ||
      !location.hash
    ) {
      return;
    }

    const id = decodeURIComponent(
      location.hash.substring(1),
    );

    const timer = window.setTimeout(
      () => {
        const elemento =
          document.getElementById(id);

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
          Servizio[]
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

  const serviziInEvidenza =
    useMemo(
      () =>
        servizi
          .filter(
            (servizio) =>
              servizio.inEvidenza,
          )
          .slice(0, 3),
      [servizi],
    );

  return (
    <main className="servizi-page">
      <section className="servizi-page__hero">
        <div className="servizi-page__container servizi-page__hero-grid">
          <div className="servizi-page__hero-content">
            <span className="servizi-page__eyebrow">
              CAF FAPI Pianopoli
            </span>

            <h1>
              Non devi sapere
              <span> da dove iniziare.</span>
            </h1>

            <p>
              Raccontaci cosa devi fare. Qui puoi orientarti
              tra pratiche fiscali, previdenza, utenze,
              finanziamenti e servizi digitali senza perderti
              tra sigle e procedure.
            </p>

            <div className="servizi-page__hero-actions">
              <a
                href="#aree-servizi"
                className="servizi-page__hero-button servizi-page__hero-button--primary"
              >
                Trova il servizio
                <FiArrowRight aria-hidden="true" />
              </a>

              <Link
                to="/contatti"
                className="servizi-page__hero-button servizi-page__hero-button--ghost"
              >
                Chiedi alla sede
              </Link>
            </div>
          </div>
          <ServicePostIt
            ariaLabelFront="Mostra come orientarti tra i servizi"
            ariaLabelBack="Torna al primo foglio"
            front={{
              eyebrow: "Non sai quale scegliere?",
              title: "Parti dall’esigenza.",
              description:
                "Scegli l’area che assomiglia di più a quello che devi fare.",
              icon: FiInfo,
              checks: [
                "Spiegazioni senza tecnicismi",
                "Assistenza della sede",
              ],
            }}
            back={{
              eyebrow: "Dentro ogni servizio",
              title: "Sai subito cosa serve.",
              description:
                "Trovi una spiegazione semplice e i documenti da preparare prima di iniziare.",
              checks: [
                "Checklist dei documenti",
                "Indicazioni chiare",
              ],
            }}
          />
        </div>
      </section>

      {caricamento ? (
        <section className="servizi-page__state">
          <span className="servizi-page__loader" />
          <p>Caricamento servizi...</p>
        </section>
      ) : errore ? (
        <section className="servizi-page__state">
          <FiBriefcase />
          <h2>Qualcosa non ha funzionato</h2>
          <p>{errore}</p>
        </section>
      ) : (
        <>
          {serviziInEvidenza.length > 0 && (
            <section className="servizi-page__featured">
              <div className="servizi-page__container">
                <div className="servizi-page__featured-heading">
                  <span>Più richiesti</span>
                  <p>
                    Alcuni dei servizi che gestiamo più spesso
                    in sede.
                  </p>
                </div>

                <div className="servizi-page__featured-grid">
                  {serviziInEvidenza.map(
                    (
                      servizio,
                      indice,
                    ) => (
                      <Link
                        key={servizio.id}
                        to={`/servizi/${servizio.slug}`}
                        className={`servizi-page__featured-card servizi-page__featured-card--${indice + 1}`}
                      >
                        <span className="servizi-page__featured-number">
                          {String(
                            indice + 1,
                          ).padStart(
                            2,
                            "0",
                          )}
                        </span>

                        <small>
                          {servizio.macroAreaNome}
                        </small>

                        <h2>{servizio.nome}</h2>

                        <p>
                          {servizio.descrizioneBreve ??
                            "Scopri come funziona il servizio e cosa preparare."}
                        </p>

                        <span className="servizi-page__featured-link">
                          Scopri il servizio
                          <FiArrowRight />
                        </span>
                      </Link>
                    ),
                  )}
                </div>
              </div>
            </section>
          )}

          <section
            id="aree-servizi"
            className="servizi-page__areas-intro"
          >
            <div className="servizi-page__container">
              <div className="servizi-page__areas-copy">
                <span>Orientati per area</span>

                <h2>
                  Che cosa devi fare?
                </h2>

                <p>
                  Abbiamo raggruppato i servizi per esigenza,
                  così puoi arrivare più velocemente alla
                  pratica giusta.
                </p>
              </div>
            </div>
          </section>

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
                      key={macroArea.id}
                      href={`#${macroArea.slug}`}
                    >
                      <Icona aria-hidden="true" />
                      {macroArea.nome}
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
                    key={macroArea.id}
                    id={macroArea.slug}
                    className={`servizi-macroarea servizi-macroarea--${(indice % 6) + 1}`}
                  >
                    <div className="servizi-macroarea__side">
                      <span className="servizi-macroarea__index">
                        {String(
                          indice + 1,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </span>

                      <div className="servizi-macroarea__icon">
                        <Icona aria-hidden="true" />
                      </div>

                      <span className="servizi-macroarea__label">
                        Area servizi
                      </span>

                      <h2>
                        {macroArea.nome}
                      </h2>

                      {macroArea.descrizioneBreve && (
                        <p>
                          {macroArea.descrizioneBreve}
                        </p>
                      )}

                      <span className="servizi-macroarea__count">
                        {elenco.length}{" "}
                        {elenco.length === 1
                          ? "servizio"
                          : "servizi"}
                      </span>
                    </div>

                    <div className="servizi-macroarea__content">
                      {elenco.length === 0 ? (
                        <div className="servizi-macroarea__empty">
                          Nessun servizio disponibile al momento.
                        </div>
                      ) : (
                        <div className="servizi-macroarea__list">
                          {elenco.map(
                            (
                              servizio,
                              servizioIndex,
                            ) => (
                              <Link
                                key={servizio.id}
                                to={`/servizi/${servizio.slug}`}
                                className="servizio-public-row"
                                aria-label={`Scopri il servizio ${servizio.nome}`}
                              >
                                <span className="servizio-public-row__number">
                                  {String(
                                    servizioIndex + 1,
                                  ).padStart(
                                    2,
                                    "0",
                                  )}
                                </span>

                                <div className="servizio-public-row__copy">
                                  <div className="servizio-public-row__title-line">
                                    <h3>
                                      {servizio.nome}
                                    </h3>

                                    {servizio.inEvidenza && (
                                      <small>
                                        In evidenza
                                      </small>
                                    )}
                                  </div>

                                  <p>
                                    {servizio.descrizioneBreve ??
                                      "Contattaci per maggiori informazioni su questo servizio."}
                                  </p>

                                  <div className="servizio-public-row__meta">
                                    {servizio.prenotabile && (
                                      <span>
                                        Prenotabile
                                      </span>
                                    )}

                                    {servizio.richiedibileOnline && (
                                      <span>
                                        Anche online
                                      </span>
                                    )}

                                    {servizio.richiedeDocumenti && (
                                      <span>
                                        Checklist documenti
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <span className="servizio-public-row__arrow">
                                  <FiArrowRight />
                                </span>
                              </Link>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  </section>
                );
              },
            )}
          </div>

          <section className="servizi-page__closing">
            <div className="servizi-page__container">
              <div className="servizi-page__closing-card">
                <div>
                  <span>
                    Non trovi quello che cerchi?
                  </span>

                  <h2>
                    Chiedilo direttamente alla sede.
                  </h2>

                  <p>
                    Ti aiutiamo a capire quale servizio è
                    adatto alla tua situazione prima ancora
                    di iniziare la pratica.
                  </p>
                </div>

                <Link to="/contatti">
                  Contattaci
                  <FiArrowRight />
                </Link>
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
};

export default ServiziPage;