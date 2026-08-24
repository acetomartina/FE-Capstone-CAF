import {
  useEffect,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  FiArrowLeft,
  FiCheck,
  FiMap,
  FiSettings,
} from "react-icons/fi";

import {
  useCookieConsent,
} from "../../components/common/CookieConsent/CookieConsentContext";

import "./LegalPage.css";

const CookiePolicyPage = () => {
  const {
    resetConsent,
  } = useCookieConsent();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, []);

  return (
    <main className="legal-page">
      <section className="legal-page__hero">
        <div className="legal-page__container">
          <Link
            to="/"
            className="legal-page__back"
          >
            <FiArrowLeft aria-hidden="true" />
            Torna alla Home
          </Link>

          <span className="legal-page__eyebrow">
            Cookie
          </span>

          <h1>
            Cookie Policy
          </h1>

          <p>
            Qui trovi informazioni sull'utilizzo di cookie,
            preferenze locali e servizi esterni presenti
            sul sito.
          </p>

          <span className="legal-page__updated">
            Ultimo aggiornamento: 24 agosto 2026
          </span>
        </div>
      </section>

      <section className="legal-page__content">
        <div className="legal-page__container legal-page__layout">
          <aside className="legal-page__aside">
            <div className="legal-page__aside-card">
              <FiSettings aria-hidden="true" />

              <span>
                La tua scelta
              </span>

              <p>
                Puoi modificare in qualsiasi momento
                la scelta relativa ai servizi esterni.
              </p>

              <button
                type="button"
                onClick={resetConsent}
              >
                Modifica preferenze
              </button>
            </div>
          </aside>

          <article className="legal-page__article">
            <section>
              <span className="legal-page__number">
                01
              </span>

              <h2>
                Cosa sono i cookie
              </h2>

              <p>
                I cookie sono piccole informazioni che possono
                essere memorizzate sul dispositivo dell'utente
                durante la navigazione e successivamente
                utilizzate dal sito o da servizi di terze parti.
              </p>
            </section>

            <section>
              <span className="legal-page__number">
                02
              </span>

              <h2>
                Strumenti necessari
              </h2>

              <div className="legal-page__service-card">
                <span className="legal-page__service-icon">
                  <FiCheck aria-hidden="true" />
                </span>

                <div>
                  <strong>
                    Preferenza relativa al consenso
                  </strong>

                  <p>
                    Il sito utilizza la memoria locale del browser
                    per ricordare se l'utente ha accettato o
                    rifiutato il caricamento dei servizi esterni.
                  </p>

                  <small>
                    Chiave: caf-fapi-cookie-consent
                  </small>
                </div>
              </div>

              <p>
                Questa informazione viene utilizzata esclusivamente
                per ricordare la scelta effettuata dall'utente.
              </p>
            </section>

            <section>
              <span className="legal-page__number">
                03
              </span>

              <h2>
                Google Maps
              </h2>

              <div className="legal-page__service-card">
                <span className="legal-page__service-icon">
                  <FiMap aria-hidden="true" />
                </span>

                <div>
                  <strong>
                    Google Maps
                  </strong>

                  <p>
                    Alcune sezioni del sito permettono di
                    visualizzare la posizione della sede
                    tramite una mappa incorporata di Google.
                  </p>
                </div>
              </div>

              <p>
                Il contenuto Google Maps non viene caricato
                prima che l'utente abbia espresso il proprio
                consenso ai servizi esterni.
              </p>

              <p>
                In caso di rifiuto, viene mostrato un contenuto
                alternativo e l'utente può comunque utilizzare
                il sito e accedere volontariamente al link
                esterno di Google Maps.
              </p>
            </section>

            <section>
              <span className="legal-page__number">
                04
              </span>

              <h2>
                Consenso
              </h2>

              <p>
                Quando l'utente visita il sito per la prima volta,
                viene presentata una richiesta di scelta relativa
                al caricamento dei servizi esterni.
              </p>

              <p>
                L'utente può accettare oppure rifiutare.
                La mancata accettazione non impedisce
                l'utilizzo delle principali funzionalità del sito.
              </p>
            </section>

            <section>
              <span className="legal-page__number">
                05
              </span>

              <h2>
                Come modificare la scelta
              </h2>

              <p>
                La preferenza può essere modificata in qualsiasi
                momento utilizzando il comando
                “Preferenze cookie” disponibile nel footer
                del sito.
              </p>

              <button
                type="button"
                className="legal-page__preferences-button"
                onClick={resetConsent}
              >
                Modifica preferenze cookie
              </button>
            </section>

            <section>
              <span className="legal-page__number">
                06
              </span>

              <h2>
                Modifiche alla Cookie Policy
              </h2>

              <p>
                Questa informativa può essere aggiornata qualora
                vengano aggiunti, rimossi o modificati servizi
                e strumenti utilizzati dal sito.
              </p>
            </section>
          </article>
        </div>
      </section>
    </main>
  );
};

export default CookiePolicyPage;

