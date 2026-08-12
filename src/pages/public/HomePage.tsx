import {
  useEffect,
  useRef,
  useState,
  type TouchEvent,
} from "react";
import {
  FiArrowRight,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiSend,
  FiShield,
  FiUsers,
} from "react-icons/fi";

import volantinoPuntoSemplice from "../../assets/home/volantini/punto-semplice.jpeg";
import volantinoDipendenti from "../../assets/home/volantini/credipass-dipendenti.jpeg";
import volantinoPrestito from "../../assets/home/volantini/credipass-prestito.jpeg";
import volantinoServizi from "../../assets/home/volantini/credipass-servizi.jpeg";

import PartnerSection from "../../components/home/PartnerSection/PartnerSection";
import ServicesSection from "../../components/home/ServicesSection/ServicesSection";
import HowItWorksSection from "../../components/home/HowItWorksSection/HowItWorksSection";
import CtaSection from "../../components/home/CtaSection/CtaSection";
import ContactSection from "../../components/home/ContactSection/ContactSection";


import "./HomePage.css";

type PosizioneVolantino =
  | "left"
  | "main"
  | "right"
  | "hidden";

interface Volantino {
  id: number;
  src: string;
  alt: string;
  titolo: string;
}

const VOLANTINI: Volantino[] = [
  {
    id: 0,
    src: volantinoPuntoSemplice,
    alt: "Servizi SPID, PEC e Firma Digitale Punto Semplice",
    titolo: "Servizi digitali",
  },
  {
    id: 1,
    src: volantinoDipendenti,
    alt: "Cessione del quinto per dipendenti Credipass",
    titolo: "Cessione del quinto",
  },
  {
    id: 2,
    src: volantinoPrestito,
    alt: "Prestito personale Credipass",
    titolo: "Prestiti personali",
  },
  {
    id: 3,
    src: volantinoServizi,
    alt: "Mutui, prestiti e soluzioni finanziarie Credipass",
    titolo: "Soluzioni finanziarie",
  },
];

const HomePage = () => {
  const [indiceAttivo, setIndiceAttivo] = useState(1);
  const [caroselloInPausa, setCaroselloInPausa] =
    useState(false);

  const touchStartX = useRef<number | null>(null);

  const mostraSuccessivo = () => {
    setIndiceAttivo(
      (indiceCorrente) =>
        (indiceCorrente + 1) % VOLANTINI.length,
    );
  };

  const mostraPrecedente = () => {
    setIndiceAttivo(
      (indiceCorrente) =>
        (indiceCorrente - 1 + VOLANTINI.length) %
        VOLANTINI.length,
    );
  };

  const ottieniPosizione = (
    indice: number,
  ): PosizioneVolantino => {
    const precedente =
      (indiceAttivo - 1 + VOLANTINI.length) %
      VOLANTINI.length;

    const successivo =
      (indiceAttivo + 1) % VOLANTINI.length;

    if (indice === indiceAttivo) {
      return "main";
    }

    if (indice === precedente) {
      return "left";
    }

    if (indice === successivo) {
      return "right";
    }

    return "hidden";
  };

  const gestisciTouchStart = (
    evento: TouchEvent<HTMLDivElement>,
  ) => {
    touchStartX.current =
      evento.touches[0]?.clientX ?? null;
  };

  const gestisciTouchEnd = (
    evento: TouchEvent<HTMLDivElement>,
  ) => {
    if (touchStartX.current === null) {
      return;
    }

    const touchEndX =
      evento.changedTouches[0]?.clientX;

    if (touchEndX === undefined) {
      return;
    }

    const distanza = touchEndX - touchStartX.current;

    if (Math.abs(distanza) >= 50) {
      if (distanza < 0) {
        mostraSuccessivo();
      } else {
        mostraPrecedente();
      }
    }

    touchStartX.current = null;
  };

  useEffect(() => {
    if (caroselloInPausa) {
      return;
    }

    const intervallo = window.setInterval(
      mostraSuccessivo,
      5000,
    );

    return () => {
      window.clearInterval(intervallo);
    };
  }, [caroselloInPausa]);

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
            in un{" "}
            <span className="home-hero__title-accent">
              unico punto.
            </span>
          </h1>

          <p className="home-hero__description">
            Assistenza fiscale e sociale, servizi
            digitali, pagamenti, mobilità e soluzioni
            finanziarie. A Pianopoli, con un supporto
            semplice, chiaro e vicino alle persone.
          </p>

          <div className="home-hero__actions">
            <a
              href="#servizi"
              className="home-hero__button home-hero__button--primary"
            >
              Scopri i servizi
              <FiArrowRight aria-hidden="true" />
            </a>

            <a
              href="#richiesta"
              className="home-hero__button home-hero__button--secondary"
            >
              Invia una richiesta
              <FiSend aria-hidden="true" />
            </a>
          </div>

          <div className="home-hero__benefits">
            <div className="home-hero__benefit">
              <span className="home-hero__benefit-icon home-hero__benefit-icon--green">
                <FiUsers aria-hidden="true" />
              </span>

              <span>
                Persone vere, supporto costante
              </span>
            </div>

            <div className="home-hero__benefit">
              <span className="home-hero__benefit-icon home-hero__benefit-icon--blue">
                <FiShield aria-hidden="true" />
              </span>

              <span>Pratiche rapide e sicure</span>
            </div>

            <div className="home-hero__benefit">
              <span className="home-hero__benefit-icon home-hero__benefit-icon--fuchsia">
                <FiCheck aria-hidden="true" />
              </span>

              <span>Assistenza anche da remoto</span>
            </div>
          </div>
        </div>

        <div
          className="home-flyers"
          aria-label="Servizi in evidenza"
          onMouseEnter={() =>
            setCaroselloInPausa(true)
          }
          onMouseLeave={() =>
            setCaroselloInPausa(false)
          }
          onTouchStart={gestisciTouchStart}
          onTouchEnd={gestisciTouchEnd}
        >
          <div
            className="home-flyers__glow"
            aria-hidden="true"
          />

          <div className="home-flyers__stage">
            {VOLANTINI.map((volantino, indice) => {
              const posizione =
                ottieniPosizione(indice);

              return (
                <button
                  key={volantino.id}
                  type="button"
                  className={`home-flyers__card home-flyers__card--${posizione}`}
                  onClick={() => {
                    if (posizione === "left") {
                      mostraPrecedente();
                    }

                    if (posizione === "right") {
                      mostraSuccessivo();
                    }
                  }}
                  aria-label={
                    posizione === "main"
                      ? `${volantino.titolo}, volantino attivo`
                      : `Mostra ${volantino.titolo}`
                  }
                  aria-hidden={
                    posizione === "hidden"
                  }
                  tabIndex={
                    posizione === "hidden" ? -1 : 0
                  }
                >
                  <img
                    src={volantino.src}
                    alt={volantino.alt}
                    draggable="false"
                  />

                  <span className="home-flyers__card-overlay">
                    <span>
                      {volantino.titolo}
                    </span>

                    <FiArrowRight
                      aria-hidden="true"
                    />
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="home-flyers__arrow home-flyers__arrow--left"
            onClick={mostraPrecedente}
            aria-label="Mostra il volantino precedente"
          >
            <FiChevronLeft aria-hidden="true" />
          </button>

          <button
            type="button"
            className="home-flyers__arrow home-flyers__arrow--right"
            onClick={mostraSuccessivo}
            aria-label="Mostra il volantino successivo"
          >
            <FiChevronRight aria-hidden="true" />
          </button>
        </div>
      </section>

      <PartnerSection />
      <ServicesSection />
      <HowItWorksSection />
      <CtaSection />
      <ContactSection />

    </main>
  );
};

export default HomePage;