import {
  FiArrowRight,
  FiCheck,
  FiHeart,
  FiMapPin,
  FiMessageCircle,
  FiShield,
  FiUsers,
} from "react-icons/fi";

import {
  Link,
} from "react-router-dom";

import "./ChiSiamoPage.css";

const ChiSiamoPage = () => {
  return (
    <main className="chi-siamo-page">
      <section className="chi-siamo-hero">
        <div className="chi-siamo-container chi-siamo-hero__grid">
          <div className="chi-siamo-hero__content">
            <span className="chi-siamo-eyebrow">
              CAF FAPI Pianopoli
            </span>

            <h1>
              Un punto di riferimento,
              <span> non solo uno sportello.</span>
            </h1>

            <p>
              Ti aiutiamo a orientarti tra pratiche fiscali,
              previdenza e servizi per la vita quotidiana,
              con spiegazioni chiare e assistenza concreta.
            </p>

            <div className="chi-siamo-hero__actions">
              <Link
                to="/servizi"
                className="chi-siamo-button chi-siamo-button--primary"
              >
                Scopri i servizi
                <FiArrowRight />
              </Link>

              <Link
                to="/#contatti"
                className="chi-siamo-button chi-siamo-button--ghost"
              >
                Contattaci
              </Link>
            </div>
          </div>

          <aside className="chi-siamo-note">
            <span className="chi-siamo-note__pin" />

            <small>Il nostro modo di lavorare</small>

            <h2>Prima capiamo, poi procediamo.</h2>

            <p>
              Ogni pratica parte da una cosa semplice:
              capire davvero di cosa hai bisogno.
            </p>

            <div className="chi-siamo-note__checks">
              <span>
                <FiCheck />
                Linguaggio semplice
              </span>

              <span>
                <FiCheck />
                Indicazioni chiare
              </span>

              <span>
                <FiCheck />
                Assistenza della sede
              </span>
            </div>
          </aside>
        </div>
      </section>

      <section className="chi-siamo-intro">
        <div className="chi-siamo-container chi-siamo-intro__grid">
          <div className="chi-siamo-section-label">
            <span className="chi-siamo-section-label__icon">
              <FiUsers />
            </span>

            <span>Chi siamo</span>
          </div>

          <div className="chi-siamo-intro__copy">
            <h2>
              Una sede pensata per semplificare ciò che spesso
              sembra complicato.
            </h2>

            <p>
              CAF FAPI Pianopoli nasce come punto di assistenza
              per cittadini e famiglie. Alla consulenza fiscale
              affianchiamo servizi previdenziali, digitali,
              finanziari e di utilità quotidiana, così da offrire
              un supporto più completo in un unico luogo.
            </p>

            <p>
              Il nostro obiettivo non è riempirti di termini tecnici,
              ma aiutarti a capire quali passaggi servono, cosa
              preparare e come affrontare la tua richiesta.
            </p>
          </div>
        </div>
      </section>

      <section className="chi-siamo-values">
        <div className="chi-siamo-container">
          <header className="chi-siamo-values__header">
            <span>Quello in cui crediamo</span>
            <h2>Tre cose che per noi contano davvero.</h2>
          </header>

          <div className="chi-siamo-values__grid">
            <article>
              <span className="chi-siamo-values__icon">
                <FiMessageCircle />
              </span>

              <small>01</small>

              <h3>Chiarezza</h3>

              <p>
                Spieghiamo pratiche e documenti in modo comprensibile,
                senza dare per scontato che tu conosca procedure e sigle.
              </p>
            </article>

            <article>
              <span className="chi-siamo-values__icon">
                <FiHeart />
              </span>

              <small>02</small>

              <h3>Ascolto</h3>

              <p>
                Partiamo dalla tua situazione per capire quale servizio
                può essere davvero utile e quali passaggi sono necessari.
              </p>
            </article>

            <article>
              <span className="chi-siamo-values__icon">
                <FiShield />
              </span>

              <small>03</small>

              <h3>Continuità</h3>

              <p>
                Non ci fermiamo al primo passaggio: quando una richiesta
                genera una pratica, vogliamo che sia più semplice seguirne
                l’avanzamento.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="chi-siamo-network">
        <div className="chi-siamo-container chi-siamo-network__grid">
          <div className="chi-siamo-network__intro">
            <span>Una rete di servizi</span>

            <h2>
              Più competenze,
              <br />
              nello stesso posto.
            </h2>

            <p>
              La sede integra servizi e collaborazioni diverse
              per permetterti di affrontare esigenze differenti
              senza dover ricominciare ogni volta da zero.
            </p>
          </div>

          <div className="chi-siamo-network__list">
            <div>
              <strong>CAF e fiscale</strong>
              <span>
                Dichiarazioni, ISEE, successioni e adempimenti.
              </span>
            </div>

            <div>
              <strong>Patronato</strong>
              <span>
                Pensioni, NASpI, invalidità e assistenza INPS.
              </span>
            </div>

            <div>
              <strong>Servizi digitali</strong>
              <span>
                SPID, PEC, firma digitale e pagamenti.
              </span>
            </div>

            <div>
              <strong>Utenze e telefonia</strong>
              <span>
                Luce, gas, fibra, mobile e assistenza.
              </span>
            </div>

            <div>
              <strong>Finanziamenti e mobilità</strong>
              <span>
                Mutui, prestiti, noleggio e servizi collegati.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="chi-siamo-method">
        <div className="chi-siamo-container">
          <header className="chi-siamo-method__header">
            <span>Come lavoriamo</span>
            <h2>Un percorso semplice.</h2>
          </header>

          <div className="chi-siamo-method__steps">
            <article>
              <span>01</span>
              <h3>Ti ascoltiamo</h3>
              <p>
                Ci racconti cosa devi fare e da dove parti.
              </p>
            </article>

            <article>
              <span>02</span>
              <h3>Ti orientiamo</h3>
              <p>
                Individuiamo il servizio e i documenti utili.
              </p>
            </article>

            <article>
              <span>03</span>
              <h3>Gestiamo la richiesta</h3>
              <p>
                Avviamo la pratica o il servizio con te.
              </p>
            </article>

            <article>
              <span>04</span>
              <h3>Restiamo un riferimento</h3>
              <p>
                Sai sempre a chi rivolgerti per dubbi e aggiornamenti.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="chi-siamo-closing">
        <div className="chi-siamo-container">
          <div className="chi-siamo-closing__card">
            <div>
              <span>
                <FiMapPin />
                Sede di Pianopoli
              </span>

              <h2>
                Hai una pratica da capire?
                Iniziamo da lì.
              </h2>

              <p>
                Contattaci o passa in sede: ti aiutiamo a capire
                il percorso più adatto alla tua situazione.
              </p>
            </div>

            <Link to="/#contatti">
              Contatta la sede
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ChiSiamoPage;