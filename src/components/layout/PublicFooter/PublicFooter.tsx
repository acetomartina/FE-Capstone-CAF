import {
  FiLock,
  FiMail,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";

import "./PublicFooter.css";

const PublicFooter = () => {
  return (
    <footer className="public-footer">
      <div className="public-footer__container">
        <div className="public-footer__top">

          <div className="public-footer__brand">
            <h3>CAF FAPI Pianopoli</h3>

            <p>
              Centro multiservizi per cittadini,
              famiglie e imprese.
            </p>

            <div className="public-footer__secure">
              <FiLock />

              <span>Connessione protetta</span>
            </div>
          </div>

          <div className="public-footer__column">
            <h4>Servizi</h4>

            <a href="/servizi">CAF</a>
            <a href="/servizi">Patronato</a>
            <a href="/servizi">SPID</a>
            <a href="/servizi">Firma Digitale</a>
            <a href="/servizi">Mutui</a>
          </div>

          <div className="public-footer__column">
            <h4>Link</h4>

            <a href="/">Home</a>
            <a href="/servizi">Servizi</a>
            <a href="/chi-siamo">Chi siamo</a>
            <a href="/contatti">Contatti</a>
            <a href="/login">Area Riservata</a>
          </div>

          <div className="public-footer__column">
            <h4>Contatti</h4>

            <a href="tel:+393779609155">
              <FiPhone />
              377 960 9155
            </a>

            <a href="mailto:pianopolicaf@gmail.com">
              <FiMail />
              pianopolicaf@gmail.com
            </a>

            <span>
              <FiMapPin />
              Via Roma 69
              <br />
              Pianopoli (CZ)
            </span>
          </div>

        </div>

        <div className="public-footer__bottom">

          <span>
            © 2026 CAF FAPI Pianopoli
          </span>

          <div className="public-footer__credits">
  <span>Realizzato da</span>
  <strong>martina.dstudio</strong>
</div>

        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;