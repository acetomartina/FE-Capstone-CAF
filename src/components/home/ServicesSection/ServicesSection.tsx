import type {
  CSSProperties,
} from "react";

import type {
  IconType,
} from "react-icons";

import {
  FiArrowRight,
  FiCreditCard,
  FiFileText,
  FiMonitor,
  FiPhone,
  FiTruck,
  FiZap,
} from "react-icons/fi";

import {
  Link,
} from "react-router-dom";

import "./ServicesSection.css";

type VarianteServizio =
  | "green"
  | "blue"
  | "fuchsia"
  | "orange"
  | "petrol"
  | "purple";

interface MacroareaServizio {
  id: string;
  titolo: string;
  descrizione: string;
  servizi: string[];
  conteggio: string;
  variante: VarianteServizio;
  icona: IconType;
  badge?: string;
}

const MACROAREE: MacroareaServizio[] = [
  {
    id: "caf-e-fiscale",
    titolo: "CAF e fiscale",
    descrizione:
      "Assistenza fiscale, previdenziale e sociale per cittadini e famiglie.",
    servizi: [
      "Modello 730",
      "ISEE",
      "IMU",
      "RED",
      "Pensioni",
      "Invalidità",
    ],
    conteggio:
      "18 servizi disponibili",
    variante: "green",
    icona: FiFileText,
  },
  {
    id: "energia-e-gas",
    titolo: "Energia e gas",
    descrizione:
      "Supporto nella gestione delle utenze domestiche e aziendali.",
    servizi: [
      "Volture",
      "Subentri",
      "Nuove attivazioni",
      "Cambio gestore",
    ],
    conteggio:
      "8 servizi disponibili",
    variante: "orange",
    icona: FiZap,
  },
  {
    id: "telefonia-e-internet",
    titolo: "Telefonia e internet",
    descrizione:
      "Soluzioni mobile, fibra e connettività per casa e attività.",
    servizi: [
      "Mobile",
      "Fibra",
      "Offerte casa",
      "Business",
    ],
    conteggio:
      "7 servizi disponibili",
    variante: "blue",
    icona: FiPhone,
  },
  {
    id: "finanziamenti",
    titolo: "Finanziamenti",
    descrizione:
      "Consulenza per prestiti, mutui e soluzioni di credito.",
    servizi: [
      "Prestiti personali",
      "Mutui",
      "Cessione del quinto",
      "Delegazione di pagamento",
    ],
    conteggio:
      "6 servizi disponibili",
    variante: "fuchsia",
    icona: FiCreditCard,
  },
  {
    id: "mobilita-e-logistica",
    titolo: "Mobilità e logistica",
    descrizione:
      "Servizi per auto, noleggio, spedizioni e punti di ritiro.",
    servizi: [
      "Noleggio auto",
      "Assicurazioni",
      "Bollo auto",
      "Amazon Hub",
      "Spedizioni",
    ],
    conteggio:
      "9 servizi disponibili",
    variante: "purple",
    icona: FiTruck,
  },
  {
    id: "servizi-digitali",
    titolo: "Servizi digitali",
    descrizione:
      "Identità digitale, strumenti online e soluzioni web su misura.",
    servizi: [
      "SPID",
      "PEC",
      "Firma digitale",
      "Siti web",
      "Gestionali",
      "Assistenza da remoto",
    ],
    conteggio:
      "10 servizi disponibili",
    variante: "petrol",
    icona: FiMonitor,
    badge: "martina.dstudio",
  },
];

const ServicesSection = () => {
  return (
    <section
      id="servizi"
      className="services-section"
      aria-labelledby="services-title"
    >
      <div className="services-section__container">
        <div className="services-section__heading">
          <span className="services-section__eyebrow">
            Cosa possiamo fare per te
          </span>

          <div className="services-section__heading-row">
            <div>
              <h2
                id="services-title"
                className="services-section__title"
              >
                Tante esigenze.

                <span>
                  {" "}
                  Un solo punto di
                  riferimento.
                </span>
              </h2>

              <p className="services-section__description">
                Scegli l’area che ti
                interessa e scopri tutti i
                servizi disponibili presso
                la sede CAF FAPI di
                Pianopoli.
              </p>
            </div>

            <Link
              to="/servizi#aree-servizi"
              className="services-section__all-link"
            >
              Vedi tutti i servizi

              <FiArrowRight
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>

        <div className="services-section__grid">
          {MACROAREE.map(
            (
              macroarea,
              indice,
            ) => {
              const Icona =
                macroarea.icona;

              return (
                <Link
                  key={macroarea.id}
                  to={`/servizi#${macroarea.id}`}
                  className="services-card__link"
                  aria-label={`Scopri i servizi dell'area ${macroarea.titolo}`}
                >
                  <article
                    className={`services-card services-card--${macroarea.variante}`}
                    style={
                      {
                        "--services-card-delay": `${indice * 70}ms`,
                      } as CSSProperties
                    }
                  >
                    <div className="services-card__top">
                      <span className="services-card__icon">
                        <Icona
                          aria-hidden="true"
                        />
                      </span>

                      {macroarea.badge && (
                        <span className="services-card__badge">
                          {
                            macroarea.badge
                          }
                        </span>
                      )}
                    </div>

                    <div className="services-card__content">
                      <h3>
                        {
                          macroarea.titolo
                        }
                      </h3>

                      <p className="services-card__description">
                        {
                          macroarea.descrizione
                        }
                      </p>

                      <ul className="services-card__list">
                        {macroarea.servizi.map(
                          (
                            servizio,
                          ) => (
                            <li
                              key={
                                servizio
                              }
                            >
                              <span
                                aria-hidden="true"
                              />

                              {
                                servizio
                              }
                            </li>
                          ),
                        )}
                      </ul>
                    </div>

                    <div className="services-card__footer">
                      <span>
                        {
                          macroarea.conteggio
                        }
                      </span>

                      <span className="services-card__cta">
                        Scopri di più

                        <FiArrowRight
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </article>
                </Link>
              );
            },
          )}
        </div>

        <div className="services-section__mobile-link">
          <Link to="/servizi#aree-servizi">
            Vedi tutti i servizi

            <FiArrowRight
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;