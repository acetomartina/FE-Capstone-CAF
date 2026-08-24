import {
  useEffect,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  FiArrowLeft,
  FiMail,
  FiMapPin,
  FiShield,
} from "react-icons/fi";

import "./LegalPage.css";

const PrivacyPolicyPage = () => {
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
            Privacy
          </span>

          <h1>
            Privacy Policy
          </h1>

          <p>
            Informazioni sul trattamento dei dati personali
            degli utenti che utilizzano il sito di CAF FAPI
            Pianopoli.
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
              <FiShield aria-hidden="true" />

              <span>
                In breve
              </span>

              <p>
                Utilizziamo i dati personali solo quando
                necessari per rispondere alle richieste,
                fornire i servizi richiesti e garantire
                il corretto funzionamento del sito.
              </p>
            </div>
          </aside>

          <article className="legal-page__article">
            <section>
              <span className="legal-page__number">
                01
              </span>

              <h2>
                Titolare del trattamento
              </h2>

              <p>
                Il titolare del trattamento dei dati personali
                raccolti attraverso questo sito è la sede
                CAF FAPI Pianopoli.
              </p>

              <div className="legal-page__contact">
                <span>
                  <FiMapPin aria-hidden="true" />
                  Via Roma 69, Pianopoli (CZ)
                </span>

                <a href="mailto:pianopolicaf@gmail.com">
                  <FiMail aria-hidden="true" />
                  pianopolicaf@gmail.com
                </a>
              </div>
            </section>

            <section>
              <span className="legal-page__number">
                02
              </span>

              <h2>
                Quali dati possiamo trattare
              </h2>

              <p>
                Durante l'utilizzo del sito possono essere
                trattati dati tecnici necessari alla navigazione
                e dati forniti volontariamente dall'utente,
                ad esempio quando ci contatta tramite telefono,
                email o altri canali messi a disposizione.
              </p>

              <p>
                Le informazioni eventualmente trasmesse
                attraverso tali canali saranno utilizzate
                esclusivamente per gestire la richiesta
                dell'utente e le attività ad essa collegate.
              </p>
            </section>

            <section>
              <span className="legal-page__number">
                03
              </span>

              <h2>
                Finalità del trattamento
              </h2>

              <p>
                I dati personali possono essere trattati
                per:
              </p>

              <ul>
                <li>
                  rispondere a richieste di informazioni;
                </li>

                <li>
                  gestire richieste di contatto o appuntamento;
                </li>

                <li>
                  fornire i servizi richiesti dall'utente;
                </li>

                <li>
                  garantire sicurezza e corretto funzionamento
                  del sito;
                </li>

                <li>
                  adempiere a eventuali obblighi di legge.
                </li>
              </ul>
            </section>

            <section>
              <span className="legal-page__number">
                04
              </span>

              <h2>
                Base giuridica
              </h2>

              <p>
                Il trattamento può avvenire quando necessario
                per rispondere a una richiesta dell'utente,
                per l'esecuzione di misure precontrattuali
                o contrattuali, per adempiere a obblighi
                normativi oppure, nei casi previsti, sulla
                base del consenso dell'interessato.
              </p>
            </section>

            <section>
              <span className="legal-page__number">
                05
              </span>

              <h2>
                Servizi esterni
              </h2>

              <p>
                Il sito può integrare servizi forniti da
                soggetti terzi. In particolare, alcune pagine
                possono mostrare una mappa fornita da Google
                Maps.
              </p>

              <p>
                La mappa viene caricata solo dopo che l'utente
                ha espresso il proprio consenso ai servizi
                esterni attraverso il sistema di gestione
                delle preferenze cookie del sito.
              </p>
            </section>

            <section>
              <span className="legal-page__number">
                06
              </span>

              <h2>
                Conservazione dei dati
              </h2>

              <p>
                I dati vengono conservati per il tempo necessario
                alla gestione della richiesta e, quando previsto,
                per i periodi richiesti dalla normativa applicabile.
              </p>
            </section>

            <section>
              <span className="legal-page__number">
                07
              </span>

              <h2>
                Destinatari dei dati
              </h2>

              <p>
                I dati possono essere trattati da personale
                autorizzato e da eventuali fornitori tecnici
                necessari al funzionamento del sito o
                all'erogazione dei servizi, nei limiti delle
                rispettive competenze.
              </p>
            </section>

            <section>
              <span className="legal-page__number">
                08
              </span>

              <h2>
                Diritti dell'interessato
              </h2>

              <p>
                Nei casi previsti dalla normativa, l'interessato
                può esercitare i propri diritti in materia di
                protezione dei dati personali, tra cui accesso,
                rettifica, cancellazione, limitazione,
                opposizione e portabilità dei dati.
              </p>

              <p>
                È inoltre possibile revocare un consenso
                precedentemente espresso senza pregiudicare
                la liceità del trattamento effettuato prima
                della revoca.
              </p>

              <p>
                Le richieste possono essere inviate a:
                {" "}
                <a href="mailto:pianopolicaf@gmail.com">
                  pianopolicaf@gmail.com
                </a>
                .
              </p>
            </section>

            <section>
              <span className="legal-page__number">
                09
              </span>

              <h2>
                Reclamo
              </h2>

              <p>
                L'interessato può proporre reclamo all'Autorità
                Garante per la protezione dei dati personali
                nei casi previsti dalla normativa.
              </p>
            </section>

            <section>
              <span className="legal-page__number">
                10
              </span>

              <h2>
                Modifiche alla presente informativa
              </h2>

              <p>
                La presente Privacy Policy può essere aggiornata
                per adeguarla a modifiche normative, tecniche
                o organizzative. La versione aggiornata sarà
                pubblicata su questa pagina.
              </p>
            </section>
          </article>
        </div>
      </section>
    </main>
  );
};

export default PrivacyPolicyPage;

