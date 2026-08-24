import {
  FiArrowRight,
  FiClock,
  FiMail,
  FiMapPin,
  FiNavigation,
  FiPhone,
} from "react-icons/fi";

import "./ContattiPage.css";

const ContattiPage = () => {
  const mapsQuery =
    "Via Roma 69, Pianopoli CZ";

  const mapsEmbedUrl =
    `https://www.google.com/maps?q=${encodeURIComponent(
      mapsQuery,
    )}&output=embed`;

  const mapsDirectionsUrl =
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      mapsQuery,
    )}`;

  return (
    <main className="contatti-page">
      <section className="contatti-hero">
        <div className="contatti-container contatti-hero__grid">
          <div className="contatti-hero__content">
            <span className="contatti-eyebrow">
              Contatti
            </span>

            <h1>
              Parliamone.
              <span> Ti aiutiamo a capire da dove iniziare.</span>
            </h1>

            <p>
              Puoi chiamarci, scriverci o passare direttamente
              in sede. Se non sai quale servizio scegliere,
              raccontaci la tua esigenza e ti orientiamo noi.
            </p>

            <div className="contatti-hero__actions">
              <a
                href="tel:+393779609155"
                className="contatti-button contatti-button--primary"
              >
                <FiPhone />
                Chiama la sede
              </a>

              <a
                href="mailto:pianopolicaf@gmail.com"
                className="contatti-button contatti-button--ghost"
              >
                <FiMail />
                Scrivici
              </a>
            </div>
          </div>

          <aside className="contatti-quick-card">
            <span className="contatti-quick-card__pin" />

            <small>Contatto rapido</small>

            <h2>CAF FAPI Pianopoli</h2>

            <div className="contatti-quick-card__items">
              <a href="tel:+393779609155">
                <FiPhone />
                <span>
                  <small>Telefono</small>
                  <strong>377 960 9155</strong>
                </span>
              </a>

              <a href="mailto:pianopolicaf@gmail.com">
                <FiMail />
                <span>
                  <small>Email</small>
                  <strong>pianopolicaf@gmail.com</strong>
                </span>
              </a>

              <div>
                <FiMapPin />
                <span>
                  <small>Sede</small>
                  <strong>
                    Via Roma 69
                    <br />
                    Pianopoli (CZ)
                  </strong>
                </span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="contatti-info">
        <div className="contatti-container">
          <header className="contatti-section-heading">
            <span>Come raggiungerci</span>

            <h2>
              Siamo a Pianopoli,
              <br />
              in Via Roma 69.
            </h2>

            <p>
              Se preferisci venire in sede, qui trovi la posizione
              e i recapiti da tenere a portata di mano.
            </p>
          </header>

          <div className="contatti-info__grid">
            <article className="contatti-info-card">
              <span className="contatti-info-card__icon">
                <FiPhone />
              </span>

              <small>Telefono</small>

              <h3>377 960 9155</h3>

              <p>
                Per informazioni, appuntamenti e richieste rapide.
              </p>

              <a href="tel:+393779609155">
                Chiama ora
                <FiArrowRight />
              </a>
            </article>

            <article className="contatti-info-card">
              <span className="contatti-info-card__icon">
                <FiMail />
              </span>

              <small>Email</small>

              <h3>pianopolicaf@gmail.com</h3>

              <p>
                Scrivici se preferisci descrivere la tua richiesta
                con calma.
              </p>

              <a href="mailto:pianopolicaf@gmail.com">
                Invia una mail
                <FiArrowRight />
              </a>
            </article>

            <article className="contatti-info-card">
              <span className="contatti-info-card__icon">
                <FiMapPin />
              </span>

              <small>Indirizzo</small>

              <h3>Via Roma 69</h3>

              <p>
                Pianopoli (CZ). Apri Maps per ottenere le
                indicazioni stradali.
              </p>

              <a
                href={mapsDirectionsUrl}
                target="_blank"
                rel="noreferrer"
              >
                Indicazioni
                <FiNavigation />
              </a>
            </article>
          </div>
        </div>
      </section>

      <section className="contatti-map-section">
        <div className="contatti-container">
          <div className="contatti-map-section__grid">
            <div className="contatti-map-section__copy">
              <span>La sede</span>

              <h2>
                Trovarci è semplice.
              </h2>

              <p>
                La mappa qui accanto mostra la sede di
                Via Roma 69, Pianopoli.
              </p>

              <div className="contatti-map-section__address">
                <FiMapPin />

                <div>
                  <strong>CAF FAPI Pianopoli</strong>
                  <span>Via Roma 69 · Pianopoli (CZ)</span>
                </div>
              </div>

              <a
                href={mapsDirectionsUrl}
                target="_blank"
                rel="noreferrer"
                className="contatti-map-section__directions"
              >
                <FiNavigation />
                Apri in Google Maps
              </a>
            </div>

            <div className="contatti-map">
              <iframe
                title="Mappa CAF FAPI Pianopoli"
                src={mapsEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      <section className="contatti-hours">
        <div className="contatti-container">
          <div className="contatti-hours__card">
            <span className="contatti-hours__icon">
              <FiClock />
            </span>

            <div>
              <span>Orari</span>

              <h2>Lunedì – Venerdì</h2>

              <p className="contatti-hours__time">
                09:00 – 13:00
                <span>/</span>
                15:00 – 18:00
              </p>

              <p>
                Per pratiche che richiedono più tempo,
                ti consigliamo di contattarci prima di passare.
              </p>
            </div>

            <a href="tel:+393779609155">
              Chiama la sede
              <FiArrowRight />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContattiPage;