import {
  FiArrowRight,
  FiCalendar,
  FiCheck,
  FiClock,
  FiFileText,
  FiFolder,
  FiSend,
  FiShield,
  FiUser,
} from "react-icons/fi";

import {
  Link,
} from "react-router-dom";

import "./CtaSection.css";

const ATTIVITA = [
  {
    titolo: "Modello 730",
    stato: "Documenti ricevuti",
    icona: FiFileText,
    variante: "green",
  },
  {
    titolo: "Richiesta ISEE",
    stato: "In lavorazione",
    icona: FiFolder,
    variante: "blue",
  },
  {
    titolo: "Firma digitale",
    stato: "Appuntamento fissato",
    icona: FiCalendar,
    variante: "fuchsia",
  },
];

const CtaSection = () => {
  return (
    <section
      id="richiesta"
      className="cta-section"
      aria-labelledby="cta-section-title"
    >
      <div className="cta-section__container">
        <div className="cta-section__panel">
          <div className="cta-section__content">
            <span className="cta-section__eyebrow">
              Assistenza semplice e continua
            </span>

            <h2
              id="cta-section-title"
              className="cta-section__title"
            >
              Hai bisogno di una pratica?

              <span>
                {" "}
                Al resto pensiamo noi.
              </span>
            </h2>

            <p className="cta-section__description">
              Raccontaci ciò di cui hai
              bisogno. Ti aiutiamo a
              individuare il servizio più
              adatto e ti seguiamo durante
              ogni passaggio.
            </p>

            <div className="cta-section__actions">
              <Link
                to="/contatti"
                className="cta-section__button cta-section__button--primary"
              >
                <FiCalendar
                  aria-hidden="true"
                />

                Prenota un appuntamento
              </Link>

              <Link
                to="/contatti"
                className="cta-section__button cta-section__button--secondary"
              >
                Invia una richiesta

                <FiSend
                  aria-hidden="true"
                />
              </Link>
            </div>

            <div className="cta-section__benefits">
              <span>
                <FiCheck
                  aria-hidden="true"
                />
                Assistenza dedicata
              </span>

              <span>
                <FiCheck
                  aria-hidden="true"
                />
                Anche da remoto
              </span>

              <span>
                <FiCheck
                  aria-hidden="true"
                />
                Tempi chiari
              </span>
            </div>
          </div>

          <div
            className="cta-dashboard"
            aria-label="Anteprima dell’area riservata CAF FAPI"
          >
            <div
              className="cta-dashboard__glow"
              aria-hidden="true"
            />

            <div className="cta-dashboard__window">
              <div className="cta-dashboard__topbar">
                <div className="cta-dashboard__brand">
                  <span className="cta-dashboard__brand-icon">
                    <FiShield
                      aria-hidden="true"
                    />
                  </span>

                  <div>
                    <strong>
                      CAF FAPI
                    </strong>
                    <span>
                      Area riservata
                    </span>
                  </div>
                </div>

                <span className="cta-dashboard__profile">
                  <FiUser
                    aria-hidden="true"
                  />
                </span>
              </div>

              <div className="cta-dashboard__welcome">
                <div>
                  <span>Bentornata</span>
                  <strong>
                    La tua situazione
                  </strong>
                </div>

                <span className="cta-dashboard__status">
                  Tutto aggiornato
                </span>
              </div>

              <div className="cta-dashboard__summary">
                <article>
                  <span className="cta-dashboard__summary-icon cta-dashboard__summary-icon--green">
                    <FiFolder
                      aria-hidden="true"
                    />
                  </span>

                  <div>
                    <strong>3</strong>
                    <span>
                      Pratiche attive
                    </span>
                  </div>
                </article>

                <article>
                  <span className="cta-dashboard__summary-icon cta-dashboard__summary-icon--blue">
                    <FiFileText
                      aria-hidden="true"
                    />
                  </span>

                  <div>
                    <strong>5</strong>
                    <span>
                      Documenti
                    </span>
                  </div>
                </article>

                <article>
                  <span className="cta-dashboard__summary-icon cta-dashboard__summary-icon--fuchsia">
                    <FiCalendar
                      aria-hidden="true"
                    />
                  </span>

                  <div>
                    <strong>2</strong>
                    <span>
                      Appuntamenti
                    </span>
                  </div>
                </article>
              </div>

              <div className="cta-dashboard__section-heading">
                <div>
                  <span>
                    Attività recenti
                  </span>
                  <strong>
                    Le tue pratiche
                  </strong>
                </div>

                <button type="button">
                  Vedi tutte
                </button>
              </div>

              <div className="cta-dashboard__activities">
                {ATTIVITA.map(
                  (attivita) => {
                    const Icona =
                      attivita.icona;

                    return (
                      <article
                        key={
                          attivita.titolo
                        }
                        className="cta-dashboard__activity"
                      >
                        <span
                          className={`cta-dashboard__activity-icon cta-dashboard__activity-icon--${attivita.variante}`}
                        >
                          <Icona
                            aria-hidden="true"
                          />
                        </span>

                        <div>
                          <strong>
                            {
                              attivita.titolo
                            }
                          </strong>
                          <span>
                            {
                              attivita.stato
                            }
                          </span>
                        </div>

                        <FiArrowRight
                          aria-hidden="true"
                        />
                      </article>
                    );
                  },
                )}
              </div>

              <div className="cta-dashboard__appointment">
                <span className="cta-dashboard__appointment-icon">
                  <FiClock
                    aria-hidden="true"
                  />
                </span>

                <div>
                  <span>
                    Prossimo appuntamento
                  </span>

                  <strong>
                    Venerdì, ore 10:30
                  </strong>
                </div>

                <FiArrowRight
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;