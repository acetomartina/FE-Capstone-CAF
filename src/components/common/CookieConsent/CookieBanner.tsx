import {
  Link,
} from "react-router-dom";

import {
  FiShield,
  FiX,
} from "react-icons/fi";

import {
  useCookieConsent,
} from "./CookieConsentContext";

import "./CookieBanner.css";

const CookieBanner = () => {
  const {
    hasAnswered,
    acceptCookies,
    rejectCookies,
  } = useCookieConsent();

  if (hasAnswered) {
    return null;
  }

  return (
    <div
      className="cookie-banner"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-banner-title"
    >
      <div className="cookie-banner__panel">
        <div className="cookie-banner__icon">
          <FiShield
            aria-hidden="true"
          />
        </div>

        <div className="cookie-banner__content">
          <span className="cookie-banner__eyebrow">
            La tua privacy
          </span>

          <h2 id="cookie-banner-title">
            Scegli come utilizzare
            i servizi esterni.
          </h2>

          <p>
            Utilizziamo strumenti
            necessari al funzionamento
            del sito e, con il tuo
            consenso, servizi esterni
            come Google Maps.
          </p>

          <p className="cookie-banner__legal-copy">
            Puoi cambiare la tua scelta
            in qualsiasi momento.
            Leggi la{" "}
            <Link to="/privacy">
              Privacy Policy
            </Link>{" "}
            e la{" "}
            <Link to="/cookie">
              Cookie Policy
            </Link>
            .
          </p>
        </div>

        <div className="cookie-banner__actions">
          <button
            type="button"
            className="cookie-banner__button cookie-banner__button--ghost"
            onClick={
              rejectCookies
            }
          >
            <FiX
              aria-hidden="true"
            />
            Rifiuta
          </button>

          <button
            type="button"
            className="cookie-banner__button cookie-banner__button--primary"
            onClick={
              acceptCookies
            }
          >
            Accetta
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;