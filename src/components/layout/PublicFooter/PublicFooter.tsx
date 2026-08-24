import {
  FiLock,
  FiMail,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";

import {
  useCookieConsent,
} from "../../common/CookieConsent/CookieConsentContext";

import {
  Link,
} from "react-router-dom";

import "./PublicFooter.css";

const PublicFooter = () => {
  const {
  resetConsent,
} = useCookieConsent();

  return (
    <footer className="public-footer">
      <div className="public-footer__container">
        <div className="public-footer__top">
          <div className="public-footer__brand">
            <h3>
              CAF FAPI Pianopoli
            </h3>

            <p>
              Centro multiservizi per
              cittadini, famiglie e
              imprese.
            </p>

            <div className="public-footer__secure">
              <FiLock aria-hidden="true" />

              <span>
                Connessione protetta
              </span>
            </div>
          </div>

          <div className="public-footer__column">
            <h4>Servizi</h4>

            <Link to="/servizi">
              CAF
            </Link>

            <Link to="/servizi">
              Patronato
            </Link>

            <Link to="/servizi">
              SPID
            </Link>

            <Link to="/servizi">
              Firma Digitale
            </Link>

            <Link to="/servizi">
              Mutui
            </Link>
          </div>

          <div className="public-footer__column">
            <h4>Link</h4>

            <Link to="/">
              Home
            </Link>

            <Link to="/servizi">
              Servizi
            </Link>

            <Link to="/chi-siamo">
              Chi siamo
            </Link>

            <Link to="/contatti">
              Contatti
            </Link>

            <Link to="/login">
              Area Riservata
            </Link>
          </div>

          <div className="public-footer__column">
            <h4>Contatti</h4>

            <a href="tel:+393779609155">
              <FiPhone aria-hidden="true" />
              377 960 9155
            </a>

            <a href="mailto:pianopolicaf@gmail.com">
              <FiMail aria-hidden="true" />
              pianopolicaf@gmail.com
            </a>

            <span className="public-footer__address">
              <FiMapPin aria-hidden="true" />

              <span>
                Via Roma 69
                <br />
                Pianopoli (CZ)
              </span>
            </span>
          </div>
        </div>

        <div className="public-footer__bottom">
          <div className="public-footer__bottom-left">
            <span>
              © 2026 CAF FAPI Pianopoli
            </span>

            <nav
  className="public-footer__legal"
  aria-label="Informazioni legali"
>
  <Link to="/privacy">
    Privacy Policy
  </Link>

  <span aria-hidden="true">
    ·
  </span>

  <Link to="/cookie">
    Cookie Policy
  </Link>

  <span aria-hidden="true">
    ·
  </span>

  <button
    type="button"
    className="public-footer__cookie-preferences"
    onClick={resetConsent}
  >
    Preferenze cookie
  </button>
</nav>
          </div>

          <div className="public-footer__credits">
            <span>
              Realizzato da
            </span>

            <strong>
              martina.dstudio
            </strong>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;