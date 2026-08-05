import { FiArrowRight, FiCheck, FiSend, FiShield, FiUsers } from "react-icons/fi";

import volantinoPuntoSemplice from "../assets/home/volantini/punto-semplice.jpeg";
import volantinoDipendenti from "../assets/home/volantini/credipass-dipendenti.jpeg";
import volantinoServizi from "../assets/home/volantini/credipass-servizi.jpeg";

import "./HomePage.css";

const HomePage = () => {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-hero__content">
          <span className="home-hero__eyebrow">
            Centro multiservizi di prossimità
          </span>

          <h1 className="home-hero__title">
            Tutti i servizi
            <span className="home-hero__title-highlight">
              che ti servono,
            </span>
            in un <span className="home-hero__title-accent">unico punto.</span>
          </h1>

          <p className="home-hero__description">
            Assistenza fiscale e sociale, servizi digitali, pagamenti,
            mobilità e soluzioni finanziarie. A Pianopoli, con un supporto
            semplice, chiaro e vicino alle persone.
          </p>

          <div className="home-hero__actions">
            <a href="#servizi" className="home-hero__button home-hero__button--primary">
              Scopri i servizi
              <FiArrowRight />
            </a>

            <a
              href="#richiesta"
              className="home-hero__button home-hero__button--secondary"
            >
              Invia una richiesta
              <FiSend />
            </a>
          </div>

          <div className="home-hero__benefits">
            <div className="home-hero__benefit">
              <span className="home-hero__benefit-icon">
                <FiUsers />
              </span>
              Persone vere, supporto costante
            </div>

            <div className="home-hero__benefit">
              <span className="home-hero__benefit-icon">
                <FiShield />
              </span>
              Pratiche rapide e sicure
            </div>

            <div className="home-hero__benefit">
              <span className="home-hero__benefit-icon">
                <FiCheck />
              </span>
              Assistenza anche da remoto
            </div>
          </div>
        </div>

        <div className="home-flyers" aria-label="Servizi in evidenza">
          <article className="home-flyers__card home-flyers__card--left">
            <img
              src={volantinoPuntoSemplice}
              alt="Servizi SPID, PEC e Firma Digitale Punto Semplice"
            />
          </article>

          <article className="home-flyers__card home-flyers__card--main">
            <img
              src={volantinoDipendenti}
              alt="Cessione del quinto Credipass"
            />
          </article>

          <article className="home-flyers__card home-flyers__card--right">
            <img
              src={volantinoServizi}
              alt="Mutui, prestiti personali e servizi finanziari Credipass"
            />
          </article>

          <div className="home-flyers__controls" aria-label="Selezione volantino">
            <button
              className="home-flyers__dot"
              type="button"
              aria-label="Mostra primo volantino"
            />
            <button
              className="home-flyers__dot home-flyers__dot--active"
              type="button"
              aria-label="Mostra secondo volantino"
            />
            <button
              className="home-flyers__dot"
              type="button"
              aria-label="Mostra terzo volantino"
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;