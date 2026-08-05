import type { CSSProperties } from "react";
import {
  FiArrowRight,
  FiCheckCircle,
  FiMessageCircle,
  FiSearch,
} from "react-icons/fi";

import "./HowItWorksSection.css";

const PASSAGGI = [
  {
    numero: "01",
    titolo: "Scegli il servizio",
    descrizione:
      "Esplora le aree disponibili e individua il servizio più adatto alle tue esigenze.",
    icona: FiSearch,
    variante: "green",
  },
  {
    numero: "02",
    titolo: "Contattaci",
    descrizione:
      "Vieni in sede, chiamaci oppure inviaci una richiesta online in pochi minuti.",
    icona: FiMessageCircle,
    variante: "blue",
  },
  {
    numero: "03",
    titolo: "Pensiamo a tutto noi",
    descrizione:
      "Ti accompagniamo dall’inizio alla fine con assistenza chiara, semplice e continua.",
    icona: FiCheckCircle,
    variante: "fuchsia",
  },
];

const HowItWorksSection = () => {
  return (
    <section
      id="come-funziona"
      className="how-it-works"
      aria-labelledby="how-it-works-title"
    >
      <div className="how-it-works__container">
        <div className="how-it-works__heading">
          <span className="how-it-works__eyebrow">
            Come funziona
          </span>

          <h2
            id="how-it-works-title"
            className="how-it-works__title"
          >
            È tutto molto
            <span> semplice.</span>
          </h2>

          <p className="how-it-works__description">
            Scegli ciò di cui hai bisogno e lascia che il nostro
            team ti accompagni in ogni passaggio.
          </p>
        </div>

        <div className="how-it-works__timeline">
          <div
            className="how-it-works__line"
            aria-hidden="true"
          />

          {PASSAGGI.map((passaggio, indice) => {
            const Icona = passaggio.icona;

            return (
              <article
                key={passaggio.numero}
                className={`how-it-works__step how-it-works__step--${passaggio.variante}`}
                style={{
                  "--step-delay": `${indice * 140}ms`,
                } as CSSProperties}
              >
                <div className="how-it-works__marker">
                  <span className="how-it-works__number">
                    {passaggio.numero}
                  </span>

                  <span className="how-it-works__icon">
                    <Icona aria-hidden="true" />
                  </span>
                </div>

                <div className="how-it-works__step-content">
                  <h3>{passaggio.titolo}</h3>
                  <p>{passaggio.descrizione}</p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="how-it-works__cta">
          <div>
            <span className="how-it-works__cta-label">
              Hai bisogno di aiuto?
            </span>

            <h3>
              Raccontaci cosa ti serve.
              <span> Al resto pensiamo noi.</span>
            </h3>

            <p>
              Puoi contattarci telefonicamente, venire in sede
              oppure inviare una richiesta online.
            </p>
          </div>

          <a
            href="#richiesta"
            className="how-it-works__cta-button"
          >
            Invia una richiesta
            <FiArrowRight aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;