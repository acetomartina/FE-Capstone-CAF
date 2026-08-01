import { FiLock, FiMail, FiMapPin, FiPhone, FiShield } from "react-icons/fi";

import "./PublicFooter.css";

const PublicFooter = () => {
  return (
    <footer className="public-footer">
      <div className="public-footer__content">
        <div className="public-footer__security">
          <span className="public-footer__icon">
            <FiShield />
          </span>

          <div>
            <strong>I tuoi dati sono al sicuro.</strong>
            <p>Connessione protetta e dati cifrati.</p>
          </div>
        </div>

        <div className="public-footer__contacts">
          <a href="tel:+393779609155">
            <FiPhone />
            377 960 9155
          </a>

          <a href="mailto:info@caf-fapi-pianopoli.it">
            <FiMail />
            info@caf-fapi-pianopoli.it
          </a>

          <span>
            <FiMapPin />
            Pianopoli
          </span>
        </div>

        <div className="public-footer__privacy">
          <FiLock />
          <span>Privacy e sicurezza</span>
        </div>
      </div>

      <div className="public-footer__bottom">
        <span>© 2026 CAF FAPI Pianopoli</span>
        <span>Tutti i diritti riservati</span>
      </div>
    </footer>
  );
};

export default PublicFooter;