import {
  FiClock,
  FiExternalLink,
  FiMail,
  FiMapPin,
  FiMessageCircle,
  FiPhone,
} from "react-icons/fi";

import {
  useCookieConsent,
} from "../../common/CookieConsent/CookieConsentContext";

import "./ContactSection.css";

const ContactSection = () => {
  const {
    consent,
    resetConsent,
  } = useCookieConsent();

  const mapsConsent =
    consent === "accepted";

  return (
    <section
      id="contatti"
      className="contact-section"
      aria-labelledby="contact-section-title"
    >
      <div className="contact-section__container">
        <div className="contact-section__heading">
          <span className="contact-section__eyebrow">
            Dove trovarci
          </span>

          <h2
            id="contact-section-title"
            className="contact-section__title"
          >
            Siamo sempre
            <span>
              {" "}
              a tua disposizione.
            </span>
          </h2>

          <p className="contact-section__description">
            Puoi venirci a trovare in sede, chiamarci oppure
            scriverci. Ti aiuteremo a capire quale servizio è
            più adatto alla tua esigenza.
          </p>
        </div>

        <div className="contact-section__panel">
          <div className="contact-section__map">
            {mapsConsent ? (
              <iframe
                title="Mappa CAF FAPI Pianopoli"
                src="https://www.google.com/maps?q=Via%20Roma%2069%20Pianopoli&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              <div className="contact-section__map-placeholder">
                <span className="contact-section__map-placeholder-icon">
                  <FiMapPin aria-hidden="true" />
                </span>

                <strong>
                  Mappa non caricata
                </strong>

                <p>
                  Hai scelto di non caricare i servizi esterni.
                  Accetta Google Maps dalle preferenze cookie
                  per visualizzare la mappa.
                </p>

                <button
                  type="button"
                  onClick={resetConsent}
                >
                  Modifica preferenze
                </button>
              </div>
            )}

            <div className="contact-section__map-badge">
              <span>
                <FiMapPin aria-hidden="true" />
              </span>

              <div>
                <strong>
                  CAF FAPI Pianopoli
                </strong>

                <small>
                  Via Roma 69, Pianopoli
                </small>
              </div>
            </div>
          </div>

          <div className="contact-section__content">
            <div className="contact-section__grid">
              <a
                href="tel:+393779609155"
                className="contact-card contact-card--green"
              >
                <span className="contact-card__icon">
                  <FiPhone aria-hidden="true" />
                </span>

                <div>
                  <small>
                    Telefono
                  </small>

                  <strong>
                    377 960 9155
                  </strong>

                  <span>
                    Chiamaci durante gli orari di apertura
                  </span>
                </div>
              </a>

              <a
                href="mailto:pianopolicaf@gmail.com"
                className="contact-card contact-card--fuchsia"
              >
                <span className="contact-card__icon">
                  <FiMail aria-hidden="true" />
                </span>

                <div>
                  <small>
                    Email
                  </small>

                  <strong>
                    pianopolicaf@gmail.com
                  </strong>

                  <span>
                    Scrivici per informazioni e richieste
                  </span>
                </div>
              </a>

              <div className="contact-card contact-card--blue">
                <span className="contact-card__icon">
                  <FiMapPin aria-hidden="true" />
                </span>

                <div>
                  <small>
                    Indirizzo
                  </small>

                  <strong>
                    Via Roma 69
                  </strong>

                  <span>
                    88040 Pianopoli (CZ)
                  </span>
                </div>
              </div>

              <div className="contact-card contact-card--orange">
                <span className="contact-card__icon">
                  <FiClock aria-hidden="true" />
                </span>

                <div>
                  <small>
                    Orari
                  </small>

                  <strong>
                    Lunedì – Venerdì
                  </strong>

                  <span>
                    09:00 – 12:30 / 15:30 – 18:30
                  </span>
                </div>
              </div>
            </div>

            <div className="contact-section__actions">
              <a
                href="https://wa.me/393779609155"
                target="_blank"
                rel="noreferrer"
                className="contact-section__button contact-section__button--primary"
              >
                <FiMessageCircle aria-hidden="true" />
                Scrivici su WhatsApp
              </a>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Via+Roma+69+Pianopoli"
                target="_blank"
                rel="noreferrer"
                className="contact-section__button contact-section__button--secondary"
              >
                Apri Google Maps
                <FiExternalLink aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;